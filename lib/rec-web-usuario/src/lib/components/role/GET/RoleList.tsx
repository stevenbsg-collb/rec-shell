import { SimpleGrid, Stack, Text } from '@mantine/core';
import { Role } from '../../../types/role.types';
import { RoleCard } from './RoleCard';

interface RoleListProps {
  roles: Role[];
  loading?: boolean;
}

export const RoleList = ({ roles, loading }: RoleListProps) => {
  if (loading) {
    return (
      <Stack align="center" py="xl">
        <Text>Loading roles...</Text>
      </Stack>
    );
  }

  if (roles.length === 0) {
    return (
      <Stack align="center" py="xl">
        <Text size="lg" c="dimmed">
          No roles found
        </Text>
        <Text size="sm" c="dimmed">
          Create your first role to get started
        </Text>
      </Stack>
    );
  }

  return (
    <SimpleGrid
      cols={{ base: 1, sm: 2, lg: 3 }}
      spacing="md"
    >
      {roles.map((role) => (
        <RoleCard key={role.id} role={role} />
      ))}
    </SimpleGrid>
  );
};