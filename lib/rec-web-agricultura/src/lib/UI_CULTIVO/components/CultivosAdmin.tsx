import React, { useState, useEffect } from 'react';
import { useCultivos } from '../hooks/useAgricultura';
import { CultivoFormData } from '../../types/dto';
import {
  ActionButtons,
  DeleteConfirmModal,
  ErrorAlert,
  PaginationControls,
  usePagination,
} from '@rec-shell/rec-web-shared';

import { getEstadoBadge } from '../../helper/estadoBadge';
import { useDisclosure } from '@mantine/hooks';
import * as UI from '../../helper/ui';

export const CultivosAdmin = () => {
  const [opened, { open, close }] = useDisclosure(false);
  const [deleteOpened, setDeleteOpened] = useState(false);
  const [modoEdicion, setModoEdicion] = useState(false);
  const [cultivoSeleccionado, setCultivoSeleccionado] = useState<any>(null);
  const [cultivoAEliminar, setCultivoAEliminar] = useState<any>(null);
  const [busqueda, setBusqueda] = useState('');
  const [eliminando, setEliminando] = useState(false);

  const [formData, setFormData] = useState<CultivoFormData>({
    nombreCultivo: '',
    variedadCacao: '',
    fechaSiembra: '',
    areaHectareas: 0,
    ubicacionNombre: '',
    latitud: 0,
    longitud: 0,
    altitud: 0,
    tipoSuelo: '',
    sistemaRiego: '',
    estadoCultivo: 'ACTIVO',
    notas: '',
  });

  const {
    cultivos,
    loading,
    error,
    areaTotalActiva,
    CREAR,
    ACTUALIZAR,
    ELIMINAR,
    BUSCAR,
    fetchAreaTotalActiva,
    clearError,
  } = useCultivos();

  useEffect(() => {
    BUSCAR();
    if (fetchAreaTotalActiva) {
      fetchAreaTotalActiva();
    }
  }, []);

  const cultivosFiltrados = cultivos.filter(
    (c) =>
      c.nombreCultivo?.toLowerCase().includes(busqueda.toLowerCase()) ||
      c.variedadCacao?.toLowerCase().includes(busqueda.toLowerCase()) ||
      c.ubicacionNombre?.toLowerCase().includes(busqueda.toLowerCase())
  );

  const handleNuevo = () => {
    setModoEdicion(false);
    setCultivoSeleccionado(null);
    setFormData({
      nombreCultivo: '',
      variedadCacao: '',
      fechaSiembra: '',
      areaHectareas: 0,
      ubicacionNombre: '',
      latitud: 0,
      longitud: 0,
      altitud: 0,
      tipoSuelo: '',
      sistemaRiego: '',
      estadoCultivo: 'ACTIVO',
      notas: '',
    });
    open();
  };

  const handleEditar = (cultivo: any) => {
    setModoEdicion(true);
    setCultivoSeleccionado(cultivo);
    setFormData({
      nombreCultivo: cultivo.nombreCultivo || '',
      variedadCacao: cultivo.variedadCacao || '',
      fechaSiembra: cultivo.fechaSiembra || '',
      areaHectareas: cultivo.areaHectareas || 0,
      ubicacionNombre: cultivo.ubicacionNombre || '',
      latitud: cultivo.latitud || 0,
      longitud: cultivo.longitud || 0,
      altitud: cultivo.altitud || 0,
      tipoSuelo: cultivo.tipoSuelo || '',
      sistemaRiego: cultivo.sistemaRiego || '',
      estadoCultivo: cultivo.estadoCultivo || 'ACTIVO',
      notas: cultivo.notas || '',
    });
    open();
  };

  const handleEliminar = (cultivo: any) => {
    setCultivoAEliminar(cultivo);
    setDeleteOpened(true);
  };

  const confirmarEliminacion = async () => {
    if (cultivoAEliminar) {
      setEliminando(true);
      try {
        await ELIMINAR(cultivoAEliminar.id);
        if (fetchAreaTotalActiva) {
          await fetchAreaTotalActiva();
        }
        setDeleteOpened(false);
        setCultivoAEliminar(null);
      } catch (error) {
        console.error('Error al eliminar:', error);
      } finally {
        setEliminando(false);
      }
    }
  };

  const handleSubmit = async () => {
    try {
      if (modoEdicion && cultivoSeleccionado) {
        await ACTUALIZAR(cultivoSeleccionado.id, formData as any);
      } else {
        await CREAR(formData as any);
      }
      if (fetchAreaTotalActiva) {
        await fetchAreaTotalActiva();
      }
      close();
    } catch (error) {
      console.error('Error al guardar:', error);
    }
  };

  // Ref Paginacion Global
  const lista = Array.isArray(cultivosFiltrados) ? cultivosFiltrados : [];
  const {
    currentPage,
    totalPages,
    paginatedData,
    setPage,
    setItemsPerPage,
    itemsPerPage,
    startIndex,
    endIndex,
    totalItems,
    searchTerm,
    setSearchTerm,
  } = usePagination({
    data: lista,
    itemsPerPage: 5,
    searchFields: [
      'nombreCultivo',
      'variedadCacao',
      'areaHectareas',
      'ubicacionNombre',
    ],
  });

  return (
    <UI.Box p="md">
      <UI.Stack gap="lg">
        {error && <ErrorAlert error={error} onClose={clearError} />}

        <UI.Flex justify="space-between" align="center" mb="lg">
          <UI.Title order={2}>Gestión de Cultivos</UI.Title>
          <ActionButtons.Modal onClick={handleNuevo} loading={loading} />
        </UI.Flex>

        <UI.Grid>
          <UI.Grid.Col span={{ base: 12, md: 4 }}>
            <UI.Card withBorder>
              <UI.Text size="sm" c="dimmed">
                Área Total Activa
              </UI.Text>
              <UI.Text size="xl" fw={700}>
                {areaTotalActiva ? areaTotalActiva.toFixed(2) : '0.00'} ha
              </UI.Text>
            </UI.Card>
          </UI.Grid.Col>
        </UI.Grid>

        {loading ? (
          <UI.Flex justify="center" align="center" py="xl">
            <UI.Loader size="lg" />
          </UI.Flex>
        ) : cultivosFiltrados.length === 0 ? (
          <UI.Text ta="center" c="dimmed" py="xl">
            {searchTerm
              ? 'No se encontraron resultados para tu búsqueda'
              : 'No se encontraron registros'}
          </UI.Text>
        ) : (
          <UI.Card shadow="sm" p="lg">
            <UI.Table striped highlightOnHover>
              <UI.Table.Thead>
                <UI.Table.Tr>
                  <UI.Table.Th>Nombre</UI.Table.Th>
                  <UI.Table.Th>Variedad Cacao</UI.Table.Th>
                  <UI.Table.Th>Área (ha)</UI.Table.Th>
                  <UI.Table.Th>Ubicación</UI.Table.Th>
                  <UI.Table.Th>Fecha Siembra</UI.Table.Th>
                  <UI.Table.Th>Estado</UI.Table.Th>
                  <UI.Table.Th>Acciones</UI.Table.Th>
                </UI.Table.Tr>
              </UI.Table.Thead>
              <UI.Table.Tbody>
                {paginatedData.map((cultivo) => (
                  <UI.Table.Tr key={cultivo.id}>
                    <UI.Table.Td>
                      <UI.Text fw={500}>{cultivo.nombreCultivo}</UI.Text>
                    </UI.Table.Td>
                    <UI.Table.Td>{cultivo.variedadCacao || '-'}</UI.Table.Td>
                    <UI.Table.Td>
                      {cultivo.areaHectareas?.toFixed(2) || '0.00'}
                    </UI.Table.Td>
                    <UI.Table.Td>
                      {cultivo.ubicacionNombre ? (
                        <UI.Group gap="xs">
                          <UI.IconMapPin size={14} />
                          <UI.Text size="sm">{cultivo.ubicacionNombre}</UI.Text>
                        </UI.Group>
                      ) : (
                        '-'
                      )}
                    </UI.Table.Td>
                    <UI.Table.Td>
                      {cultivo.fechaSiembra
                        ? new Date(cultivo.fechaSiembra).toLocaleDateString()
                        : '-'}
                    </UI.Table.Td>
                    <UI.Table.Td>
                      {getEstadoBadge(cultivo.estadoCultivo)}
                    </UI.Table.Td>
                    <UI.Table.Td>
                      <UI.Group gap="xs">
                        <UI.ActionIcon
                          variant="light"
                          color="blue"
                          onClick={() => handleEditar(cultivo)}
                        >
                          <UI.IconEdit size={16} />
                        </UI.ActionIcon>
                        <UI.ActionIcon
                          variant="light"
                          color="red"
                          onClick={() => handleEliminar(cultivo)}
                        >
                          <UI.IconTrash size={16} />
                        </UI.ActionIcon>
                      </UI.Group>
                    </UI.Table.Td>
                  </UI.Table.Tr>
                ))}
              </UI.Table.Tbody>
            </UI.Table>
          </UI.Card>
        )}

        {/* Ref paginacion Global - Controles de paginación */}
        {lista.length > 0 && (
          <PaginationControls
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setPage}
            itemsPerPage={itemsPerPage}
            onItemsPerPageChange={(value) =>
              value && setItemsPerPage(Number(value))
            }
            startIndex={startIndex}
            endIndex={endIndex}
            totalItems={totalItems}
            searchTerm={searchTerm}
            onSearchChange={setSearchTerm}
            searchPlaceholder="Buscar por código, nombre o nutriente..."
          />
        )}
      </UI.Stack>

      {/* Modal de Formulario */}
      <UI.Modal
        opened={opened}
        onClose={close}
        title={modoEdicion ? 'Editar Registro' : 'Nuevo Registro'}
        size="90%"
      >
        <UI.Stack gap="md">
          <UI.Paper p="md" withBorder>
            <UI.Text size="sm" fw={600} mb="sm" c="dimmed">
              INFORMACIÓN BÁSICA
            </UI.Text>

            <UI.Stack gap="sm">
              <UI.Grid>
                <UI.Grid.Col span={{ base: 12, sm: 6 }}>
                  <UI.TextInput
                    label="Nombre del Cultivo"
                    placeholder="Ej: Cacao Nacional"
                    required
                    value={formData.nombreCultivo}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        nombreCultivo: e.currentTarget.value,
                      })
                    }
                  />
                </UI.Grid.Col>
                <UI.Grid.Col span={{ base: 12, sm: 6 }}>
                  <UI.TextInput
                    label="Variedad de Cacao"
                    placeholder="Ej: CCN-51, Nacional Fino"
                    value={formData.variedadCacao}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        variedadCacao: e.currentTarget.value,
                      })
                    }
                  />
                </UI.Grid.Col>
              </UI.Grid>

              <UI.Grid>
                <UI.Grid.Col span={{ base: 12, sm: 4 }}>
                  <UI.NumberInput
                    label="Área (hectáreas)"
                    placeholder="0.0"
                    required
                    min={0}
                    step={0.1}
                    decimalScale={2}
                    value={formData.areaHectareas}
                    onChange={(val) =>
                      setFormData({
                        ...formData,
                        areaHectareas: typeof val === 'number' ? val : 0,
                      })
                    }
                  />
                </UI.Grid.Col>
                <UI.Grid.Col span={{ base: 12, sm: 4 }}>
                  <UI.TextInput
                    label="Fecha de Siembra"
                    type="date"
                    required
                    value={formData.fechaSiembra}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        fechaSiembra: e.currentTarget.value,
                      })
                    }
                  />
                </UI.Grid.Col>
                <UI.Grid.Col span={{ base: 12, sm: 4 }}>
                  <UI.Select
                    label="Estado del Cultivo"
                    required
                    value={formData.estadoCultivo}
                    onChange={(val) =>
                      setFormData({
                        ...formData,
                        estadoCultivo: val || 'ACTIVO',
                      })
                    }
                    data={[
                      { value: 'ACTIVO', label: 'Activo' },
                      { value: 'INACTIVO', label: 'Inactivo' },
                      { value: 'COSECHADO', label: 'Cosechado' },
                    ]}
                  />
                </UI.Grid.Col>
              </UI.Grid>
            </UI.Stack>
          </UI.Paper>

          <UI.Paper p="md" withBorder>
            <UI.Text size="sm" fw={600} mb="sm" c="dimmed">
              UBICACIÓN
            </UI.Text>
            <UI.Stack gap="sm">
              <UI.TextInput
                label="Nombre de Ubicación"
                placeholder="Ej: Parcela Norte, Lote 5"
                value={formData.ubicacionNombre}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    ubicacionNombre: e.currentTarget.value,
                  })
                }
              />

              <UI.Grid>
                <UI.Grid.Col span={{ base: 12, sm: 4 }}>
                  <UI.NumberInput
                    label="Latitud"
                    placeholder="-2.1234"
                    step={0.000001}
                    decimalScale={6}
                    value={formData.latitud}
                    onChange={(val) =>
                      setFormData({
                        ...formData,
                        latitud: typeof val === 'number' ? val : 0,
                      })
                    }
                  />
                </UI.Grid.Col>
                <UI.Grid.Col span={{ base: 12, sm: 4 }}>
                  <UI.NumberInput
                    label="Longitud"
                    placeholder="-79.1234"
                    step={0.000001}
                    decimalScale={6}
                    value={formData.longitud}
                    onChange={(val) =>
                      setFormData({
                        ...formData,
                        longitud: typeof val === 'number' ? val : 0,
                      })
                    }
                  />
                </UI.Grid.Col>
                <UI.Grid.Col span={{ base: 12, sm: 4 }}>
                  <UI.NumberInput
                    label="Altitud (m)"
                    placeholder="500"
                    min={0}
                    value={formData.altitud}
                    onChange={(val) =>
                      setFormData({
                        ...formData,
                        altitud: typeof val === 'number' ? val : undefined,
                      })
                    }
                  />
                </UI.Grid.Col>
              </UI.Grid>
            </UI.Stack>
          </UI.Paper>

          <UI.Paper p="md" withBorder>
            <UI.Text size="sm" fw={600} mb="sm" c="dimmed">
              CARACTERÍSTICAS DEL TERRENO
            </UI.Text>
            <UI.Grid>
              <UI.Grid.Col span={{ base: 12, sm: 6 }}>
                <UI.Select
                  label="Tipo de Suelo"
                  placeholder="Seleccione tipo de suelo"
                  value={formData.tipoSuelo}
                  onChange={(val) =>
                    setFormData({ ...formData, tipoSuelo: val || '' })
                  }
                  data={[
                    { value: 'ARCILLOSO', label: 'Arcilloso' },
                    { value: 'ARENOSO', label: 'Arenoso' },
                    { value: 'LIMOSO', label: 'Limoso' },
                    { value: 'FRANCO', label: 'Franco' },
                    { value: 'HUMIFERO', label: 'Humífero' },
                  ]}
                />
              </UI.Grid.Col>
              <UI.Grid.Col span={{ base: 12, sm: 6 }}>
                <UI.Select
                  label="Sistema de Riego"
                  placeholder="Seleccione sistema"
                  value={formData.sistemaRiego}
                  onChange={(val) =>
                    setFormData({ ...formData, sistemaRiego: val || '' })
                  }
                  data={[
                    { value: 'GOTEO', label: 'Goteo' },
                    { value: 'ASPERSION', label: 'Aspersión' },
                    { value: 'GRAVEDAD', label: 'Gravedad' },
                    { value: 'MICROASPERSION', label: 'Microaspersión' },
                    { value: 'NATURAL', label: 'Natural (lluvia)' },
                  ]}
                />
              </UI.Grid.Col>
            </UI.Grid>
          </UI.Paper>

          <UI.Paper p="md" withBorder>
            <UI.Text size="sm" fw={600} mb="sm" c="dimmed">
              OBSERVACIONES
            </UI.Text>
            <UI.Textarea
              label="Notas"
              placeholder="Observaciones adicionales sobre el cultivo..."
              minRows={3}
              value={formData.notas}
              onChange={(e) =>
                setFormData({ ...formData, notas: e.currentTarget.value })
              }
            />
          </UI.Paper>

          {/* Botones de Acción */}
          <UI.Group justify="center" mt="md">
            <ActionButtons.Cancel onClick={close} />
            <ActionButtons.Save onClick={handleSubmit} loading={loading} />
          </UI.Group>
        </UI.Stack>
      </UI.Modal>

      {/* Modal Generico de Eliminación */}
      <DeleteConfirmModal
        opened={deleteOpened}
        onClose={() => setDeleteOpened(false)}
        onConfirm={confirmarEliminacion}
        itemName={cultivoAEliminar?.nombreCultivo || ''}
        itemType="registro"
      />
    </UI.Box>
  );
};