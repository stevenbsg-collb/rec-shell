import React, { useState } from 'react';
import {
  Title,
  Group,
  Stack,
  Box,
  Tooltip,
  ActionIcon
} from '@mantine/core';
import {
  IconRefresh,
  IconUser
} from '@tabler/icons-react';
import { useUsers } from '../../../hooks/useUsers';
import { User } from '../../../types/users.types';
import { RoleManagementModal } from '../ROLE/RoleManagementModal';
import { ActionButtons, DataSummary, ErrorAlert, LoadingScreen } from '@rec-shell/rec-web-shared';
import { UsersFilters } from './UsersFilters';
import { UsersTable } from './UsersTable';
import { EditUserModal } from '../PUT/EditUserModal';

export const UsersPage: React.FC = () => {
  const {
    users,
    filteredUsers,
    loading,
    error,
    filters,
    updateFilters,
    refreshUsers,
    setError
  } = useUsers();

  //Ref. Estados modal roles
  const [roleModalOpened, setRoleModalOpened] = useState(false);
  const [selectedUserForRoles, setSelectedUserForRoles] = useState<User | null>(null);
  
  //Ref. Estados modal edit
  const [editModalOpened, setEditModalOpened] = useState(false);
  const [selectedUserForEdit, setSelectedUserForEdit] = useState<User | null>(null);
  
  const handleEditUser = (userId: number) => {
    console.log('Editar usuario:', userId);
    const user = filteredUsers.find(u => u.id === userId);
    if (user) {
      setSelectedUserForEdit(user);
      setEditModalOpened(true);
    }
  };

  const handleManageRoles = (userId: number) => {
    console.log('Gestionar roles:', userId);
    const user = filteredUsers.find(u => u.id === userId);
    if (user) {
      setSelectedUserForRoles(user);
      setRoleModalOpened(true);
    }
  };

  const handleCloseRoleModal = () => {
    setRoleModalOpened(false);
    setSelectedUserForRoles(null);
  };

  const handleCloseEditModal = () => {
    setEditModalOpened(false);
    setSelectedUserForEdit(null);
  };

  const handleUserUpdated = () => {
    refreshUsers();
  };

  if (loading && users.length === 0) {
    return (
      <LoadingScreen 
        message="Cargando usuarios..." 
        containerSize="xl" 
        height={400} 
      />
    );
  }

  return (
    <Box p="md">
      <Stack gap="lg">
        {/* Header */}
        <Group justify="space-between" align="center">
          <Title order={2}>
            <Group gap="sm">
              <IconUser size={28} />
              Gestión de Usuarios
            </Group>
          </Title>
          <ActionButtons.Refresh 
            onClick={refreshUsers}
            loading={loading} 
          />
        </Group>

        {/* Error Alert */}
        {error && (
          <ErrorAlert 
            error={error}
            onClose={() => setError(null)}
          />
        )}

        {/* Filters */}
        <UsersFilters 
          filters={filters} 
          onFiltersChange={updateFilters} 
        />

        {/* Users Table */}
        <UsersTable
          users={filteredUsers}
          loading={loading}
          onEditUser={handleEditUser}
          onManageRoles={handleManageRoles}
        />

        {/* Modal para gestionar roles */}
        <RoleManagementModal
          opened={roleModalOpened}
          onClose={handleCloseRoleModal}
          user={selectedUserForRoles}
        />

        {/* Modal para editar usuario */}
        <EditUserModal
          opened={editModalOpened}
          onClose={handleCloseEditModal}
          user={selectedUserForEdit}
          onUserUpdated={handleUserUpdated}
        />

        {/* Summary */}
        <DataSummary 
          filteredCount={filteredUsers.length}
          totalCount={users.length}
          itemName="usuarios"
        />
      </Stack>
    </Box>
  );
};