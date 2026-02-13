import { Select, Text, Stack } from '@mantine/core';
import { IconChevronDown } from '@tabler/icons-react';
import { Role } from '../../../types/role.types';

interface RoleSelectorProps {
  roles: Role[];
  selectedRoleId: number | null;
  onSelectRole: (roleId: number | null) => void;
}

export const RoleSelector = ({ 
  roles, 
  selectedRoleId, 
  onSelectRole 
}: RoleSelectorProps) => {
  const data = roles.map(role => ({
    value: role.id.toString(),
    label: role.name,
    description: role.description,
  }));

  const handleChange = (value: string | null) => {
    onSelectRole(value ? parseInt(value) : null);
  };

  const renderSelectOption = ({ option }: { option: any }) => (
    <Stack gap={2}>
      <Text fw={500}>{option.label}</Text>
      {option.description && (
        <Text size="xs" c="dimmed">
          {option.description}
        </Text>
      )}
    </Stack>
  );

  return (
    <Select
      label="Seleccionar Rol"
      placeholder="Elige un rol para asignar"
      data={data}
      value={selectedRoleId?.toString() || null}
      onChange={handleChange}
      rightSection={<IconChevronDown size={16} />}
      renderOption={renderSelectOption}
      searchable
      clearable
      nothingFoundMessage="No se encontraron roles"
      size="md"
    />
  );
};