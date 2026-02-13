import { useEffect, useState } from 'react';
import {
  Container,
  Title,
  Text,
  Badge,
  Group,
  Stack,
  Loader,
  Center,
  Paper,
  ActionIcon,
  Table,
  Button,
  Tooltip,
  Modal,
  Divider,
  NumberFormatter,
} from '@mantine/core';
import {
  IconRefresh,
  IconFileText,
  IconEye,
  IconCalendar,
  IconCurrencyDollar,
} from '@tabler/icons-react';
import { usePlanesTratamiento } from '../UI_ANALISIS_IMAGEN/hooks/useAgricultura';
import { PlanTratamiento } from '../../types/model';
import { EstadoActividad } from '../../enums/Enums';


export function PlanTratamientoListAdmin() {
  const { 
    loading, 
    listaPlanes, 
    obtenerTodosPlanes
  } = usePlanesTratamiento();

  const [modalDetalle, setModalDetalle] = useState(false);
  const [planSeleccionado, setPlanSeleccionado] = useState<PlanTratamiento | null>(null);

  useEffect(() => {
    obtenerTodosPlanes();
  }, []);

  const handleRefresh = () => {
    obtenerTodosPlanes();
  };

  const handleVerDetalle = (plan: PlanTratamiento) => {
    setPlanSeleccionado(plan);
    setModalDetalle(true);
  };

  const getEstadoColor = (estado: string) => {
    const est = estado?.toUpperCase() || '';
    switch (est) {
      case 'COMPLETADO':
        return 'green';
      case 'EN_PROCESO':
        return 'blue';
      case 'CANCELADO':
        return 'red';
      case 'PENDIENTE':
        return 'yellow';
      default:
        return 'gray';
    }
  };

  const getPrioridadColor = (prioridad: string) => {
    const pri = prioridad?.toUpperCase() || '';
    switch (pri) {
      case 'ALTA':
        return 'red';
      case 'MEDIA':
        return 'orange';
      case 'BAJA':
        return 'blue';
      default:
        return 'gray';
    }
  };

  const formatearFecha = (fecha?: string) => {
    if (!fecha) return 'Sin fecha';
    return new Date(fecha).toLocaleDateString('es-ES', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    });
  };

  if (loading && (!listaPlanes || listaPlanes.length === 0)) {
    return (
      <Center h="100vh">
        <Stack align="center" gap="md">
          <Loader size="xl" />
          <Text c="dimmed">Cargando planes de tratamiento...</Text>
        </Stack>
      </Center>
    );
  }

  const rows = listaPlanes?.map((plan: PlanTratamiento) => (
    <Table.Tr key={plan.id}>     
      
      <Table.Td>
        <Text size="sm">{plan.nombreTratamiento || 'N/A'}</Text>
      </Table.Td>
      
      <Table.Td>
        <Badge
          color={getEstadoColor(plan.estado)}
          variant="dot"
        >
          {plan.estado}
        </Badge>
      </Table.Td>
      
      <Table.Td>
        <Badge
          color={getPrioridadColor(plan.prioridad)}
          variant="light"
        >
          {plan.prioridad}
        </Badge>
      </Table.Td>
      
      <Table.Td>
        {plan.costoEstimado ? (
          <Group gap="xs">
            <IconCurrencyDollar size={16} />
            <NumberFormatter 
              value={plan.costoEstimado} 
              thousandSeparator="," 
              decimalScale={2}
              prefix="$"
            />
          </Group>
        ) : (
          <Text size="sm" c="dimmed">-</Text>
        )}
      </Table.Td>
      
      <Table.Td>
        {plan.duracionDias ? (
          <Text size="sm">{plan.duracionDias} días</Text>
        ) : (
          <Text size="sm" c="dimmed">-</Text>
        )}
      </Table.Td>
      
      <Table.Td>
        <Text size="sm">{formatearFecha(plan.fechaInicioSugerida)}</Text>
      </Table.Td>
      
      <Table.Td>
        <Text size="sm">{formatearFecha(plan.fechaCreacion)}</Text>
      </Table.Td>

      <Table.Td>
        <Tooltip label="Ver detalle completo">
          <Button
            size="xs"
            variant="light"
            color="blue"
            leftSection={<IconEye size={16} />}
            onClick={() => handleVerDetalle(plan)}
          >
            Ver Detalle
          </Button>
        </Tooltip>
      </Table.Td>
    </Table.Tr>
  ));

  return (
    <>
      <Container size="xl" py="xl">
        <Stack gap="xl">
          {/* Header */}
          <Group justify="space-between">
            <div>
              <Title order={1}>Planes de Tratamiento</Title>
              <Text c="dimmed" size="sm">
                Gestiona todos los planes de tratamiento generados
              </Text>
            </div>
            <ActionIcon
              size="lg"
              variant="light"
              onClick={handleRefresh}
              loading={loading}
            >
              <IconRefresh size={20} />
            </ActionIcon>
          </Group>

          {/* Contador de resultados */}
          <Group justify="space-between">
            <Text size="sm" c="dimmed">
              {listaPlanes?.length || 0} {listaPlanes?.length === 1 ? 'plan' : 'planes'}
            </Text>
          </Group>

          {/* Tabla de planes */}
          {!listaPlanes || listaPlanes.length === 0 ? (
            <Paper shadow="xs" p="xl" radius="md">
              <Center>
                <Stack align="center" gap="md">
                  <IconFileText size={48} stroke={1.5} style={{ color: 'gray' }} />
                  <Text c="dimmed">No se encontraron planes de tratamiento</Text>
                </Stack>
              </Center>
            </Paper>
          ) : (
            <Paper shadow="xs" radius="md" withBorder>
              <Table.ScrollContainer minWidth={900}>
                <Table verticalSpacing="md" highlightOnHover>
                  <Table.Thead>
                    <Table.Tr>
                      
                      <Table.Th>Tratamiento</Table.Th>
                      <Table.Th>Estado</Table.Th>
                      <Table.Th>Prioridad</Table.Th>
                      <Table.Th>Costo Estimado</Table.Th>
                      <Table.Th>Duración</Table.Th>
                      <Table.Th>Inicio Sugerido</Table.Th>
                      <Table.Th>Fecha Creación</Table.Th>
                      <Table.Th>Acciones</Table.Th>
                    </Table.Tr>
                  </Table.Thead>
                  <Table.Tbody>{rows}</Table.Tbody>
                </Table>
              </Table.ScrollContainer>
            </Paper>
          )}
        </Stack>
      </Container>

      {/* Modal de Detalle */}
      <Modal
        opened={modalDetalle}
        onClose={() => setModalDetalle(false)}
        title={"Detalle del Plan de Tratamiento"}
        size="xl"
      >
        {planSeleccionado && (
          <Stack gap="md">
            <Group justify="space-between">
              <Group gap="xs">
                <Badge color={getEstadoColor(planSeleccionado.estado)}>
                  {planSeleccionado.estado}
                </Badge>
                <Badge color={getPrioridadColor(planSeleccionado.prioridad)}>
                  {planSeleccionado.prioridad}
                </Badge>
              </Group>
            </Group>

            <Divider />

            <Group grow>
              <Paper p="md" withBorder>
                <Stack gap="xs">
                  <Group gap="xs">
                    <IconCurrencyDollar size={16} />
                    <Text size="sm" c="dimmed">Costo Estimado</Text>
                  </Group>
                  <Text fw={500}>
                    <NumberFormatter 
                      value={planSeleccionado.costoEstimado || 0} 
                      thousandSeparator="," 
                      decimalScale={2}
                      prefix="$"
                    />
                  </Text>
                </Stack>
              </Paper>

              <Paper p="md" withBorder>
                <Stack gap="xs">
                  <Group gap="xs">
                    <IconCalendar size={16} />
                    <Text size="sm" c="dimmed">Duración</Text>
                  </Group>
                  <Text fw={500}>{planSeleccionado.duracionDias || 0} días</Text>
                </Stack>
              </Paper>
            </Group>

            <Paper p="md" withBorder>
              <Stack gap="xs">
                <Text size="sm" fw={500}>Fecha Inicio Sugerida</Text>
                <Text>{formatearFecha(planSeleccionado.fechaInicioSugerida)}</Text>
              </Stack>
            </Paper>

            <Paper p="md" withBorder>
              <Stack gap="xs">
                <Text size="sm" fw={500}>Instrucciones Detalladas</Text>
                <Text 
                  size="sm" 
                  style={{ whiteSpace: 'pre-wrap' }}
                >
                  {planSeleccionado.instruccionesDetalladas || 'No hay instrucciones disponibles'}
                </Text>
              </Stack>
            </Paper>

            {planSeleccionado.actividadesSeguimiento && 
             planSeleccionado.actividadesSeguimiento.length > 0 && (
              <Paper p="md" withBorder>
                <Stack gap="md">
                  <Group justify="space-between">
                    <Text size="sm" fw={500}>Actividades de Seguimiento</Text>
                    <Badge variant="light" size="sm">
                      {planSeleccionado.actividadesSeguimiento.length} actividades
                    </Badge>
                  </Group>
                  
                  <Stack gap="sm">
                    {planSeleccionado.actividadesSeguimiento.map((actividad, index) => (
                      <Paper key={actividad.id} p="sm" withBorder bg="gray.0">
                        <Stack gap="xs">
                          <Group justify="space-between">
                            <Group gap="xs">
                              <Text size="sm" fw={500}>Actividad #{index + 1}</Text>
                              <Badge 
                                size="sm"
                                color={actividad.estado === EstadoActividad.PENDIENTE ? 'yellow' : 
                                       actividad.estado === EstadoActividad.EJECUTADA ? 'green' : 'gray'}
                                variant="dot"
                              >
                                {actividad.estado}
                              </Badge>
                            </Group>
                            <Group gap="xs">
                              <IconCalendar size={14} />
                              <Text size="xs" c="dimmed">
                                {formatearFecha(actividad.fechaProgramada)}
                              </Text>
                            </Group>
                          </Group>
                          
                          <Text size="sm" style={{ whiteSpace: 'pre-wrap' }}>
                            {actividad.descripcion}
                          </Text>
                          
                          {actividad.responsable && (
                            <Text size="xs" c="dimmed">
                              Responsable: {actividad.responsable}
                            </Text>
                          )}
                          
                          {actividad.fechaEjecutada && (
                            <Group gap="xs">
                              <Text size="xs" c="dimmed">
                                Ejecutada: {formatearFecha(actividad.fechaEjecutada)}
                              </Text>
                            </Group>
                          )}
                          
                          {actividad.costoReal && (
                            <Group gap="xs">
                              <IconCurrencyDollar size={14} />
                              <Text size="xs" fw={500}>
                                <NumberFormatter 
                                  value={actividad.costoReal} 
                                  thousandSeparator="," 
                                  decimalScale={2}
                                  prefix="$"
                                />
                              </Text>
                            </Group>
                          )}
                        </Stack>
                      </Paper>
                    ))}
                  </Stack>
                </Stack>
              </Paper>
            )}
          </Stack>
        )}
      </Modal>
    </>
  );
}