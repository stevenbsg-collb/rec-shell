import React from 'react';
import { Paper, Stack, Text, Button } from '@mantine/core';
import { IconPhoto } from '@tabler/icons-react';

interface UploadZoneProps {
  isDragging: boolean;
  onDragOver: (e: React.DragEvent) => void;
  onDragLeave: () => void;
  onDrop: (e: React.DragEvent) => void;
  onFileSelect: (files: FileList | null) => void;
}

export const UploadZone: React.FC<UploadZoneProps> = ({
  isDragging,
  onDragOver,
  onDragLeave,
  onDrop,
  onFileSelect,
}) => {
  return (
    <Paper
      onDragOver={onDragOver}
      onDragLeave={onDragLeave}
      onDrop={onDrop}
      style={{
        borderWidth: 3,
        borderStyle: 'dashed',
        borderColor: isDragging ? '#5a67d8' : '#cbd5e0',
        borderRadius: '12px',
        background: isDragging ? '#e8ebff' : '#f8f9ff',
        cursor: 'pointer',
        transition: 'all 0.3s ease',
        padding: '60px 40px',
        textAlign: 'center',
      }}
    >
      <Stack align="center" gap="md">
        <IconPhoto size={60} color="#667eea" />
        <div>
          <Text size="lg" fw={500} mb={5}>
            Arrastra imágenes aquí o haz clic para seleccionar
          </Text>
          <Text size="sm" c="dimmed">
            Soporta múltiples archivos: JPG, JPEG, PNG
          </Text>
        </div>
        <input
          type="file"
          accept="image/png,image/jpeg,image/jpg"
          multiple
          onChange={(e) => onFileSelect(e.target.files)}
          style={{ display: 'none' }}
          id="file-input"
        />
        <label htmlFor="file-input">
          <Button
            variant="gradient"
            size="lg"
            component="span"
            gradient={{ from: '#667eea', to: '#764ba2' }}
          >
            Seleccionar Archivos
          </Button>
        </label>
      </Stack>
    </Paper>
  );
};