import { useEffect } from 'react';
import {
  Container,
  Title,
  Table,
  ScrollArea,
  Stack,
  Loader,
  Alert,
  Center,
  Group,
  Box,
  Text,
} from '@mantine/core';
import { IconAlertCircle } from '@tabler/icons-react';
import {
  ActionButtons,
  PaginationControls,
  usePagination,
} from '@rec-shell/rec-web-shared';
import { useAnalisisImagen } from '../../UI_CARGA_IMAGEN/hook/useAgriculturaMchl';
import { useAnalisisModal } from '../hooks/useAnalisisModal';
import { AnalisisDetalleModal } from './AnalisisDetalleModal';
import { AnalisisTableRow } from './AnalisisTableRow';

export function Listar() {
  const { loading, error, analisisList, OBTENER } = useAnalisisImagen();
  const { selectedAnalisis, modalOpened, openModal, closeModal } = useAnalisisModal();

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
    searchFields: ['archivo','sector'],
  });

  if (loading) {
    return (
      <Container size="lg" py="xl">
        <Center h={400}>
          <Stack align="center" gap="md">
            <Loader size="xl" />
            <Text c="dimmed">Cargando análisis...</Text>
          </Stack>
        </Center>
      </Container>
    );
  }

  if (error) {
    return (
      <Container size="lg" py="xl">
        <Alert icon={<IconAlertCircle size={20} />} title="Error" color="red">
          {error}
        </Alert>
      </Container>
    );
  }

  return (
    <Box p="md">
      <Stack gap="lg">
        <Group justify="space-between" align="center">
          <Title order={2}>Historial de Análisis</Title>
          <ActionButtons.Refresh onClick={OBTENER} />
        </Group>

        {analisisList.length === 0 ? (
          <Alert
            icon={<IconAlertCircle size={20} />}
            title="Sin registros"
            color="blue"
          >
            No hay análisis registrados. Realiza tu primer análisis para
            comenzar.
          </Alert>
        ) : (
          <ScrollArea type="auto" offsetScrollbars>
          <Table striped highlightOnHover withTableBorder withColumnBorders style={{ minWidth: 980 }}>
            <Table.Thead>
              <Table.Tr>
                <Table.Th>Archivo</Table.Th>
                <Table.Th>Estado</Table.Th>
                <Table.Th>Detecciones</Table.Th>
                <Table.Th>Cultivo</Table.Th>
                <Table.Th>Ubicación</Table.Th>
                <Table.Th className="hide-sm">Confianza Promedio</Table.Th>
                <Table.Th className="hide-sm">Deficiencias</Table.Th>
                <Table.Th className="hide-sm">Fecha</Table.Th>
                <Table.Th>Acciones</Table.Th>
              </Table.Tr>
            </Table.Thead>
            <Table.Tbody>
              {paginatedData.map((analisis) => (
                <AnalisisTableRow
                  key={analisis.id}
                  analisis={analisis}
                  onViewDetails={openModal}
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

      <AnalisisDetalleModal
        opened={modalOpened}
        onClose={closeModal}
        analisis={selectedAnalisis}
      />
    </Box>
  );
}