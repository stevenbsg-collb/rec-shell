import { useState, useEffect } from 'react';
import {
  Modal,
  Title,
  Stack,
  Group,
  Text,
  Alert,
  Loader,
  Badge,
  Paper,
  Divider,
  ScrollArea,
} from '@mantine/core';
import {
  IconAlertCircle,
  IconUser,
  IconShield,
  IconCheck,
} from '@tabler/icons-react';
import { useRoleManagement } from '../../../hooks/useRoleManagement';
import { User } from '../../../types/users.types';
import {
  useNotifications,
  NOTIFICATION_MESSAGES,
  ActionButtons,
} from '@rec-shell/rec-web-shared';
import { UserRolesList } from './UserRolesList';
import { RoleSelector } from './RoleSelector';

interface RoleManagementModalProps {
  opened: boolean;
  onClose: () => void;
  user: User | null;
}

export const RoleManagementModal = ({
  opened,
  onClose,
  user
}: RoleManagementModalProps) => {
  const {
    availableRoles,
    userRoles,
    loading,
    assigningRole,
    removingRole,
    fetchUserRoles,
    fetchAvailableRoles,
    assignRole,
    removeRole,
  } = useRoleManagement();

  const [selectedRoleId, setSelectedRoleId] = useState<number | null>(null);
  const notifications = useNotifications();

  useEffect(() => {
    if (opened && user) {
      fetchUserRoles(user.id);
      fetchAvailableRoles();
    }
  }, [opened, user, fetchUserRoles, fetchAvailableRoles]);

  const handleAssignRole = async () => {
    if (!user || !selectedRoleId) return;

    try {
      await assignRole(user.id, selectedRoleId);
      setSelectedRoleId(null);

      notifications.success(
        NOTIFICATION_MESSAGES.GENERAL.SUCCESS.title,
        NOTIFICATION_MESSAGES.AUTH.ROL_CODE.message,
        <IconCheck />
      );
    } catch (error) {
      notifications.error(
        NOTIFICATION_MESSAGES.GENERAL.ERROR.title,
        error instanceof Error ? error.message : 'Error al asignar el rol'
      );
    }
  };

  const handleRemoveRole = async (roleId: number) => {
    if (!user) return;

    try {
      await removeRole(user.id, roleId);

      notifications.success(
        NOTIFICATION_MESSAGES.GENERAL.SUCCESS.title,
        NOTIFICATION_MESSAGES.AUTH.REMOVE_CODE.message,
        <IconCheck />
      );
    } catch (error) {      
      notifications.error(
        NOTIFICATION_MESSAGES.GENERAL.ERROR.title,
        error instanceof Error ? error.message : 'Error al remover el rol'
      );
    }
  };

  const availableRolesToAssign = availableRoles.filter(
    (role) => !userRoles.some((userRole) => userRole.id === role.id)
  );

  if (!user) return null;

  return (
    <Modal
      opened={opened}
      onClose={onClose}
      title={
        <Group gap="sm">
          <IconShield size={20} />
          <Title order={4}>Gestionar Roles</Title>
        </Group>
      }
      size="lg"
      centered
    >
      <Stack gap="lg">
        {/* User Information */}
        <Paper p="md" withBorder radius="md" bg="gray.0">
          <Group gap="sm" mb="xs">
            <IconUser size={16} />
            <Text fw={500}>Usuario:</Text>
          </Group>
          <Text size="sm" c="dimmed">
            {user.firstName} {user.lastName} ({user.username})
          </Text>
          <Text size="xs" c="dimmed">
            {user.email}
          </Text>
        </Paper>

        <Divider />

        {loading ? (
          <Group justify="center" p="xl">
            <Loader size="md" />
            <Text>Cargando información de roles...</Text>
          </Group>
        ) : (
          <>
            {/* Current Roles */}
            <div>
              <Group justify="space-between" mb="md">
                <Title order={5}>Roles Actuales</Title>
                <Badge variant="light" color="blue">
                  {userRoles.length} rol(es)
                </Badge>
              </Group>

              {userRoles.length === 0 ? (
                <Alert
                  icon={<IconAlertCircle size={16} />}
                  title="Sin roles asignados"
                  color="yellow"
                  variant="light"
                >
                  Este usuario no tiene roles asignados actualmente.
                </Alert>
              ) : (
                <ScrollArea.Autosize mah={200}>
                  <UserRolesList
                    roles={userRoles}
                    onRemoveRole={handleRemoveRole}
                    removingRoleId={removingRole}
                  />
                </ScrollArea.Autosize>
              )}
            </div>

            <Divider />

            {/* Assign New Role */}
            <div>
              <Title order={5} mb="md">
                Asignar Nuevo Rol
              </Title>

              {availableRolesToAssign.length === 0 ? (
                <Alert
                  icon={<IconAlertCircle size={16} />}
                  title="No hay roles disponibles"
                  color="blue"
                  variant="light"
                >
                  Todos los roles disponibles ya están asignados a este usuario.
                </Alert>
              ) : (
                <Stack gap="md">
                  <RoleSelector
                    roles={availableRolesToAssign}
                    selectedRoleId={selectedRoleId}
                    onSelectRole={setSelectedRoleId}
                  />

                  <Group justify="flex-end">
                    <ActionButtons.Add 
                      onClick={handleAssignRole} 
                      disabled={!selectedRoleId}
                      loading={assigningRole}
                    />
                  </Group>
                </Stack>
              )}
            </div>
          </>
        )}

        {/* Actions */}
        <Group justify="center" mt="md">
          <ActionButtons.Cancel 
            onClick={onClose} 
            disabled={loading} 
          />
        </Group>
      </Stack>
    </Modal>
  );
};
