import { Tooltip, ActionIcon } from '@mantine/core';
import {
  IconArrowLeft,
  IconCheck,
  IconRefresh,
  IconDeviceFloppy,
  IconPlus,
} from '@tabler/icons-react';

interface ButtonProps {
  onClick: () => void;
  loading?: boolean;
  disabled?: boolean;
}

export const ActionButtons = {
  Cancel: ({ onClick, loading = false, disabled = false }: ButtonProps) => (
    <Tooltip label="Cancelar" position="bottom" withArrow>
      <ActionIcon
        size="xl"
        radius="xl"
        color="red"
        variant="light"
        disabled={disabled || loading}        
        onClick={onClick}
      >
        <IconArrowLeft size={20} />
      </ActionIcon>
    </Tooltip>
  ),

  Update: ({ onClick, loading = false }: ButtonProps) => (
    <Tooltip label="Actualizar" position="bottom" withArrow>
      <ActionIcon
        size="xl"
        radius="xl"
        color="green"
        variant="filled"
        loading={loading}
        onClick={onClick}
      >
        <IconCheck size={20} />
      </ActionIcon>
    </Tooltip>
  ),

  Refresh: ({ onClick, loading = false }: ButtonProps) => (
    <Tooltip label="Refrescar" position="bottom" withArrow>
      <ActionIcon
        size="xl"
        radius="xl"
        color="cyan"
        variant="filled"
        loading={loading}
        onClick={onClick}
      >
        <IconRefresh size={20} />
      </ActionIcon>
    </Tooltip>
  ),

  Save: ({ onClick, loading = false }: ButtonProps) => (
    <Tooltip label="Registrarse" position="left" withArrow>
      <ActionIcon
        size="xl"
        radius="xl"
        color="green"
        variant="filled"
        loading={loading}
        onClick={onClick}
      >
        <IconDeviceFloppy size={20} />
      </ActionIcon>
    </Tooltip>
  ),

  Add: ({ onClick, loading = false, disabled = false }: ButtonProps) => (
    <Tooltip label="Asignar" position="bottom" withArrow>
      <ActionIcon
        size="xl"
        radius="xl"
        color="blue"
        variant="filled"
        disabled={disabled}
        loading={loading}
        onClick={onClick}
      >
        <IconPlus size={20} />
      </ActionIcon>
    </Tooltip>
  ),

  Modal: ({ onClick, loading = false }: ButtonProps) => (
    <Tooltip label="Abrir" position="left" withArrow>
      <ActionIcon
        size="xl"
        radius="xl"
        color="blue"
        variant="filled"
        loading={loading}
        onClick={onClick}
      >
        <IconPlus size={20} />
      </ActionIcon>
    </Tooltip>
  ),
};
