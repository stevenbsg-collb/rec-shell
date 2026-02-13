import React from 'react';
import {
  Card,
  Table,
  ScrollArea,
  LoadingOverlay,
  Text,
  Group,
  ActionIcon,
  Tooltip,
} from '@mantine/core';
import { PaginationControls } from './PaginationControls';
import { usePagination } from '../hooks/usePagination';
import { PaginatedTableProps } from '../interface/interface';

export function PaginatedTable<T extends Record<string, any>>({
  data,
  columns,
  actions = [],
  loading = false,
  searchFields = [],
  itemsPerPage = 5,
  emptyMessage = 'No se encontraron registros',
  searchPlaceholder = 'Buscar...',
  getRowKey,
}: PaginatedTableProps<T>) {
  const lista = Array.isArray(data) ? data : [];

  const {
    currentPage,
    totalPages,
    paginatedData,
    setPage,
    setItemsPerPage,
    itemsPerPage: currentItemsPerPage,
    startIndex,
    endIndex,
    totalItems,
    searchTerm,
    setSearchTerm,
  } = usePagination({
    data: lista,
    itemsPerPage,
    searchFields,
  });

  return (
    <Card withBorder>
      <LoadingOverlay visible={loading} />

      <ScrollArea type="auto" offsetScrollbars>
      <Table striped highlightOnHover style={{ minWidth: 900 }}>
        <Table.Thead>
          <Table.Tr>
            {columns.map((column) => (
              <Table.Th key={column.key} style={{ width: column.width }}>
                {column.label}
              </Table.Th>
            ))}
            {actions.length > 0 && <Table.Th>Acciones</Table.Th>}
          </Table.Tr>
        </Table.Thead>
        <Table.Tbody>
          {paginatedData.map((item) => (
            <Table.Tr key={getRowKey(item)}>
              {columns.map((column) => (
                <Table.Td key={column.key}>
                  {column.render
                    ? column.render(item)
                    : item[column.key] || '-'}
                </Table.Td>
              ))}
              {actions.length > 0 && (
                <Table.Td>
                  <Group gap={4}>
                    {actions.map((action, index) => (
                      <Tooltip key={index} label={action.label}>
                        <ActionIcon
                          variant="light"
                          color={action.color || 'blue'}
                          size="sm"
                          onClick={() => action.onClick(item)}
                        >
                          {action.icon}
                        </ActionIcon>
                      </Tooltip>
                    ))}
                  </Group>
                </Table.Td>
              )}
            </Table.Tr>
          ))}
        </Table.Tbody>
      </Table>
      </ScrollArea>

      {lista.length === 0 && !loading && (
        <Text ta="center" py="xl" c="dimmed">
          {searchTerm
            ? 'No se encontraron resultados para tu búsqueda'
            : emptyMessage}
        </Text>
      )}

      {lista.length > 0 && (
        <PaginationControls
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setPage}
          itemsPerPage={currentItemsPerPage}
          onItemsPerPageChange={(value) =>
            value && setItemsPerPage(Number(value))
          }
          startIndex={startIndex}
          endIndex={endIndex}
          totalItems={totalItems}
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
          searchPlaceholder={searchPlaceholder}
        />
      )}
    </Card>
  );
}
