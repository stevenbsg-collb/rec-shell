import React, { useState, useEffect } from 'react';
import {
  Container,
  Table,
  Button,
  Modal,
  TextInput,
  Textarea,
  Select,
  NumberInput,
  Group,
  ActionIcon,
  Text,
  Badge,
  Paper,
  Title,
  Stack,
  Alert,
  LoadingOverlay,
  Box,
  Divider,
  ThemeIcon
  ScrollArea,
} from '@mantine/core';
import { useForm } from '@mantine/form';
import { IconEdit, IconTrash, IconEye, IconAlertCircle } from '@tabler/icons-react';
import { EstadoActividad } from '../../enums/Enums';
import { ActividadSeguimiento, PlanTratamiento } from '../../types/model';
import { useActividadSeguimiento } from '../hooks/useAgricultura';
import { estadoColors } from '../../utils/utils';
import { ActionButtons, DeleteConfirmModal, NOTIFICATION_MESSAGES, useNotifications } from '@rec-shell/rec-web-shared';
import { Activity, ClipboardList, FileText, Bell, Calendar, CheckCircle, Clock, DollarSign, User } from 'lucide-react';
import { useTratamientos } from '../../UI_TRATANIENTO/hooks/useAgricultura';

const estadoOptions = Object.values(EstadoActividad).map(estado => ({
  value: estado,
  label: estado.replace('_', ' ')
}));

export const SeguimientosAdmin_v1: React.FC = () => {
  const [modalOpened, setModalOpened] = useState(false);
  const [detailModalOpened, setDetailModalOpened] = useState(false);
  const [deleteOpened, setDeleteOpened] = useState(false);
  const [eliminando, setEliminando] = useState(false);
  const [registroAEliminar, setRegistroAEliminar] = useState<any>(null);
  const [editingActividad, setEditingActividad] = useState<ActividadSeguimiento | null>(null);
  const [viewingActividad, setViewingActividad] = useState<ActividadSeguimiento | null>(null);
  const notifications = useNotifications();

  //Ref 1 Consumir hook para combo v1
  const { tratamientos, LISTAR } = useTratamientos();
   useEffect(() => {
    LISTAR();
  }, [LISTAR]);
  const listTratamientos = tratamientos.map(tratamiento => ({
    value: tratamiento.id.toString(), 
    label: `${tratamiento.nombreTratamiento} - ${tratamiento.tipoTratamiento}`
  }));
  //Ref 1 Consumir hook para combo v1


  const {
    actividades,
    loading,
    error,
    CREAR,
    BUSCAR,
    ACTUALIZAR,
    ELIMINAR,
    clearError
  } = useActividadSeguimiento();

  interface InfoItemProps {
    icon: React.ElementType;
    label: string;
    value: string | number | React.ReactNode;
    color?: string;
  }

  const InfoItem = ({ icon: Icon, label, value, color = 'blue' }: InfoItemProps) => (
    <Group gap="sm" wrap="nowrap" align="flex-start">
      <ThemeIcon size="lg" variant="light" color={color} radius="md">
        <Icon size={18} />
      </ThemeIcon>
      <div style={{ flex: 1 }}>
        <Text size="xs" c="dimmed" fw={500} tt="uppercase" mb={4}>
          {label}
        </Text>
        <Text size="sm" fw={500}>
          {value}
        </Text>
      </div>
    </Group>
  );
  
  const form = useForm<Partial<ActividadSeguimiento>>({
    initialValues: {
      planTratamiento: undefined,
      nombreActividad: '',
      descripcion: '',
      fechaProgramada: '',
      estado: EstadoActividad.PENDIENTE,
      resultadoActividad: '',
      costoReal: undefined,
      responsable: '',
      recordatorioEnviado: false,
      planTratamientoId: ''
    },
    validate: {
      //planTratamiento: (value) => (!value ? 'El plan de tratamiento es requerido' : null),
      nombreActividad: (value) => (!value ? 'El nombre es requerido' : null),
      fechaProgramada: (value) => (!value ? 'La fecha programada es requerida' : null),
      estado: (value) => (!value ? 'El estado es requerido' : null)
    }
  });

  useEffect(() => {
    BUSCAR();
  }, []);

  useEffect(() => {
    if (error) {
      notifications.error(NOTIFICATION_MESSAGES.GENERAL.ERROR.title, error);
      
      clearError();
    }
  }, [error, clearError, notifications]);

  const handleOpenModal = (actividad?: ActividadSeguimiento) => {
    if (actividad) {
      setEditingActividad(actividad);
      form.setValues({
        planTratamiento: actividad.planTratamiento,
        nombreActividad: actividad.nombreActividad,
        descripcion: actividad.descripcion || '',
        fechaProgramada: actividad.fechaProgramada,
        estado: actividad.estado,
        resultadoActividad: actividad.resultadoActividad || '',
        costoReal: actividad.costoReal,
        responsable: actividad.responsable || '',
        recordatorioEnviado: actividad.recordatorioEnviado,
        planTratamientoId: actividad.planTratamiento?.id || ''
      });
    } else {
      setEditingActividad(null);
      form.reset();
    }
    setModalOpened(true);
  };

  const handleCloseModal = () => {
    setModalOpened(false);
    setEditingActividad(null);
    form.reset();
  };

  const handleSubmit = async (values: Partial<ActividadSeguimiento>) => {
    try {
      if (values.planTratamientoId) {
        values.planTratamiento = {
          id: values.planTratamientoId
        } as PlanTratamiento;
      }

      if (editingActividad) {
        await ACTUALIZAR(editingActividad.id, {
          ...editingActividad,
          ...values
        } as ActividadSeguimiento);
        
        notifications.success();
      } else {
        await CREAR(values as ActividadSeguimiento);
        notifications.success();
      }
      handleCloseModal();
      BUSCAR();
    } catch (error) {
      console.error('Error al guardar actividad:', error);
    }
  };

  /*const handleEliminar = async (id: string) => {
    if (window.confirm('¿Estás seguro de que quieres eliminar esta actividad?')) {
      try {
        await ELIMINAR(id);
        notifications.success(NOTIFICATION_MESSAGES.GENERAL.SUCCESS.title, NOTIFICATION_MESSAGES.GENERAL.DELETE.message);
        BUSCAR();
      } catch (error) {
        console.error('Error al eliminar actividad:', error);
      }
    }
  };*/

  const handleEliminar = (cultivo: any) => {
    setRegistroAEliminar(cultivo);
    setDeleteOpened(true);
  };

  const confirmarEliminacion = async () => {
    if (registroAEliminar) {
      setEliminando(true);
      try {
        await ELIMINAR(registroAEliminar.id);
        
        setDeleteOpened(false);
        setRegistroAEliminar(null);
      } catch (error) {
        console.error('Error al eliminar:', error);
      } finally {
        setEliminando(false);
      }
    }
  };

  const handleViewDetails = (actividad: ActividadSeguimiento) => {
    setViewingActividad(actividad);
    setDetailModalOpened(true);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('es-ES');
  };

  return (
    <Box p="md">
      <Paper p="md" withBorder>
        <Group justify="space-between" mb="md">
          <Title order={2}>Gestión de Actividades de Seguimiento</Title>
          
          <ActionButtons.Modal 
            onClick={() => handleOpenModal()} 
            loading={loading} 
          />
        </Group>

        <Box pos="relative">
          <LoadingOverlay visible={loading} />
          
          {actividades.length === 0 ? (
            <Alert icon={<IconAlertCircle size={16} />} title="Sin datos">
              No se encontraron registros
            </Alert>
          ) : (
            <ScrollArea type="auto" offsetScrollbars>
        <Table striped highlightOnHover style={{ minWidth: 980 }}>
              <Table.Thead>
                <Table.Tr>
                  <Table.Th>Plan</Table.Th>
                  <Table.Th>Nombre</Table.Th>
                  <Table.Th>Fecha Programada</Table.Th>
                  <Table.Th>Estado</Table.Th>
                  <Table.Th>Responsable</Table.Th>
                  <Table.Th>Costo Real</Table.Th>
                  <Table.Th>Acciones</Table.Th>
                </Table.Tr>
              </Table.Thead>
              <Table.Tbody>
                {actividades.map((actividad) => (
                  <Table.Tr key={actividad.id}>
                    <Table.Td>
                      <Text size="sm">{actividad.planTratamiento?.nombreTratamiento || 'Sin plan'}</Text>
                    </Table.Td>
                    <Table.Td>
                      <Text fw={500}>{actividad.nombreActividad}</Text>
                    </Table.Td>
                    <Table.Td>{formatDate(actividad.fechaProgramada)}</Table.Td>
                    <Table.Td>
                      <Badge color={estadoColors[actividad.estado]} variant="light">
                        {actividad.estado.replace('_', ' ')}
                      </Badge>
                    </Table.Td>
                    <Table.Td>{actividad.responsable || '-'}</Table.Td>
                    <Table.Td>
                      {actividad.costoReal ? `$${actividad.costoReal.toLocaleString()}` : '-'}
                    </Table.Td>
                    <Table.Td>
                      <Group gap="xs">
                        <ActionIcon
                          variant="subtle"
                          color="blue"
                          onClick={() => handleViewDetails(actividad)}
                        >
                          <IconEye size={16} />
                        </ActionIcon>
                        <ActionIcon
                          variant="subtle"
                          color="yellow"
                          onClick={() => handleOpenModal(actividad)}
                        >
                          <IconEdit size={16} />
                        </ActionIcon>
                        <ActionIcon
                          variant="subtle"
                          color="red"
                          onClick={() => handleEliminar(actividad.id)}
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
          )}
        </Box>
      </Paper>

      {/* Modal para Crear/Editar */}
      <Modal
        opened={modalOpened}
        onClose={handleCloseModal}
        title={editingActividad ? 'Editar Registro' : 'Nuevo Registro'}
        size="xl"
      >
        <form onSubmit={form.onSubmit(handleSubmit)}>
          <Stack gap="md">
            <Select
              label="Plan de Tratamiento"
              placeholder="Seleccione un plan de tratamiento"
              data={listTratamientos}
              {...form.getInputProps('planTratamientoId')}
              required
              searchable
            />

            <TextInput
              label="Nombre de la Actividad"
              placeholder="Ingrese el nombre de la actividad"
              {...form.getInputProps('nombreActividad')}
              required
            />

            <Textarea
              label="Descripción"
              placeholder="Ingrese la descripción (opcional)"
              {...form.getInputProps('descripcion')}
              autosize
              minRows={3}
            />

            <TextInput
              label="Fecha Programada"
              type="date"
              {...form.getInputProps('fechaProgramada')}
              required
            />

            <Select
              label="Estado"
              placeholder="Seleccione el estado"
              data={estadoOptions}
              {...form.getInputProps('estado')}
              required
            />

            <Textarea
              label="Resultado de la Actividad"
              placeholder="Ingrese el resultado (opcional)"
              {...form.getInputProps('resultadoActividad')}
              autosize
              minRows={2}
            />

            <NumberInput
              label="Costo Real"
              placeholder="Ingrese el costo real"
              {...form.getInputProps('costoReal')}
              min={0}
              decimalScale={2}
              prefix="$"
            />

            <TextInput
              label="Responsable"
              placeholder="Ingrese el responsable"
              {...form.getInputProps('responsable')}
            />

            <Group justify="flex-end" mt="md">
              <Button variant="subtle" onClick={handleCloseModal}>
                Cancelar
              </Button>
              <Button type="submit" loading={loading}>
                {editingActividad ? 'Actualizar' : 'Crear'}
              </Button>
            </Group>
          </Stack>
        </form>
      </Modal>

      {/* Modal para Ver Detalles */}
     <Modal
      opened={detailModalOpened}
      onClose={() => setDetailModalOpened(false)}
      title={
        <Group gap="xs">
          <ThemeIcon size="lg" variant="light" color="blue" radius="md">
            <Activity size={20} />
          </ThemeIcon>
          <Text fw={600} size="lg">Detalles de la Actividad</Text>
        </Group>
      }
      size="lg"
      radius="md"
      padding="xl"
    >
      {viewingActividad && (
        <Stack gap="lg">
          {/* Sección Principal */}
          <Paper p="md" radius="md" withBorder>
            <Stack gap="md">
              <InfoItem
                icon={ClipboardList}
                label="Plan de Tratamiento"
                value={viewingActividad.planTratamiento?.nombreTratamiento || 'Sin plan asignado'}
                color="violet"
              />
              
              <InfoItem
                icon={FileText}
                label="Nombre de la Actividad"
                value={viewingActividad.nombreActividad}
                color="blue"
              />

              {viewingActividad.descripcion && (
                <InfoItem
                  icon={FileText}
                  label="Descripción"
                  value={viewingActividad.descripcion}
                  color="gray"
                />
              )}
            </Stack>
          </Paper>

          {/* Estado y Fechas */}
          <Paper p="md" radius="md" withBorder>
            <Stack gap="md">
              <Group gap="md" grow>
                <div>
                  <Text size="xs" c="dimmed" fw={500} tt="uppercase" mb={8}>
                    Estado
                  </Text>
                  <Badge 
                    size="lg" 
                    color={estadoColors[viewingActividad.estado]} 
                    variant="light"
                    radius="md"
                    fullWidth
                  >
                    {viewingActividad.estado.replace('_', ' ')}
                  </Badge>
                </div>

                {viewingActividad.recordatorioEnviado !== undefined && (
                  <div>
                    <Text size="xs" c="dimmed" fw={500} tt="uppercase" mb={8}>
                      Recordatorio
                    </Text>
                    <Badge 
                      size="lg"
                      color={viewingActividad.recordatorioEnviado ? 'green' : 'gray'}
                      variant="light"
                      radius="md"
                      fullWidth
                      leftSection={<Bell size={14} />}
                    >
                      {viewingActividad.recordatorioEnviado ? 'Enviado' : 'No enviado'}
                    </Badge>
                  </div>
                )}
              </Group>

              <Divider />

              <InfoItem
                icon={Calendar}
                label="Fecha Programada"
                value={formatDate(viewingActividad.fechaProgramada)}
                color="orange"
              />

              {viewingActividad.fechaEjecutada && (
                <InfoItem
                  icon={CheckCircle}
                  label="Fecha Ejecutada"
                  value={formatDate(viewingActividad.fechaEjecutada)}
                  color="green"
                />
              )}

              {viewingActividad.fechaCreacion && (
                <InfoItem
                  icon={Clock}
                  label="Fecha de Creación"
                  value={formatDate(viewingActividad.fechaCreacion)}
                  color="gray"
                />
              )}
            </Stack>
          </Paper>

          {/* Resultados y Detalles Adicionales */}
          {(viewingActividad.resultadoActividad || viewingActividad.costoReal || viewingActividad.responsable) && (
            <Paper p="md" radius="md" withBorder>
              <Stack gap="md">
                {viewingActividad.resultadoActividad && (
                  <InfoItem
                    icon={FileText}
                    label="Resultado"
                    value={viewingActividad.resultadoActividad}
                    color="teal"
                  />
                )}

                {viewingActividad.costoReal && (
                  <InfoItem
                    icon={DollarSign}
                    label="Costo Real"
                    value={`$${viewingActividad.costoReal.toLocaleString()}`}
                    color="green"
                  />
                )}

                {viewingActividad.responsable && (
                  <InfoItem
                    icon={User}
                    label="Responsable"
                    value={viewingActividad.responsable}
                    color="indigo"
                  />
                )}
              </Stack>
            </Paper>
          )}
        </Stack>
      )}
    </Modal>

    {/* Modal Generico de Eliminación */}
    <DeleteConfirmModal
      opened={deleteOpened}
      onClose={() => setDeleteOpened(false)}
      onConfirm={confirmarEliminacion}
      itemName={registroAEliminar?.nombreActividad || ''}
      itemType="registro"
    />

    </Box>
  );
};