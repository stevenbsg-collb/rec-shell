import { useState, useCallback } from 'react';
import { useNotifications, NOTIFICATION_MESSAGES } from '@rec-shell/rec-web-shared';
import { ImagenAnalisis } from '../../../types/yolo';
export const useFileUpload = () => {
  const [imagenes, setImagenes] = useState<ImagenAnalisis[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const notifications = useNotifications();

  const generarId = () =>
    `img-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

  const convertirABase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  };

  const obtenerDimensionesImagen = (dataUrl: string): Promise<{ ancho: number; alto: number }> => {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.onload = () => resolve({ ancho: img.naturalWidth, alto: img.naturalHeight });
      img.onerror = () => reject(new Error('No se pudo leer las dimensiones de la imagen'));
      img.src = dataUrl;
    });
  };

  /**
   * Intenta extraer GPS del EXIF (solo JPEG normalmente).
   * Devuelve null si no existe EXIF/GPS o si no se puede leer.
   */
  const extraerGPSExif = async (
    file: File
  ): Promise<{ latitude: number; longitude: number; altitude?: number } | null> => {
    // Por privacidad del navegador, NO existe la "ruta" local real del archivo.
    // Aquí hablamos de ubicación GPS (si la imagen la trae en EXIF).
    const mime = (file.type || '').toLowerCase();
    const esJpeg = mime === 'image/jpeg' || mime === 'image/jpg';
    if (!esJpeg) return null;

    try {
      const buffer = await file.arrayBuffer();
      const view = new DataView(buffer);

      // JPEG SOI
      if (view.byteLength < 4 || view.getUint16(0) !== 0xffd8) return null;

      let offset = 2;
      while (offset + 4 < view.byteLength) {
        if (view.getUint8(offset) !== 0xff) return null;
        const marker = view.getUint8(offset + 1);
        offset += 2;

        // SOS (Start of Scan) o EOI: se acabaron los metadatos
        if (marker === 0xda || marker === 0xd9) break;

        const segmentLength = view.getUint16(offset); // incluye estos 2 bytes
        const segmentStart = offset + 2;

        // APP1 (EXIF)
        if (marker === 0xe1 && segmentLength >= 8) {
          // "Exif\0\0"
          const exif0 = view.getUint32(segmentStart);
          const exif1 = view.getUint16(segmentStart + 4);
          if (exif0 === 0x45786966 && exif1 === 0x0000) {
            const tiffStart = segmentStart + 6;
            return parseTiffGPS(view, tiffStart);
          }
        }

        offset += segmentLength;
      }
    } catch {
      // noop
    }

    return null;
  };

  const parseTiffGPS = (
    view: DataView,
    tiffStart: number
  ): { latitude: number; longitude: number; altitude?: number } | null => {
    if (tiffStart + 8 >= view.byteLength) return null;

    const byte0 = view.getUint8(tiffStart);
    const byte1 = view.getUint8(tiffStart + 1);
    const littleEndian = byte0 === 0x49 && byte1 === 0x49; // "II"
    const bigEndian = byte0 === 0x4d && byte1 === 0x4d; // "MM"
    if (!littleEndian && !bigEndian) return null;

    const u16 = (o: number) => view.getUint16(o, littleEndian);
    const u32 = (o: number) => view.getUint32(o, littleEndian);

    // 0x002A
    if (u16(tiffStart + 2) !== 0x002a) return null;

    const ifd0Offset = u32(tiffStart + 4);
    const ifd0Start = tiffStart + ifd0Offset;
    if (ifd0Start + 2 >= view.byteLength) return null;

    const numEntries = u16(ifd0Start);
    let gpsIfdOffset: number | null = null;

    for (let i = 0; i < numEntries; i++) {
      const entry = ifd0Start + 2 + i * 12;
      if (entry + 12 > view.byteLength) break;

      const tag = u16(entry);
      // const type = u16(entry + 2);
      // const count = u32(entry + 4);
      const valueOffset = entry + 8;

      // GPSInfoIFDPointer
      if (tag === 0x8825) {
        gpsIfdOffset = u32(valueOffset);
        break;
      }
    }

    if (gpsIfdOffset == null) return null;

    const gpsIfdStart = tiffStart + gpsIfdOffset;
    if (gpsIfdStart + 2 >= view.byteLength) return null;

    const gpsEntries = u16(gpsIfdStart);

    let latRef: 'N' | 'S' | null = null;
    let lonRef: 'E' | 'W' | null = null;
    let lat: number[] | null = null;
    let lon: number[] | null = null;
    let altitude: number | undefined = undefined;

    const readAscii = (valueFieldOffset: number, count: number) => {
      const start = count <= 4 ? valueFieldOffset : tiffStart + u32(valueFieldOffset);
      if (start < 0 || start >= view.byteLength) return '';
      const max = Math.min(count, view.byteLength - start);
      let out = '';
      for (let i = 0; i < max; i++) {
        const c = view.getUint8(start + i);
        if (c === 0) break;
        out += String.fromCharCode(c);
      }
      return out;
    };

    const readRationals = (valueFieldOffset: number, count: number) => {
      const start = tiffStart + u32(valueFieldOffset);
      if (start < 0 || start + count * 8 > view.byteLength) return null;
      const arr: number[] = [];
      for (let i = 0; i < count; i++) {
        const num = u32(start + i * 8);
        const den = u32(start + i * 8 + 4);
        if (den === 0) return null;
        arr.push(num / den);
      }
      return arr;
    };

    for (let i = 0; i < gpsEntries; i++) {
      const entry = gpsIfdStart + 2 + i * 12;
      if (entry + 12 > view.byteLength) break;

      const tag = u16(entry);
      const type = u16(entry + 2);
      const count = u32(entry + 4);
      const valueFieldOffset = entry + 8;

      // GPSLatitudeRef (ASCII)
      if (tag === 0x0001 && type === 2) {
        const ref = readAscii(valueFieldOffset, count).trim().toUpperCase();
        if (ref === 'N' || ref === 'S') latRef = ref;
      }

      // GPSLatitude (RATIONAL[3])
      if (tag === 0x0002 && type === 5 && count >= 3) {
        const r = readRationals(valueFieldOffset, 3);
        if (r) lat = r;
      }

      // GPSLongitudeRef (ASCII)
      if (tag === 0x0003 && type === 2) {
        const ref = readAscii(valueFieldOffset, count).trim().toUpperCase();
        if (ref === 'E' || ref === 'W') lonRef = ref;
      }

      // GPSLongitude (RATIONAL[3])
      if (tag === 0x0004 && type === 5 && count >= 3) {
        const r = readRationals(valueFieldOffset, 3);
        if (r) lon = r;
      }

      // GPSAltitudeRef (BYTE)
      // GPSAltitude (RATIONAL)
      if (tag === 0x0006 && type === 5 && count >= 1) {
        const r = readRationals(valueFieldOffset, 1);
        if (r) altitude = r[0];
      }
    }

    if (!lat || !lon || !latRef || !lonRef) return null;

    const toDegrees = (dms: number[]) => dms[0] + dms[1] / 60 + dms[2] / 3600;
    let latitude = toDegrees(lat);
    let longitude = toDegrees(lon);

    if (latRef === 'S') latitude = -latitude;
    if (lonRef === 'W') longitude = -longitude;

    return { latitude, longitude, altitude };
  };

  const handleFileSelect = useCallback(async (files: FileList | null) => {
    if (!files || files.length === 0) return;

    const nuevasImagenes: ImagenAnalisis[] = [];

    for (let i = 0; i < files.length; i++) {
      const file = files[i];

      if (!file.type.startsWith('image/')) {
        notifications.error(
          NOTIFICATION_MESSAGES.GENERAL.ERROR.title,
          `${file.name} no es una imagen válida`
        );
        continue;
      }

      try {
        const base64 = await convertirABase64(file);
        // GPS (EXIF) si existe
        let gps:
          | { latitude: number; longitude: number; altitude?: number }
          | undefined;
        try {
          const gpsParsed = await extraerGPSExif(file);
          if (gpsParsed) gps = gpsParsed;
        } catch {
          gps = undefined;
        }
        // Extraer metadata básica del archivo (local)
        let dimensiones: { ancho: number; alto: number } | undefined;
        try {
          dimensiones = await obtenerDimensionesImagen(base64);
        } catch {
          // Si falla, no bloqueamos la carga
          dimensiones = undefined;
        }
        const objectUrl = URL.createObjectURL(file);

        nuevasImagenes.push({
          id: generarId(),
          file,
          previewUrl: objectUrl,
          base64,
          resultado: null,
          estado: 'pendiente',
          metadataArchivo: {
            tipoMime: file.type,
            tamanioBytes: file.size,
            ultimaModificacionISO: new Date(file.lastModified).toISOString(),
            dimensiones,
            gps,
          },
        });
      } catch (error) {
        console.error(`Error al procesar ${file.name}:`, error);
      }
    }

    if (nuevasImagenes.length > 0) {
      setImagenes(prev => [...prev, ...nuevasImagenes]);
      notifications.success(
        'Imágenes cargadas',
        `Iniciando análisis automático de ${nuevasImagenes.length} imagen${nuevasImagenes.length > 1 ? 'es' : ''}...`
      );
      return nuevasImagenes.map(img => img.id);
    }

    return [];
  }, [notifications]);

  const eliminarImagen = useCallback((id: string) => {
    setImagenes(prev => {
      const imagen = prev.find(img => img.id === id);
      if (imagen?.previewUrl) {
        URL.revokeObjectURL(imagen.previewUrl);
      }
      return prev.filter(img => img.id !== id);
    });
  }, []);

  const limpiarImagenes = useCallback(() => {
    imagenes.forEach(img => URL.revokeObjectURL(img.previewUrl));
    setImagenes([]);
  }, [imagenes]);

  return {
    imagenes,
    setImagenes,
    isDragging,
    setIsDragging,
    handleFileSelect,
    eliminarImagen,
    limpiarImagenes,
  };
};