import { useState } from 'react';
import {
  Container,
  Title,
  Button,
  Group,
  Stack,
  Alert,
  ActionIcon,
} from '@mantine/core';
import { IconPlus, IconRefresh, IconAlertCircle } from '@tabler/icons-react';
import { usePermissions } from '../../../hooks/usePermissions';
import { useRoles } from '../../../hooks/useRoles';
import { RoleList } from '../GET/RoleList';
import { CreateRoleModal } from './CreateRoleModal';
import { ActionButtons } from '@rec-shell/rec-web-shared';

export const RoleManagement = () => {
  const { roles, loading, error, fetchRoles, createRole } = useRoles();
  const [createModalOpened, setCreateModalOpened] = useState(false);
  const { permissions, loading: permissionsLoading } = usePermissions();

  const handleCreateRole = async (roleData: { name: string; description: string }) => {
    await createRole(roleData);
  };

  return (
    <Container size="xl" py="xl">
      <Stack gap="xl">
        {/* Header */}
        <Group justify="space-between" align="flex-end">
          <div>
            <Title order={1} size="h2">
              Gestión de roles
            </Title>
            <Title order={3} size="h4" c="dimmed" fw={400}>
              Administrar roles y permisos del sistema.
            </Title>
          </div>
          
          <Group>
            
            <ActionButtons.Refresh 
              onClick={fetchRoles}
              loading={loading}               
            />
            
            <ActionButtons.Modal 
              onClick={() => setCreateModalOpened(true)}               
            />
          </Group>
        </Group>

        {/* Error Alert */}
        {error && (
          <Alert
            icon={<IconAlertCircle size="1rem" />}
            title="Error"
            color="red"
            variant="light"
            withCloseButton
            onClose={() => window.location.reload()}
          >
            {error}
          </Alert>
        )}

        {/* Role List */}
        <RoleList roles={roles} loading={loading} />

        {/* Create Role Modal */}
        <CreateRoleModal
          opened={createModalOpened}
          onClose={() => setCreateModalOpened(false)}
          onSubmit={handleCreateRole}
          loading={loading}
          availablePermissions={permissions}
          permissionsLoading={permissionsLoading}
        />
      </Stack>
    </Container>
  );
};