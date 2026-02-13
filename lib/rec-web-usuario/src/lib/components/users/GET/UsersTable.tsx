import React from 'react';
import { Table, Paper, ScrollArea } from '@mantine/core';
import { UsersTableProps } from '../../../types/users.types';
import { UserRow } from './UserRow';
import { EmptyState, LoadingMessage } from '@rec-shell/rec-web-shared';

export const UsersTable: React.FC<UsersTableProps> = ({ 
  users, 
  loading, 
  onEditUser, 
  onManageRoles 
}) => {
  if (loading) {
    return (
      <LoadingMessage  
        withBorder={true}
      />
    );
  }

  return (
    <Paper withBorder>
      <Table striped highlightOnHover>
        <Table.Thead>
          <Table.Tr>
            <Table.Th>Usuario</Table.Th>
            <Table.Th>Información de Contacto</Table.Th>
            <Table.Th>Estado</Table.Th>
            <Table.Th>Roles</Table.Th>
            <Table.Th>Fecha de Creación</Table.Th>
            <Table.Th>Última Modificación</Table.Th>
            <Table.Th>Acciones</Table.Th>
          </Table.Tr>
        </Table.Thead>
        <Table.Tbody>
          {users.map((user) => (
            <UserRow
              key={user.id}
              user={user}
              onEditUser={onEditUser}
              onManageRoles={onManageRoles}
            />
          ))}
        </Table.Tbody>
      </Table>

      {users.length === 0 && (
        <EmptyState 
          withIcon={true}
        />
      )}
    </Paper>
  );
};