import { useState, useEffect } from 'react';
import {
  Title,
  Table,
  Modal,
  TextInput,
  Textarea,
  NumberInput,
  Switch,
  Group,
  ActionIcon,
  Stack,
  Paper,
  LoadingOverlay,
  Text,
  Alert,
  Box,
  Divider,
  Badge,
  Select,
  ScrollArea,
} from '@mantine/core';
import { useForm } from '@mantine/form';
import {
  IconEdit,
  IconTrash,
  IconAlertCircle,
  IconCurrencyDollar,
  IconAlignLeft,
  IconCalendar,
  IconClock,
  IconDroplet,
  IconFlask,
  IconPlant,
} from '@tabler/icons-react';
import { useTratamientos } from '../hooks/useAgricultura';
import { Tratamiento } from '../../types/model';
import {
  ActionButtons,
  DeleteConfirmModal,
  PaginationControls,
  usePagination,
} from '@rec-shell/rec-web-shared';

export function TratamientosAdmin() {
  const { tratamientos, loading, error, CREAR, ACTUALIZAR, ELIMINAR, BUSCAR } =
    useTratamientos();
  const [modalOpened, setModalOpened] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [deletingTratamiento, setDeletingTratamiento] =
    useState<Tratamiento | null>(null);

  const form = useForm({
    initialValues: {
      nombreTratamiento: '',
      tipoTratamiento: '',
      descripcion: '',
      dosisRecomendada: '',
      frecuenciaAplicacion: '',
      tiempoEfectividadDias: 0,
      costoEstimadoPorHectarea: 0,
      activo: true,
    },
    validate: {
      nombreTratamiento: (value) => (!value ? 'El nombre es requerido' : null),
      dosisRecomendada: (value) => (!value ? 'La dosis es requerida' : null),
    },
  });

  useEffect(() => {
    BUSCAR();
  }, [BUSCAR]);

  const handleOpenModal = (tratamiento: Tratamiento | null = null) => {
    if (tratamiento) {
      setEditingId(tratamiento.id);
      form.setValues({
        nombreTratamiento: tratamiento.nombreTratamiento,
        tipoTratamiento: tratamiento.tipoTratamiento || '',
        descripcion: tratamiento.descripcion || '',
        dosisRecomendada: tratamiento.dosisRecomendada || '',
        frecuenciaAplicacion: tratamiento.frecuenciaAplicacion || '',
        tiempoEfectividadDias: tratamiento.tiempoEfectividadDias || 0,
        costoEstimadoPorHectarea: tratamiento.costoEstimadoPorHectarea || 0,
        activo: tratamiento.activo,
      });
    } else {
      setEditingId(null);
      form.reset();
    }
    setModalOpened(true);
  };

  const handleCloseModal = () => {
    setModalOpened(false);
    setEditingId(null);
    form.reset();
  };

  const handleSubmit = async (values: typeof form.values) => {
    try {
      if (editingId) {
        await ACTUALIZAR(editingId, values);
      } else {
        await CREAR(values);
      }
      handleCloseModal();
    } catch (err) {
      console.error('Error al guardar:', err);
    }
  };

  const handleDelete = async (id: number) => {
    try {
      await ELIMINAR(id);
      setDeletingTratamiento(null);
    } catch (err) {
      console.error('Error al eliminar:', err);
    }
  };

  // Ref Paginacion Global
  const lista = Array.isArray(tratamientos) ? tratamientos : [];
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
    searchFields: [
      'nombreTratamiento',
      'tipoTratamiento',
      'dosisRecomendada',
      'costoEstimadoPorHectarea',
    ],
  });

  return (
    <Box p="md">
      <Paper shadow="sm" p="md" radius="md" withBorder>
        <Group justify="space-between" mb="xl">
          <Title order={2}>Gestión de Tratamientos</Title>
          <ActionButtons.Modal onClick={() => handleOpenModal()} />
        </Group>

        {error && (
          <Alert icon={<IconAlertCircle size={16} />} color="red" mb="md">
            {error}
          </Alert>
        )}

        <div style={{ position: 'relative' }}>
          <LoadingOverlay visible={loading} />

          <ScrollArea type="auto" offsetScrollbars>
        <Table striped highlightOnHover style={{ minWidth: 980 }}>
            <Table.Thead>
              <Table.Tr>
                <Table.Th>Nombre</Table.Th>
                <Table.Th>Tipo</Table.Th>
                <Table.Th>Dosis</Table.Th>
                <Table.Th>Frecuencia</Table.Th>
                <Table.Th>Días Efectividad</Table.Th>
                <Table.Th>Costo/Ha</Table.Th>
                <Table.Th>Estado</Table.Th>
                <Table.Th>Acciones</Table.Th>
              </Table.Tr>
            </Table.Thead>
            <Table.Tbody>
              {paginatedData.map((tratamiento) => (
                <Table.Tr key={tratamiento.id}>
                  <Table.Td>{tratamiento.nombreTratamiento}</Table.Td>
                  <Table.Td>{tratamiento.tipoTratamiento || '-'}</Table.Td>
                  <Table.Td>{tratamiento.dosisRecomendada}</Table.Td>
                  <Table.Td>{tratamiento.frecuenciaAplicacion || '-'}</Table.Td>
                  <Table.Td>
                    {tratamiento.tiempoEfectividadDias || '-'}
                  </Table.Td>
                  <Table.Td>
                    ${' '}
                    {tratamiento.costoEstimadoPorHectarea?.toFixed(2) || '0.00'}
                  </Table.Td>
                  <Table.Td>
                    <Text c={tratamiento.activo ? 'green' : 'red'} fw={500}>
                      {tratamiento.activo ? 'Activo' : 'Inactivo'}
                    </Text>
                  </Table.Td>
                  <Table.Td>
                    <Group gap="xs">
                      <ActionIcon
                        variant="light"
                        color="blue"
                        onClick={() => handleOpenModal(tratamiento)}
                      >
                        <IconEdit size={16} />
                      </ActionIcon>
                      <ActionIcon
                        variant="light"
                        color="red"
                        onClick={() => setDeletingTratamiento(tratamiento)}
                      >
                        <IconTrash size={16} />
                      </ActionIcon>
                    </Group>
                  </Table.Td>
                </Table.Tr>
              ))}
            </Table.Tbody>
          </Table>
      </ScrollArea>

          {tratamientos.length === 0 && !loading && (
            <Text ta="center" py="xl" c="dimmed">
              {searchTerm
                ? 'No se encontraron resultados para tu búsqueda'
                : 'No se encontraron registros'}
            </Text>
          )}

          {/* Ref paginacion Global - Controles de paginación */}
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
              searchPlaceholder="Buscar por código, nombre o nutriente..."
            />
          )}
        </div>
      </Paper>

      {/* Modal Crear/Editar */}
      <Modal
        opened={modalOpened}
        onClose={handleCloseModal}
        title={
          <Group gap="xs">
            <IconPlant size={24} stroke={1.5} style={{ color: '#40c057' }} />
            <span style={{ fontSize: '1.2rem', fontWeight: 600 }}>
              {editingId ? 'Editar Registro' : 'Nuevo Registro'}
            </span>
            {editingId && (
              <Badge color="blue" variant="light">
                Editando
              </Badge>
            )}
          </Group>
        }
        size="lg"
        radius="md"
        padding="xl"
        overlayProps={{
          backgroundOpacity: 0.55,
          blur: 3,
        }}
        transitionProps={{ transition: 'fade', duration: 200 }}
      >
        <Stack gap="lg">
          {/* Sección: Información Básica */}
          <div>
            <Group gap="xs" mb="md">
              <div
                style={{
                  width: 4,
                  height: 20,
                  backgroundColor: '#40c057',
                  borderRadius: 2,
                }}
              />
              <span
                style={{
                  fontSize: '0.95rem',
                  fontWeight: 600,
                  color: '#495057',
                }}
              >
                Información Básica
              </span>
            </Group>

            <Stack gap="md">
              <TextInput
                label="Nombre del Tratamiento"
                placeholder="Ej: Fertilizante NPK"
                required
                leftSection={<IconPlant size={18} stroke={1.5} />}
                styles={{
                  input: {
                    borderRadius: '8px',
                    '&:focus': {
                      borderColor: '#40c057',
                    },
                  },
                }}
                {...form.getInputProps('nombreTratamiento')}
              />

              <Select
                label="Tipo de Deficiencia"
                placeholder="Selecciona un tipo"
                leftSection={<IconFlask size={18} stroke={1.5} />}
                data={[
                  { value: 'Potasio', label: 'Potasio' },
                  { value: 'Nitrogeno', label: 'Nitrógeno' },
                  { value: 'Fosforo', label: 'Fósforo' },
                ]}
                searchable
                clearable
                styles={{
                  input: {
                    borderRadius: '8px',
                    '&:focus': {
                      borderColor: '#40c057',
                    },
                  },
                }}
                {...form.getInputProps('tipoTratamiento')}
              />

              <Textarea
                label="Descripción"
                placeholder="Describe el tratamiento y sus beneficios..."
                minRows={3}
                leftSection={<IconAlignLeft size={18} stroke={1.5} />}
                styles={{
                  input: {
                    borderRadius: '8px',
                    '&:focus': {
                      borderColor: '#40c057',
                    },
                  },
                }}
                {...form.getInputProps('descripcion')}
              />
            </Stack>
          </div>

          <Divider />

          {/* Sección: Dosificación y Frecuencia */}
          <div>
            <Group gap="xs" mb="md">
              <div
                style={{
                  width: 4,
                  height: 20,
                  backgroundColor: '#228be6',
                  borderRadius: 2,
                }}
              />
              <span
                style={{
                  fontSize: '0.95rem',
                  fontWeight: 600,
                  color: '#495057',
                }}
              >
                Dosificación y Aplicación
              </span>
            </Group>

            <Stack gap="md">
              <TextInput
                label="Dosis Recomendada"
                placeholder="Ej: 200 kg/ha"
                required
                leftSection={<IconDroplet size={18} stroke={1.5} />}
                styles={{
                  input: {
                    borderRadius: '8px',
                    '&:focus': {
                      borderColor: '#228be6',
                    },
                  },
                }}
                {...form.getInputProps('dosisRecomendada')}
              />

              <TextInput
                label="Frecuencia de Aplicación"
                placeholder="Ej: Cada 30 días"
                leftSection={<IconCalendar size={18} stroke={1.5} />}
                styles={{
                  input: {
                    borderRadius: '8px',
                    '&:focus': {
                      borderColor: '#228be6',
                    },
                  },
                }}
                {...form.getInputProps('frecuenciaAplicacion')}
              />

              <NumberInput
                label="Tiempo de Efectividad (días)"
                placeholder="30"
                min={0}
                leftSection={<IconClock size={18} stroke={1.5} />}
                styles={{
                  input: {
                    borderRadius: '8px',
                    '&:focus': {
                      borderColor: '#228be6',
                    },
                  },
                }}
                {...form.getInputProps('tiempoEfectividadDias')}
              />
            </Stack>
          </div>

          <Divider />

          {/* Sección: Información Financiera */}
          <div>
            <Group gap="xs" mb="md">
              <div
                style={{
                  width: 4,
                  height: 20,
                  backgroundColor: '#fd7e14',
                  borderRadius: 2,
                }}
              />
              <span
                style={{
                  fontSize: '0.95rem',
                  fontWeight: 600,
                  color: '#495057',
                }}
              >
                Información Financiera
              </span>
            </Group>

            <NumberInput
              label="Costo Estimado por Hectárea"
              placeholder="0.00"
              min={0}
              decimalScale={2}
              fixedDecimalScale
              prefix="$ "
              leftSection={<IconCurrencyDollar size={18} stroke={1.5} />}
              styles={{
                input: {
                  borderRadius: '8px',
                  fontWeight: 500,
                  '&:focus': {
                    borderColor: '#fd7e14',
                  },
                },
              }}
              {...form.getInputProps('costoEstimadoPorHectarea')}
            />
          </div>

          <Divider />

          <div
            style={{
              backgroundColor: '#f8f9fa',
              padding: '16px',
              borderRadius: '8px',
              border: '1px solid #e9ecef',
            }}
          >
            <Switch
              label="Tratamiento Activo"
              description="Indica si este tratamiento está disponible para uso"
              size="md"
              color="teal"
              {...form.getInputProps('activo', { type: 'checkbox' })}
            />
          </div>

          <Group justify="center" mt="md" gap="sm">
            <ActionButtons.Cancel onClick={handleCloseModal} />
            <ActionButtons.Save
              onClick={() => handleSubmit(form.values)}
              loading={loading}
            />
          </Group>
        </Stack>
      </Modal>

      {/* Modal Confirmación Eliminar */}
      <DeleteConfirmModal
        opened={deletingTratamiento !== null}
        onClose={() => setDeletingTratamiento(null)}
        onConfirm={async () => {
          if (deletingTratamiento) {
            await handleDelete(deletingTratamiento.id);
          }
        }}
        itemName={deletingTratamiento?.nombreTratamiento || 'Registro'}
      />
    </Box>
  );
}
