import { useState } from 'react';
import {
  Modal,
  TextInput,
  Textarea,
  Button,
  Stack,
  Group,
  Alert,
  MultiSelect,
} from '@mantine/core';
import { useForm } from '@mantine/form';
import { IconAlertCircle } from '@tabler/icons-react';
import { Permission } from '../../../types/role.types';
import { ActionButtons } from '@rec-shell/rec-web-shared';

interface CreateRoleModalProps {
  opened: boolean;
  onClose: () => void;
  onSubmit: (data: {
    name: string;
    description: string;
    permissionIds?: number[];
  }) => Promise<void>;
  loading?: boolean;
  availablePermissions?: Permission[];
  permissionsLoading?: boolean;
}

export const CreateRoleModal = ({
  opened,
  onClose,
  onSubmit,
  loading = false,
  availablePermissions = [],
  permissionsLoading = false,
}: CreateRoleModalProps) => {
  const [error, setError] = useState<string | null>(null);

  const form = useForm({
    initialValues: {
      name: '',
      description: '',
      permissionIds: [] as string[],
    },
    validate: {
      name: (value) => (!value ? 'Role name is required' : null),
      description: (value) => (!value ? 'Description is required' : null),
    },
  });

  const handleSubmit = async (values: typeof form.values) => {
    setError(null);
    try {
      const permissionIds = values.permissionIds.map((id) => parseInt(id));
      await onSubmit({
        name: values.name,
        description: values.description,
        permissionIds: permissionIds.length > 0 ? permissionIds : undefined,
      });
      //await onSubmit(values);
      form.reset();
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create role');
    }
  };

  const handleClose = () => {
    form.reset();
    setError(null);
    onClose();
  };

  const permissionOptions = availablePermissions.map((permission) => ({
    value: permission.id.toString(),
    label: `${permission.name} - ${permission.description}`,
  }));

  return (
    <Modal
      opened={opened}
      onClose={handleClose}
      title="Crear nuevo rol"
      size="md"
    >
      <Stack gap="md">
        {error && (
          <Alert
            icon={<IconAlertCircle size="1rem" />}
            title="Error"
            color="red"
            variant="light"
          >
            {error}
          </Alert>
        )}

        <TextInput
          label="Nombre del rol"
          placeholder="Introduzca el nombre del rol (e.g., MODERATOR, ADMIN)"
          required
          {...form.getInputProps('name')}
        />

        <Textarea
          label="Descripción"
          placeholder="Ingrese la descripción del rol"
          required
          rows={3}
          {...form.getInputProps('description')}
        />

        <MultiSelect
          label="Permisos"
          placeholder={
            permissionsLoading
              ? 'Cargando permisos...'
              : 'Select permisos (opcional)'
          }
          data={permissionOptions}
          {...form.getInputProps('permissionIds')}
          searchable
          clearable
          disabled={permissionsLoading}
          description="Seleccione uno o más permisos para este rol"
        />

        <Group justify="center" mt="md">
          <ActionButtons.Cancel onClick={handleClose} disabled={loading} />

          <ActionButtons.Save
            onClick={() => form.onSubmit(handleSubmit)()}
            disabled={loading}
          />
        </Group>
      </Stack>
    </Modal>
  );
};
