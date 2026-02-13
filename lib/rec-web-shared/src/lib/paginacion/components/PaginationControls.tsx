import { Flex, Pagination, Select, Text, Group, TextInput } from '@mantine/core';
import { IconSearch } from '@tabler/icons-react';


interface PaginationControlsProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  itemsPerPage: number;
  onItemsPerPageChange: (value: string | null) => void;
  startIndex: number;
  endIndex: number;
  totalItems: number;
  itemsPerPageOptions?: string[];
  searchTerm?: string;
  onSearchChange?: (value: string) => void;
  searchPlaceholder?: string;
}

export const PaginationControls = ({
  currentPage,
  totalPages,
  onPageChange,
  itemsPerPage,
  onItemsPerPageChange,
  startIndex,
  endIndex,
  totalItems,
  itemsPerPageOptions = ['5', '10', '20', '50', '100'],
  searchTerm = '',
  onSearchChange,
  searchPlaceholder = 'Buscar...'
}: PaginationControlsProps) => {
  return (
    <Flex
      justify="space-between"
      align="center"
      mt="md"
      gap="md"
      direction={{ base: 'column', sm: 'row' }}
    >
      {/* Barra de búsqueda */}
      {onSearchChange && (
        <TextInput
          placeholder={searchPlaceholder}
          leftSection={<IconSearch size={16} />}
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
          w={{ base: '100%', sm: 300 }}
        />
      )}

      <Group gap="xs">
        <Text size="sm" c="dimmed">
          Mostrando {totalItems === 0 ? 0 : startIndex} - {endIndex} de {totalItems} registros
        </Text>
      </Group>

      <Group gap="md">
        <Group gap="xs">
          <Text size="sm" c="dimmed">
            Mostrar:
          </Text>
          <Select
            size="xs"
            value={itemsPerPage.toString()}
            onChange={onItemsPerPageChange}
            data={itemsPerPageOptions}
            w={70}
          />
        </Group>

        <Pagination
          value={currentPage}
          onChange={onPageChange}
          total={totalPages}
          size="sm"
          withEdges
        />
      </Group>
    </Flex>
  );
};