import React, { useState } from 'react';
import {
  Modal,
  Text,
  Button,
  Group,
  Stack,
  ThemeIcon,
  Box,
  Divider
} from '@mantine/core';
import {
  IconAlertTriangle,
  IconTrash,
  IconX
} from '@tabler/icons-react';

interface ItemDetail {
  label: string;
  value: string | number;
}

interface DeleteConfirmModalProps {
  opened: boolean;
  onClose: () => void;
  onConfirm: () => Promise<void>;
  title?: string;
  itemName: string;
  itemType?: string;
  itemDetails?: ItemDetail[];
  warningMessage?: string;
  confirmMessage?: string;
}

export const DeleteConfirmModal: React.FC<DeleteConfirmModalProps> = ({
  opened,
  onClose,
  onConfirm,
  title = '¿Confirmar eliminación?',
  itemName,
  itemType = 'registro',
  itemDetails = [],
  warningMessage,
  confirmMessage = '',
}) => {
  const [isDeleting, setIsDeleting] = useState(false);

  const handleConfirm = async () => {
    setIsDeleting(true);
    try {
      await onConfirm();
      onClose();
    } catch (error) {
      console.error('Error al eliminar:', error);
    } finally {
      setIsDeleting(false);
    }
  };

  const handleClose = () => {
    if (!isDeleting) {
      onClose();
    }
  };


  return (
    <Modal
      opened={opened}
      onClose={handleClose}
      title={
        <Group gap="sm">
          <ThemeIcon color="red" size="lg" radius="xl" variant="light">
            <IconAlertTriangle size={20} />
          </ThemeIcon>
          <Text fw={600} size="lg">
            {title}
          </Text>
        </Group>
      }
      centered
      size="md"
      overlayProps={{
        backgroundOpacity: 0.55,
        blur: 3,
      }}
      closeOnClickOutside={!isDeleting}
      closeOnEscape={!isDeleting}
    >
      <Stack gap="lg">
        <Box>
          <Text size="sm" c="dimmed" mb="xs">
            Está a punto de eliminar el siguiente {itemType}:
          </Text>
          <Box
            p="md"
            style={{
              backgroundColor: 'var(--mantine-color-red-0)',
              borderRadius: 'var(--mantine-radius-md)',
              border: '1px solid var(--mantine-color-red-3)',
            }}
          >
            <Text fw={600} size="md" c="red.7">
              {itemName}
            </Text>
            {itemDetails.length > 0 && (
              <Stack gap={4} mt="xs">
                {itemDetails.map((detail, index) => (
                  <Text key={index} size="sm" c="dimmed">
                    {detail.label}: {detail.value}
                  </Text>
                ))}
              </Stack>
            )}
          </Box>
        </Box>
        <Divider />

        <Group justify="flex-end" gap="sm">
          <Button
            variant="subtle"
            color="gray"
            onClick={handleClose}
            disabled={isDeleting}
            leftSection={<IconX size={16} />}
          >
            Cancelar
          </Button>
          <Button
            color="red"
            onClick={handleConfirm}
            loading={isDeleting}
            leftSection={!isDeleting ? <IconTrash size={16} /> : undefined}
          >
            {isDeleting ? 'Eliminando...' : 'Eliminar'}
          </Button>
        </Group>
      </Stack>
    </Modal>
  );
};