import React from 'react';
import {
  Table,
  Group,
  Avatar,
  Stack,
  Text,
  Badge,
  ActionIcon,
  Menu
} from '@mantine/core';
import {
  IconDots,
  IconEdit,
  IconShield,
  IconMail,
  IconPhone
} from '@tabler/icons-react';
import { UserRowProps } from '../../../types/users.types';
import { getStatusColor, getRoleColor, formatDate, getUserInitials } from '../../../utils/users.utils';

export const UserRow: React.FC<UserRowProps> = ({ 
  user, 
  onEditUser, 
  onManageRoles 
}) => {
  return (
    <Table.Tr>
      <Table.Td>
        <Group gap="sm">
          <Avatar
            size="sm"
            radius="xl"
            color={user.enabled ? 'blue' : 'gray'}
          >
            {getUserInitials(user.firstName, user.lastName)}
          </Avatar>
          <Stack gap={0}>
            <Text fw={500}>{user.username}</Text>
            <Text size="sm" c="dimmed">
              {user.firstName} {user.lastName}
            </Text>
          </Stack>
        </Group>
      </Table.Td>
      <Table.Td>
        <Stack gap={4}>
          <Group gap="xs">
            <IconMail size={14} />
            <Text size="sm">{user.email}</Text>
          </Group>
          {user.phoneNumber && (
            <Group gap="xs">
              <IconPhone size={14} />
              <Text size="sm">{user.phoneNumber}</Text>
            </Group>
          )}
        </Stack>
      </Table.Td>
      <Table.Td>
        <Badge
          color={getStatusColor(user.status)}
          variant="light"
          size="sm"
        >
          {user.status}
        </Badge>
      </Table.Td>
      <Table.Td>
        <Group gap="xs">
          {user.roles.map((role) => (
            <Badge
              key={role}
              color={getRoleColor(role)}
              variant="outline"
              size="xs"
            >
              {role}
            </Badge>
          ))}
        </Group>
      </Table.Td>
      <Table.Td>
        <Text size="sm">{formatDate(user.createdAt)}</Text>
      </Table.Td>
      <Table.Td>
        <Text size="sm">{formatDate(user.updatedAt)}</Text>
      </Table.Td>
      <Table.Td>
        <Menu shadow="md" width={200}>
          <Menu.Target>
            <ActionIcon variant="subtle" color="gray">
              <IconDots size={16} />
            </ActionIcon>
          </Menu.Target>
          <Menu.Dropdown>
            <Menu.Label>Acciones</Menu.Label>
            <Menu.Item
              leftSection={<IconEdit size={14} />}
              onClick={() => onEditUser(user.id)}
            >
              Editar Usuario
            </Menu.Item>
            <Menu.Item
              leftSection={<IconShield size={14} />}
              onClick={() => onManageRoles(user.id)}
            >
              Gestionar Roles
            </Menu.Item>
          </Menu.Dropdown>
        </Menu>
      </Table.Td>
    </Table.Tr>
  );
};