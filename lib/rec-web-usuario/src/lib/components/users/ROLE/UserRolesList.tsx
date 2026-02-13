import { 
  Stack, 
  Group, 
  Text, 
  ActionIcon, 
  Tooltip, 
  Paper,
  Badge,
  Loader
} from '@mantine/core';
import { modals } from '@mantine/modals';
import { IconTrash } from '@tabler/icons-react';

interface Role {
  id: number;
  name: string;
  description: string;
}

interface UserRolesListProps {
  roles: Role[];
  onRemoveRole: (roleId: number) => void;
  removingRoleId: number | null;
}

export const UserRolesList = ({ 
  roles, 
  onRemoveRole, 
  removingRoleId 
}: UserRolesListProps) => {
  const handleRemoveRole = (role: Role) => {
    
    modals.openConfirmModal({
      title: 'Confirmar eliminación',
      children: (
        <Text size="sm">
          ¿Estás seguro de que deseas remover el rol <strong>{role.name}</strong>? 
          Esta acción no se puede deshacer.
        </Text>
      ),
      labels: { confirm: 'Remover', cancel: 'Cancelar' },
      confirmProps: { color: 'red' },
      onConfirm: () => onRemoveRole(role.id),
    });
  };

  const getRoleBadgeColor = (roleName: string) => {
    const roleColors: Record<string, string> = {
      'ADMIN': 'red',
      'MODERATOR': 'orange',
      'USER': 'blue',
      'EDITOR': 'green',
      'VIEWER': 'gray',
    };
    return roleColors[roleName.toUpperCase()] || 'blue';
  };

  return (
    <Stack gap="xs">
      {roles.map((role) => (
        <Paper 
          key={role.id} 
          p="md" 
          withBorder 
          radius="sm"
          style={{
            transition: 'all 0.2s ease',
          }}
          styles={{
            root: {
              '&:hover': {
                borderColor: 'var(--mantine-color-blue-4)',
                backgroundColor: 'var(--mantine-color-blue-0)',
              }
            }
          }}
        >
          <Group justify="space-between" align="flex-start">
            <div style={{ flex: 1 }}>
              <Group gap="sm" mb="xs">
                <Badge 
                  color={getRoleBadgeColor(role.name)} 
                  variant="light"
                  size="sm"
                >
                  {role.name}
                </Badge>
              </Group>
              {role.description && (
                <Text size="sm" c="dimmed" lineClamp={2}>
                  {role.description}
                </Text>
              )}
            </div>
            
            <Tooltip label="Remover rol" position="left">
              <ActionIcon
                color="red"
                variant="subtle"
                size="sm"
                onClick={() => handleRemoveRole(role)}
                disabled={removingRoleId === role.id}
                style={{
                  transition: 'all 0.2s ease',
                }}
                styles={{
                  root: {
                    '&:hover': {
                      backgroundColor: 'var(--mantine-color-red-1)',
                    }
                  }
                }}
              >
                {removingRoleId === role.id ? (
                  <Loader size={12} />
                ) : (
                  <IconTrash size={14} />
                )}
              </ActionIcon>
            </Tooltip>
          </Group>
        </Paper>
      ))}
    </Stack>
  );
};