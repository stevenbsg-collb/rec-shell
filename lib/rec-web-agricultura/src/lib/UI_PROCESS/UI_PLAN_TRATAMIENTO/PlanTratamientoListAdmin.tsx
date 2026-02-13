import { useEffect, useState } from 'react';
import { useMediaQuery } from '@mantine/hooks';
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
  ScrollArea,
} from '@mantine/core';
import {
  IconRefresh,
  IconFileText,
  IconEye,
  IconCalendar,
  IconCurrencyDollar,
  IconPlant,
  IconSun,
} from '@tabler/icons-react';
import { usePlanesTratamiento } from '../UI_ANALISIS_IMAGEN/hooks/useAgricultura';
import { PaginationControls, usePagination } from '@rec-shell/rec-web-shared';
import { PlanTratamientoNuevo } from '../../types/dto';

export function PlanTratamientoListAdmin() {
  const { loading, listaPlanes, obtenerTodosPlanes } = usePlanesTratamiento();

  const [modalDetalle, setModalDetalle] = useState(false);
  const isMobile = useMediaQuery('(max-width: 48em)');
  const [planSeleccionado, setPlanSeleccionado] = useState<PlanTratamientoNuevo | null>(null);

  // ✅ Mantener la última lista válida para que, durante loading, NO se borre la tabla
  const [cachedPlanes, setCachedPlanes] = useState<PlanTratamientoNuevo[]>([]);

  // ✅ Loading SOLO para el botón refresh (no para toda la vista)
  const [isRefreshing, setIsRefreshing] = useState(false);

  useEffect(() => {
    obtenerTodosPlanes();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ✅ Actualizar cache SOLO cuando termina la carga (loading = false)
  useEffect(() => {
    if (!loading && Array.isArray(listaPlanes)) {
      setCachedPlanes(listaPlanes);
    }
  }, [loading, listaPlanes]);

  const handleRefresh = async () => {
    if (isRefreshing) return;
    setIsRefreshing(true);
    try {
      await Promise.resolve(obtenerTodosPlanes());
    } finally {
      setIsRefreshing(false);
    }
  };

  const handleVerDetalle = (plan: PlanTratamientoNuevo) => {
    setPlanSeleccionado(plan);
    setModalDetalle(true);
  };

  // Función para determinar el tipo de tratamiento (basado en el nombre)
  const getTipoColor = (tratamiento: string) => {
    const trat = tratamiento?.toLowerCase() || '';
    if (trat.includes('urea') || trat.includes('nitrato') || trat.includes('nitrógeno')) return 'blue';
    if (trat.includes('fosforo') || trat.includes('fósforo') || trat.includes('p2o5')) return 'orange';
    if (trat.includes('potasio') || trat.includes('k2o')) return 'green';
    if (trat.includes('foliar')) return 'cyan';
    if (trat.includes('suelo')) return 'brown';
    return 'gray';
  };

  const formatearFecha = (fecha?: string) => {
    if (!fecha) return 'Sin fecha';
    return new Date(fecha).toLocaleDateString('es-ES', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  // ✅ Lista efectiva: si durante loading el hook deja lista vacía, mostramos el cache
  const lista = Array.isArray(listaPlanes) && listaPlanes.length > 0 ? listaPlanes : cachedPlanes;

  // ✅ Bloqueo de UI mientras loading
  const uiLocked = loading;

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
    searchFields: ['planTratamiento', 'fechaCreacion'],
  });

  // ✅ Loader full-screen SOLO en la primera carga (cuando no hay cache todavía)
  if (loading && lista.length === 0) {
    return (
      <Center h="100vh">
        <Stack align="center" gap="md">
          <Loader size="xl" />
          <Text c="dimmed">Cargando planes de tratamiento...</Text>
        </Stack>
      </Center>
    );
  }

  const rows = (paginatedData as unknown as PlanTratamientoNuevo[])?.map((plan: PlanTratamientoNuevo) => (
    <Table.Tr key={plan.id}>
      <Table.Td>
        <Group gap="xs">
          <IconPlant size={16} />
          <Text size="sm">{plan.planTratamiento?.tratamiento || 'N/A'}</Text>
        </Group>
      </Table.Td>

      <Table.Td>
        <Badge color={getTipoColor(plan.planTratamiento?.tratamiento)} variant="light">
          {plan.planTratamiento?.planAplicacion?.tipo || 'N/A'}
        </Badge>
      </Table.Td>

      <Table.Td className="hide-sm">
        <Group gap="xs">
          <IconCurrencyDollar size={16} />
          <Text size="sm">
            {plan.planTratamiento?.planAplicacion?.volumenPorHectareaEstimado_L ?? 'N/A'} L/ha
          </Text>
        </Group>
      </Table.Td>

      <Table.Td className="hide-sm">
        <Group gap="xs">
          <IconCalendar size={16} />
          <Text size="sm">{plan.planTratamiento?.planAplicacion?.duracionTratamientoDias ?? 'N/A'} días</Text>
        </Group>
      </Table.Td>

      <Table.Td>
        <Text size="sm">{plan.planTratamiento?.planAplicacion?.numeroAplicaciones ?? 'N/A'} aplicaciones</Text>
      </Table.Td>

      <Table.Td>
        <Text size="sm">{formatearFecha(plan.fechaCreacion)}</Text>
      </Table.Td>

      <Table.Td className="hide-sm">
        <Text size="sm">{formatearFecha(plan.fechaActualizacion)}</Text>
      </Table.Td>

      <Table.Td>
        <Tooltip label="Ver detalle completo">
          <Button
            size="xs"
            variant="light"
            color="blue"
            leftSection={<IconEye size={16} />}
            onClick={() => handleVerDetalle(plan)}
            disabled={uiLocked}
          >
            Detalles
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
          <Group justify="space-between" style={{ flexWrap: 'wrap', gap: 12 }}>
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
              loading={isRefreshing}
              disabled={uiLocked || isRefreshing}
            >
              <IconRefresh size={20} />
            </ActionIcon>
          </Group>

          {/* Contador de resultados */}
          <Group justify="space-between">
            <Text size="sm" c="dimmed">
              {lista?.length || 0} {lista?.length === 1 ? 'plan' : 'planes'}
            </Text>
          </Group>

          {/* Tabla de planes */}
          {lista.length === 0 ? (
            <Paper shadow="xs" p="xl" radius="md">
              <Center>
                <Stack align="center" gap="md">
                  <IconFileText size={48} stroke={1.5} style={{ color: 'gray' }} />
                  <Text c="dimmed">No se encontraron planes de tratamiento</Text>
                </Stack>
              </Center>
            </Paper>
          ) : (
            <Paper withBorder radius="md">
              {/* ✅ Scroll SOLO para la tabla */}
              <ScrollArea type="auto" offsetScrollbars>
                <Table verticalSpacing="md" highlightOnHover style={{ minWidth: 980 }}>
                  <Table.Thead>
                    <Table.Tr>
                      <Table.Th>Tratamiento</Table.Th>
                      <Table.Th>Tipo</Table.Th>
                      <Table.Th className="hide-sm">Volumen (L/ha)</Table.Th>
                      <Table.Th className="hide-sm">Duración</Table.Th>
                      <Table.Th>Aplicaciones</Table.Th>
                      <Table.Th>Fecha Creación</Table.Th>
                      <Table.Th className="hide-sm">Última Actualización</Table.Th>
                      <Table.Th>Acciones</Table.Th>
                    </Table.Tr>
                  </Table.Thead>
                  <Table.Tbody>{rows}</Table.Tbody>
                </Table>
              </ScrollArea>

              {/* ✅ Paginación fuera del scroll */}
              {lista.length > 0 && (
                <div
                  style={{
                    padding: 12,
                    opacity: uiLocked ? 0.6 : 1,
                    pointerEvents: uiLocked ? 'none' : 'auto',
                  }}
                >
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
                    searchPlaceholder="Buscar por deficiencia, confianza o nutriente..."
                  />
                </div>
              )}
            </Paper>
          )}
        </Stack>
      </Container>

      {/* Modal de Detalle */}
      <Modal
        opened={modalDetalle}
        onClose={() => setModalDetalle(false)}
        title="Detalle del Plan de Tratamiento"
        size={isMobile ? '100%' : 'xl'}
        fullScreen={isMobile}
        centered
      >
        {planSeleccionado && (
          <Stack gap="md">
            <Group justify="space-between">
              <Group gap="xs">
                <Badge color={getTipoColor(planSeleccionado.planTratamiento.tratamiento)} variant="filled" size="lg">
                  {planSeleccionado.planTratamiento.tratamiento}
                </Badge>
                <Badge variant="light" size="sm">
                  ID: {planSeleccionado.id}
                </Badge>
                <Badge variant="outline" size="sm">
                  Análisis: {planSeleccionado.analisisId}
                </Badge>
              </Group>
            </Group>

            <Divider />

            {/* Información General */}
            <Paper p="md" withBorder>
              <Stack gap="md">
                <Text size="sm" fw={500} c="blue">
                  Información del Tratamiento
                </Text>
                <Text size="sm">{planSeleccionado.planTratamiento.tratamiento}</Text>
              </Stack>
            </Paper>

            {/* Plan de Aplicación */}
            <Paper p="md" withBorder>
              <Stack gap="md">
                <Group gap="xs">
                  <IconSun size={20} />
                  <Text size="sm" fw={500} c="orange">
                    Plan de Aplicación
                  </Text>
                </Group>

                <Group grow>
                  <Stack gap="xs">
                    <Text size="xs" c="dimmed">
                      Tipo
                    </Text>
                    <Text size="sm" fw={500}>
                      {planSeleccionado.planTratamiento.planAplicacion.tipo}
                    </Text>
                  </Stack>

                  <Stack gap="xs">
                    <Text size="xs" c="dimmed">
                      Dosis por Litro
                    </Text>
                    <Text size="sm" fw={500}>
                      {planSeleccionado.planTratamiento.planAplicacion.dosisPorLitro}
                    </Text>
                  </Stack>

                  <Stack gap="xs">
                    <Text size="xs" c="dimmed">
                      Dosis por Hectárea
                    </Text>
                    <Text size="sm" fw={500}>
                      {planSeleccionado.planTratamiento.planAplicacion.dosisPorHectareaEstimada}
                    </Text>
                  </Stack>
                </Group>

                <Group grow>
                  <Stack gap="xs">
                    <Text size="xs" c="dimmed">
                      Volumen Estimado
                    </Text>
                    <Text size="sm" fw={500}>
                      {planSeleccionado.planTratamiento.planAplicacion.volumenPorHectareaEstimado_L} L/ha
                    </Text>
                  </Stack>

                  <Stack gap="xs">
                    <Text size="xs" c="dimmed">
                      Frecuencia
                    </Text>
                    <Text size="sm" fw={500}>
                      Cada {planSeleccionado.planTratamiento.planAplicacion.frecuenciaDias} días
                    </Text>
                  </Stack>

                  <Stack gap="xs">
                    <Text size="xs" c="dimmed">
                      Total Aplicaciones
                    </Text>
                    <Text size="sm" fw={500}>
                      {planSeleccionado.planTratamiento.planAplicacion.numeroAplicaciones}
                    </Text>
                  </Stack>
                </Group>

                <Group grow>
                  <Stack gap="xs">
                    <Text size="xs" c="dimmed">
                      Duración Total
                    </Text>
                    <Text size="sm" fw={500}>
                      {planSeleccionado.planTratamiento.planAplicacion.duracionTratamientoDias} días
                    </Text>
                  </Stack>

                  <Stack gap="xs">
                    <Text size="xs" c="dimmed">
                      Hora Recomendada
                    </Text>
                    <Text size="sm" fw={500}>
                      {planSeleccionado.planTratamiento.planAplicacion.horaRecomendada}
                    </Text>
                  </Stack>
                </Group>

                <Stack gap="xs">
                  <Text size="xs" c="dimmed">
                    Precauciones
                  </Text>
                  <Text size="sm" style={{ whiteSpace: 'pre-wrap' }}>
                    {planSeleccionado.planTratamiento.planAplicacion.precauciones}
                  </Text>
                </Stack>
              </Stack>
            </Paper>

            {/* Tratamiento de Suelo */}
            <Paper p="md" withBorder>
              <Stack gap="md">
                <Group gap="xs">
                  <Text size="sm" fw={500} c="brown">
                    Tratamiento de Suelo
                  </Text>
                </Group>

                <Stack gap="xs">
                  <Text size="xs" c="dimmed">
                    Acción
                  </Text>
                  <Text size="sm" style={{ whiteSpace: 'pre-wrap' }}>
                    {planSeleccionado.planTratamiento.tratamientoSuelo.accion}
                  </Text>
                </Stack>

                <Group grow>
                  <Stack gap="xs">
                    <Text size="xs" c="dimmed">
                      Producto Sugerido
                    </Text>
                    <Text size="sm" fw={500}>
                      {planSeleccionado.planTratamiento.tratamientoSuelo.productoSugerido}
                    </Text>
                  </Stack>

                  <Stack gap="xs">
                    <Text size="xs" c="dimmed">
                      Dosis Orientativa
                    </Text>
                    <Text size="sm" fw={500}>
                      {planSeleccionado.planTratamiento.tratamientoSuelo.dosisOrientativa}
                    </Text>
                  </Stack>
                </Group>

                <Stack gap="xs">
                  <Text size="xs" c="dimmed">
                    Método de Aplicación
                  </Text>
                  <Text size="sm" style={{ whiteSpace: 'pre-wrap' }}>
                    {planSeleccionado.planTratamiento.tratamientoSuelo.metodo}
                  </Text>
                </Stack>
              </Stack>
            </Paper>

            {/* Seguimiento */}
            <Paper p="md" withBorder>
              <Stack gap="md">
                <Text size="sm" fw={500} c="green">
                  Seguimiento y Monitoreo
                </Text>

                <Stack gap="xs">
                  <Text size="xs" c="dimmed">
                    Observable de Mejora
                  </Text>
                  <Text size="sm" style={{ whiteSpace: 'pre-wrap' }}>
                    {planSeleccionado.planTratamiento.seguimiento.observableMejora}
                  </Text>
                </Stack>

                <Stack gap="xs">
                  <Text size="xs" c="dimmed">
                    Notas Técnicas
                  </Text>
                  <Text size="sm" style={{ whiteSpace: 'pre-wrap' }}>
                    {planSeleccionado.planTratamiento.seguimiento.notasTecnico}
                  </Text>
                </Stack>

                {planSeleccionado.planTratamiento.seguimiento.imagenesSeguimiento.length > 0 && (
                  <Stack gap="xs">
                    <Text size="xs" c="dimmed">
                      Imágenes de Seguimiento
                    </Text>
                    <Group gap="xs">
                      {planSeleccionado.planTratamiento.seguimiento.imagenesSeguimiento.map((img, index) => (
                        <Badge key={index} variant="outline" size="sm">
                          Imagen {index + 1}
                        </Badge>
                      ))}
                    </Group>
                  </Stack>
                )}
              </Stack>
            </Paper>

            {/* Fechas */}
            <Group grow>
              <Paper p="md" withBorder>
                <Stack gap="xs">
                  <Text size="xs" c="dimmed">
                    Fecha de Creación
                  </Text>
                  <Text size="sm" fw={500}>
                    {formatearFecha(planSeleccionado.fechaCreacion)}
                  </Text>
                </Stack>
              </Paper>

              <Paper p="md" withBorder>
                <Stack gap="xs">
                  <Text size="xs" c="dimmed">
                    Última Actualización
                  </Text>
                  <Text size="sm" fw={500}>
                    {formatearFecha(planSeleccionado.fechaActualizacion)}
                  </Text>
                </Stack>
              </Paper>
            </Group>
          </Stack>
        )}
      </Modal>
    </>
  );
}
