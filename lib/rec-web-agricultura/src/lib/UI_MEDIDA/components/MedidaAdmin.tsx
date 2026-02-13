import { useState, useEffect } from 'react';
import {
  Container,
  Title,
  Table,
  ActionIcon,
  Group,
  Modal,
  TextInput,
  Textarea,
  NumberInput,
  Select,
  Switch,
  Paper,
  Badge,
  Loader,
  Text,
  Stack,
  Box,
  Divider,
  Grid,
  ThemeIcon,
  ScrollArea,
} from '@mantine/core';
import { useForm } from '@mantine/form';
import {
  IconEdit,
  IconTrash,
  IconPlus,
  IconAlignLeft,
  IconCalendar,
  IconCategory,
  IconChartBar,
  IconCurrencyDollar,
  IconFileText,
  IconSun,
} from '@tabler/icons-react';
import { useMedidaPreventiva } from '../hooks/useAgricultura';
import { MedidaPreventiva } from '../../types/model';
import { MedidaPreventivaInput } from '../../types/dto';
import {
  ActionButtons,
  DeleteConfirmModal,
  NOTIFICATION_MESSAGES,
  PaginationControls,
  useNotifications,
  usePagination,
} from '@rec-shell/rec-web-shared';
import { temporadas, tiposMedida } from '../../utils/utils';

export const MedidaAdmin = () => {
  const {
    medidas,
    loading,
    error,
    CREAR,
    BUSCAR,
    ACTUALIZAR,
    ELIMINAR,
    activarMedida,
    desactivarMedida,
    clearError,
  } = useMedidaPreventiva();

  const [modalOpened, setModalOpened] = useState(false);
  const [modalEliminarOpened, setModalEliminarOpened] = useState(false);
  const [modoEdicion, setModoEdicion] = useState(false);
  const [medidaSeleccionada, setMedidaSeleccionada] =
    useState<MedidaPreventiva | null>(null);
  const notifications = useNotifications();

  const form = useForm<MedidaPreventivaInput>({
    initialValues: {
      titulo: '',
      descripcion: '',
      tipoMedida: '',
      frecuenciaRecomendada: '',
      temporadaAplicacion: '',
      costoEstimado: 0,
      efectividadPorcentaje: 0,
      activo: true,
    },
    validate: {
      titulo: (value) => (!value ? 'El título es requerido' : null),
      descripcion: (value) => (!value ? 'La descripción es requerida' : null),
      efectividadPorcentaje: (value) =>
        value && (value < 0 || value > 100) ? 'Debe estar entre 0 y 100' : null,
    },
  });

  useEffect(() => {
    cargarMedidas();
  }, []);

  useEffect(() => {
    if (error) {
      notifications.error(NOTIFICATION_MESSAGES.GENERAL.ERROR.title, error);
      clearError();
    }
  }, [error]);

  const cargarMedidas = async () => {
    try {
      await BUSCAR();
    } catch (error) {
      console.error('Error al cargar medidas:', error);
    }
  };

  const abrirModalCrear = () => {
    setModoEdicion(false);
    setMedidaSeleccionada(null);
    form.reset();
    setModalOpened(true);
  };

  const abrirModalEditar = (medida: MedidaPreventiva) => {
    setModoEdicion(true);
    setMedidaSeleccionada(medida);
    form.setValues({
      titulo: medida.titulo,
      descripcion: medida.descripcion,
      tipoMedida: medida.tipoMedida || '',
      frecuenciaRecomendada: medida.frecuenciaRecomendada || '',
      temporadaAplicacion: medida.temporadaAplicacion || '',
      costoEstimado: medida.costoEstimado || 0,
      efectividadPorcentaje: medida.efectividadPorcentaje || 0,
      activo: medida.activo,
    });
    setModalOpened(true);
  };

  const handleSubmit = async (values: MedidaPreventivaInput) => {
    try {
      if (modoEdicion && medidaSeleccionada) {
        await ACTUALIZAR(medidaSeleccionada.id, values);
        notifications.success();
      } else {
        await CREAR(values);
        notifications.success();
      }
      setModalOpened(false);
      form.reset();
    } catch (error) {
      console.error('Error al guardar:', error);
    }
  };

  const handleEliminar = async (id: number, titulo: string) => {
    try {
      await ELIMINAR(id);
      notifications.success(
        NOTIFICATION_MESSAGES.GENERAL.SUCCESS.title,
        NOTIFICATION_MESSAGES.GENERAL.DELETE.message
      );
      setModalEliminarOpened(false);
      setMedidaSeleccionada(null);
    } catch (error) {
      console.error('Error al eliminar:', error);
    }
  };

  const abrirModalEliminar = (medida: MedidaPreventiva) => {
    setMedidaSeleccionada(medida);
    setModalEliminarOpened(true);
  };

  const handleToggleActivo = async (medida: MedidaPreventiva) => {
    try {
      if (medida.activo) {
        await desactivarMedida(medida.id);
        notifications.success(
          NOTIFICATION_MESSAGES.GENERAL.SUCCESS.title,
          NOTIFICATION_MESSAGES.GENERAL.STATE.message
        );
      } else {
        await activarMedida(medida.id);
        notifications.success(
          NOTIFICATION_MESSAGES.GENERAL.SUCCESS.title,
          NOTIFICATION_MESSAGES.GENERAL.STATE.message
        );
      }
    } catch (error) {
      console.error('Error al cambiar estado:', error);
    }
  };

  // Ref Paginacion Global
  const lista = Array.isArray(medidas) ? medidas : [];
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
    setSearchTerm
  } = usePagination({
    data: lista,
    itemsPerPage: 5,
    searchFields: ['titulo', 'tipoMedida', 'costoEstimado'] 
  });

  if (loading && medidas.length === 0) {
    return (
      <Container size="xl" py="xl">
        <Group justify="center">
          <Loader size="lg" />
        </Group>
      </Container>
    );
  }

  return (
    <Box p="md">
      <Group justify="space-between" mb="xl">
        <Title order={2}>Medidas Preventivas</Title>
        <ActionButtons.Modal onClick={abrirModalCrear} />
      </Group>

      <Paper shadow="sm" p="md" withBorder>
        <ScrollArea type="auto" offsetScrollbars>
        <Table striped highlightOnHover style={{ minWidth: 980 }}>
          <Table.Thead>
            <Table.Tr>
              <Table.Th>Título</Table.Th>
              <Table.Th>Tipo</Table.Th>
              <Table.Th>Efectividad</Table.Th>
              <Table.Th>Costo Estimado</Table.Th>
              <Table.Th>Estado</Table.Th>
              <Table.Th>Acciones</Table.Th>
            </Table.Tr>
          </Table.Thead>
          <Table.Tbody>
            {medidas.length === 0 ? (
              <Table.Tr>
                <Table.Td colSpan={6}>
                  <Text ta="center" c="dimmed">
                    No se encontraron registros
                  </Text>
                </Table.Td>
              </Table.Tr>
            ) : (
              paginatedData.map((medida) => (
                <Table.Tr key={medida.id}>
                  <Table.Td>
                    <Text fw={500}>{medida.titulo}</Text>
                    <Text size="xs" c="dimmed">
                      {medida.descripcion.substring(0, 60)}...
                    </Text>
                  </Table.Td>
                  <Table.Td>
                    <Badge variant="light" color="blue">
                      {medida.tipoMedida || 'N/A'}
                    </Badge>
                  </Table.Td>
                  <Table.Td>
                    {medida.efectividadPorcentaje
                      ? `${medida.efectividadPorcentaje}%`
                      : 'N/A'}
                  </Table.Td>
                  <Table.Td>
                    {medida.costoEstimado
                      ? `$${medida.costoEstimado.toFixed(2)}`
                      : 'N/A'}
                  </Table.Td>
                  <Table.Td>
                    <Switch
                      checked={medida.activo}
                      onChange={() => handleToggleActivo(medida)}
                      color="green"
                      label={medida.activo ? 'Activo' : 'Inactivo'}
                    />
                  </Table.Td>
                  <Table.Td>
                    <Group gap="xs">
                      <ActionIcon
                        variant="light"
                        color="blue"
                        onClick={() => abrirModalEditar(medida)}
                      >
                        <IconEdit size={16} />
                      </ActionIcon>
                      <ActionIcon
                        variant="light"
                        color="red"
                        onClick={() => abrirModalEliminar(medida)}
                      >
                        <IconTrash size={16} />
                      </ActionIcon>
                    </Group>
                  </Table.Td>
                </Table.Tr>
              ))
            )}
          </Table.Tbody>
        </Table>
      </ScrollArea>

      {/* Ref paginacion Global - Controles de paginación */}
      {lista.length > 0 && (
        <PaginationControls
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setPage}
          itemsPerPage={itemsPerPage}
          onItemsPerPageChange={(value) => value && setItemsPerPage(Number(value))}
          startIndex={startIndex}
          endIndex={endIndex}
          totalItems={totalItems}
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
          searchPlaceholder="Buscar por código, nombre o nutriente..."
        />
      )}
      </Paper>

      {/* Modal para Crear/Editar */}
      <Modal
        opened={modalOpened}
        onClose={() => setModalOpened(false)}
        title={
          <Group gap="xs">
            <ThemeIcon
              size="lg"
              variant="light"
              color={modoEdicion ? 'blue' : 'green'}
            >
              {modoEdicion ? <IconEdit size={20} /> : <IconPlus size={20} />}
            </ThemeIcon>
            <Text size="lg" fw={600}>
              {modoEdicion ? 'Editar Registro' : 'Nuevo Registro'}
            </Text>
          </Group>
        }
        size="lg"
        radius="md"
        overlayProps={{
          backgroundOpacity: 0.55,
          blur: 3,
        }}
      >
        
          <Stack gap="lg">
            {/* Sección: Información Básica */}
            <Box>
              <Text size="sm" fw={600} c="dimmed" mb="sm">
                Información Básica
              </Text>
              <Stack gap="md">
                <TextInput
                  label="Título"
                  placeholder="Ingrese el título del registro"
                  required
                  leftSection={<IconFileText size={18} />}
                  {...form.getInputProps('titulo')}
                />

                <Textarea
                  label="Descripción"
                  placeholder="Ingrese una descripción detallada"
                  required
                  minRows={3}
                  autosize
                  maxRows={6}
                  leftSection={<IconAlignLeft size={18} />}
                  {...form.getInputProps('descripcion')}
                />
              </Stack>
            </Box>

            <Divider />

            {/* Sección: Configuración */}
            <Box>
              <Text size="sm" fw={600} c="dimmed" mb="sm">
                Configuración
              </Text>
              <Stack gap="md">
                <Select
                  label="Tipo de Medida"
                  placeholder="Seleccione el tipo"
                  data={tiposMedida}
                  clearable
                  searchable
                  leftSection={<IconCategory size={18} />}
                  {...form.getInputProps('tipoMedida')}
                />

                <Grid>
                  <Grid.Col span={{ base: 12, sm: 6 }}>
                    <TextInput
                      label="Frecuencia Recomendada"
                      placeholder="Ej: Semanal, Mensual"
                      leftSection={<IconCalendar size={18} />}
                      {...form.getInputProps('frecuenciaRecomendada')}
                    />
                  </Grid.Col>
                  <Grid.Col span={{ base: 12, sm: 6 }}>
                    <Select
                      label="Temporada de Aplicación"
                      placeholder="Seleccione la temporada"
                      data={temporadas}
                      clearable
                      leftSection={<IconSun size={18} />}
                      {...form.getInputProps('temporadaAplicacion')}
                    />
                  </Grid.Col>
                </Grid>
              </Stack>
            </Box>

            <Divider />

            {/* Sección: Métricas */}
            <Box>
              <Text size="sm" fw={600} c="dimmed" mb="sm">
                Métricas
              </Text>
              <Grid>
                <Grid.Col span={{ base: 12, sm: 6 }}>
                  <NumberInput
                    label="Costo Estimado"
                    placeholder="0.00"
                    prefix="$"
                    decimalScale={2}
                    min={0}
                    thousandSeparator=","
                    leftSection={<IconCurrencyDollar size={18} />}
                    {...form.getInputProps('costoEstimado')}
                  />
                </Grid.Col>
                <Grid.Col span={{ base: 12, sm: 6 }}>
                  <NumberInput
                    label="Efectividad"
                    placeholder="0-100"
                    suffix="%"
                    min={0}
                    max={100}
                    leftSection={<IconChartBar size={18} />}
                    {...form.getInputProps('efectividadPorcentaje')}
                  />
                </Grid.Col>
              </Grid>
            </Box>

            <Divider />

            {/* Estado */}
            <Paper withBorder p="md" radius="md" bg="gray.0">
              <Switch
                label="Registro Activo"
                description="Activar o desactivar este registro"
                size="md"
                {...form.getInputProps('activo', { type: 'checkbox' })}
              />
            </Paper>

            {/* Botones de Acción */}
            <Group justify="center" mt="xl">
              <ActionButtons.Cancel onClick={() => setModalOpened(false)} />
              <ActionButtons.Save
                onClick={form.onSubmit(handleSubmit)}
                loading={loading}
              />
              
            </Group>
          </Stack>
        
      </Modal>

      {/* Modal de Confirmación para Eliminar */}
      <DeleteConfirmModal
        opened={modalEliminarOpened}
        onClose={() => setModalEliminarOpened(false)}
        onConfirm={async () => {
          if (medidaSeleccionada) {
            await handleEliminar(
              medidaSeleccionada.id,
              medidaSeleccionada.titulo
            );
          }
        }}
        itemName={medidaSeleccionada?.titulo || ''}
        itemType="cultivo"
      />
    </Box>
  );
};
