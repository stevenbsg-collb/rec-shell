import { useEffect } from 'react';
import { Table, Stack, Box, ScrollArea } from '@mantine/core';
import { EmptyState, PaginationControls, usePagination } from '@rec-shell/rec-web-shared';
import { useAnalisisImagen } from '../../UI_CARGA_IMAGEN/hook/useAgriculturaMchl';
import { usePlanTratamientoGenerator } from '../hooks/useGenerator';
import { AnalisisAdminTableHeader } from './AnalisisAdminTableHeader';
import { AnalisisAdminTableRow } from './AnalisisAdminTableRow';
import { PageHeader } from './PageHeader';
import { LoadingState, ErrorState } from './Statecomponents';

export function ListarAdmin() {
  const { loading, error, analisisList, OBTENER } = useAnalisisImagen();
  const { isProcessing, generatingAnalisisId, handleGenerarPlan } =
    usePlanTratamientoGenerator();

  useEffect(() => {
    OBTENER();
  }, []);

  // Paginación
  const lista = Array.isArray(analisisList) ? analisisList : [];
  const {
    currentPage,
    totalPages,
    paginatedData,
    setPage,
    setItemsPerPage,
    itemsPerPage,
    startIndex,
    endIndex,
    totalItems,
    searchTerm,
    setSearchTerm,
  } = usePagination({
    data: lista,
    itemsPerPage: 5,
    searchFields: ['archivo', 'mensaje'],
  });

  if (loading) {
    return <LoadingState />;
  }

  if (error) {
    return <ErrorState error={error} />;
  }

  return (
    <Box p="md">
      <Stack gap="lg">
        <PageHeader onRefresh={OBTENER} />

        {analisisList.length === 0 ? (
          <EmptyState />
        ) : (
          <ScrollArea type="auto" offsetScrollbars>
          <Table striped highlightOnHover withTableBorder withColumnBorders style={{ minWidth: 980 }}>
            <AnalisisAdminTableHeader />
            <Table.Tbody>
              {paginatedData.map((analisis) => (
                <AnalisisAdminTableRow
                  key={analisis.id}
                  analisis={analisis}
                  onGenerarPlan={handleGenerarPlan}
                  isProcessing={isProcessing}
                  generatingAnalisisId={generatingAnalisisId}
                />
              ))}
            </Table.Tbody>
          </Table>
        </ScrollArea>
        )}

        {lista.length > 0 && (
          <PaginationControls
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setPage}
            itemsPerPage={itemsPerPage}
            onItemsPerPageChange={(value) =>
              value && setItemsPerPage(Number(value))
            }
            startIndex={startIndex}
            endIndex={endIndex}
            totalItems={totalItems}
            searchTerm={searchTerm}
            onSearchChange={setSearchTerm}
            searchPlaceholder="Buscar por archivo o mensaje..."
          />
        )}
      </Stack>
    </Box>
  );
}
