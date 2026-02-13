import React from 'react';
import { TextInput, Select, Card, Grid } from '@mantine/core';
import { IconSearch, IconFilter, IconShield } from '@tabler/icons-react';
import { UsersFiltersProps } from '../../../types/users.types';
import { USER_STATUS_OPTIONS, USER_ROLE_OPTIONS } from '../../../constants/users.constants';

export const UsersFilters: React.FC<UsersFiltersProps> = ({ filters, onFiltersChange }) => {
  const handleSearchChange = (value: string) => {
    onFiltersChange({ ...filters, searchTerm: value });
  };

  const handleStatusChange = (value: string | null) => {
    onFiltersChange({ ...filters, statusFilter: value || '' });
  };

  const handleRoleChange = (value: string | null) => {
    onFiltersChange({ ...filters, roleFilter: value || '' });
  };

  return (
    <Card withBorder p="md">
      <Grid>
        <Grid.Col span={{ base: 12, md: 4 }}>
          <TextInput
            placeholder="Buscar por usuario, email o nombre..."
            leftSection={<IconSearch size={16} />}
            value={filters.searchTerm}
            onChange={(e) => handleSearchChange(e.target.value)}
          />
        </Grid.Col>
        <Grid.Col span={{ base: 12, md: 4 }}>
          <Select
            placeholder="Filtrar por estado"
            leftSection={<IconFilter size={16} />}
            value={filters.statusFilter}
            onChange={handleStatusChange}
            data={USER_STATUS_OPTIONS}
            clearable
          />
        </Grid.Col>
        <Grid.Col span={{ base: 12, md: 4 }}>
          <Select
            placeholder="Filtrar por rol"
            leftSection={<IconShield size={16} />}
            value={filters.roleFilter}
            onChange={handleRoleChange}
            data={USER_ROLE_OPTIONS}
            clearable
          />
        </Grid.Col>
      </Grid>
    </Card>
  );
};