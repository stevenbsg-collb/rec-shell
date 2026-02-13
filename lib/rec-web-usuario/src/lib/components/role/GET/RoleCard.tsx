import { Card, Text, Badge, Group, Stack } from '@mantine/core';
import { Role } from '../../../types/role.types';

interface RoleCardProps {
  role: Role;
}

export const RoleCard = ({ role }: RoleCardProps) => {
  return (
    <Card shadow="sm" padding="lg" radius="md" withBorder>
      <Stack gap="sm">
        <Group justify="space-between" align="flex-start">
          <Text fw={500} size="lg">
            {role.name}
          </Text>
          <Badge color="blue" variant="light">
            ID: {role.id}
          </Badge>
        </Group>
        
        <Text size="sm" c="dimmed">
          {role.description}
        </Text>
        
        {role.createdAt && (
          <Text size="xs" c="dimmed">
            Created: {new Date(role.createdAt).toLocaleDateString()}
          </Text>
        )}
      </Stack>
    </Card>
  );
};