import React, { useState, useEffect, useMemo } from 'react';
import {
  Container,
  Title,
  Button,
  Modal,
  TextInput,
  NumberInput,
  Select,
  Group,
  Stack,
  Badge,
  Card,
  Grid,
  LoadingOverlay,
  Alert,
  Flex,
  Text,
  Box,
  Divider,
} from '@mantine/core';
import { useForm } from '@mantine/form';
import {
  IconEdit,
  IconTrash,
  IconEye,
  IconAlertCircle,
} from '@tabler/icons-react';
import { ParametroMonitoreo } from '../../types/model';
import {
  useParametrosMonitoreo,
  useParametrosMonitoreoCRUD,
} from '../hooks/useAgricultura';
import {
  ActionButtons,
  DeleteConfirmModal,
  NOTIFICATION_MESSAGES,
  PaginatedTable,
  useNotifications,
} from '@rec-shell/rec-web-shared';
import { useCultivos } from '../../UI_CULTIVO/hooks/useAgricultura';

const ParametroModal: React.FC<{
  opened: boolean;
  onClose: () => void;
  parametro?: ParametroMonitoreo;
  onSubmit: (data: any) => void;
  loading: boolean;
}> = ({ opened, onClose, parametro, onSubmit, loading }) => {
  const form = useForm({
    initialValues: {
      cultivoId: '',
      fechaMedicion: new Date().toISOString().split('T')[0],
      humedadSuelo: 0,
      humedadAmbiente: 0,
      temperatura: 0,
      phSuelo: 0,
      precipitacionMm: 0,
      horasSol: 0,
      velocidadVientoKmh: 0,
      fuenteDatos: '',
      coordenadasGps: '',
    },
    validate: {
      cultivoId: (value) => (value ? null : 'Cultivo es requerido'),
      fuenteDatos: (value) => (value ? null : 'Fuente de datos es requerida'),
      temperatura: (value) => {
        if (typeof value === 'number' && (value < -50 || value > 60)) {
          return 'Temperatura debe estar entre -50°C y 60°C';
        }
        return null;
      },
      humedadSuelo: (value) => {
        if (typeof value === 'number' && (value < 0 || value > 100)) {
          return 'Humedad debe estar entre 0% y 100%';
        }
        return null;
      },
      humedadAmbiente: (value) => {
        if (typeof value === 'number' && (value < 0 || value > 100)) {
          return 'Humedad debe estar entre 0% y 100%';
        }
        return null;
      },
      phSuelo: (value) => {
        if (typeof value === 'number' && (value < 0 || value > 14)) {
          return 'pH debe estar entre 0 y 14';
        }
        return null;
      },
    },
  });

  useEffect(() => {
    if (opened) {
      if (parametro) {
        form.setValues({
          cultivoId: parametro.cultivoId ? parametro.cultivoId.toString() : '',
          fechaMedicion: parametro.fechaMedicion
            ? parametro.fechaMedicion.split('T')[0]
            : new Date().toISOString().split('T')[0],
          humedadSuelo: parametro.humedadSuelo,
          humedadAmbiente: parametro.humedadAmbiente,
          temperatura: parametro.temperatura,
          phSuelo: parametro.phSuelo,
          precipitacionMm: parametro.precipitacionMm,
          horasSol: parametro.horasSol,
          velocidadVientoKmh: parametro.velocidadVientoKmh,
          fuenteDatos: parametro.fuenteDatos || '',
          coordenadasGps: parametro.coordenadasGps || '',
        });
      } else {
        form.reset();
      }
    }
  }, [opened, parametro?.id]);

  const handleSubmit = (values: any) => {
    const formData = {
      ...values,
      cultivo: { id: values.cultivoId },
    };
    console.log(formData);
    onSubmit(formData);
  };

  const fuentesOptions = useMemo(
    () => [
      { value: 'Sensor Automático', label: 'Sensor Automático' },
      { value: 'Medición Manual', label: 'Medición Manual' },
      { value: 'Estación Meteorológica', label: 'Estación Meteorológica' },
      { value: 'Satelital', label: 'Satelital' },
    ],
    []
  );

  //Ref 1 Consumir hook para combo v1
  const { cultivos, LISTAR } = useCultivos();
  useEffect(() => {
    LISTAR();
  }, []);
  const listCultivos = cultivos.map((cultivo) => ({
    value: cultivo.id.toString(),
    label: `${cultivo.nombreCultivo} - ${cultivo.variedadCacao}`,
  }));
  //Ref 1 Consumir hook para combo v1

  return (
    <Modal
      opened={opened}
      onClose={onClose}
      title={parametro ? 'Editar Registro' : 'Nuevo Registro'}
      size="lg"
      centered
    >
      <LoadingOverlay visible={loading} />
      <Box component="form">
        <Stack gap="md">
          {/* Información General */}
          <div>
            <Text size="sm" fw={600} mb="xs" c="dimmed">
              Información General
            </Text>
            <Grid>
              <Grid.Col span={6}>
                <Select
                  label="Cultivo"
                  placeholder="Seleccione un cultivo"
                  data={listCultivos}
                  {...form.getInputProps('cultivoId')}
                  required
                  searchable
                />
              </Grid.Col>
              <Grid.Col span={6}>
                <TextInput
                  label="Fecha de Medición"
                  type="date"
                  {...form.getInputProps('fechaMedicion')}
                  required
                />
              </Grid.Col>
              <Grid.Col span={6}>
                <Select
                  label="Fuente de Datos"
                  placeholder="Seleccionar fuente"
                  data={fuentesOptions}
                  required
                  {...form.getInputProps('fuenteDatos')}
                />
              </Grid.Col>
              <Grid.Col span={6}>
                <TextInput
                  label="Coordenadas GPS"
                  placeholder="lat,lng (ej: -2.1894,-79.8965)"
                  {...form.getInputProps('coordenadasGps')}
                />
              </Grid.Col>
            </Grid>
          </div>

          <Divider />

          {/* Condiciones del Suelo */}
          <div>
            <Text size="sm" fw={600} mb="xs" c="dimmed">
              Condiciones del Suelo
            </Text>
            <Grid>
              <Grid.Col span={6}>
                <NumberInput
                  label="Humedad del Suelo (%)"
                  placeholder="0-100"
                  min={0}
                  max={100}
                  decimalScale={1}
                  {...form.getInputProps('humedadSuelo')}
                />
              </Grid.Col>
              <Grid.Col span={6}>
                <NumberInput
                  label="pH del Suelo"
                  placeholder="0-14"
                  min={0}
                  max={14}
                  decimalScale={1}
                  {...form.getInputProps('phSuelo')}
                />
              </Grid.Col>
            </Grid>
          </div>

          <Divider />

          {/* Condiciones Ambientales */}
          <div>
            <Text size="sm" fw={600} mb="xs" c="dimmed">
              Condiciones Ambientales
            </Text>
            <Grid>
              <Grid.Col span={6}>
                <NumberInput
                  label="Temperatura (°C)"
                  placeholder="-50 a 60"
                  min={-50}
                  max={60}
                  decimalScale={1}
                  {...form.getInputProps('temperatura')}
                />
              </Grid.Col>
              <Grid.Col span={6}>
                <NumberInput
                  label="Humedad Ambiente (%)"
                  placeholder="0-100"
                  min={0}
                  max={100}
                  decimalScale={1}
                  {...form.getInputProps('humedadAmbiente')}
                />
              </Grid.Col>
              <Grid.Col span={4}>
                <NumberInput
                  label="Precipitación (mm)"
                  placeholder="0+"
                  min={0}
                  decimalScale={1}
                  {...form.getInputProps('precipitacionMm')}
                />
              </Grid.Col>
              <Grid.Col span={4}>
                <NumberInput
                  label="Horas de Sol"
                  placeholder="0-24"
                  min={0}
                  max={24}
                  decimalScale={1}
                  {...form.getInputProps('horasSol')}
                />
              </Grid.Col>
              <Grid.Col span={4}>
                <NumberInput
                  label="Velocidad del Viento (km/h)"
                  placeholder="0+"
                  min={0}
                  decimalScale={1}
                  {...form.getInputProps('velocidadVientoKmh')}
                />
              </Grid.Col>
            </Grid>
          </div>

          <Group justify="center" mt="md">
            <ActionButtons.Cancel onClick={onClose} loading={loading} />
            <ActionButtons.Save
              onClick={() => form.onSubmit(handleSubmit)()}
              loading={loading}
            />
          </Group>
        </Stack>
      </Box>
    </Modal>
  );
};

const DetalleParametroModal: React.FC<{
  opened: boolean;
  onClose: () => void;
  parametro?: ParametroMonitoreo;
}> = ({ opened, onClose, parametro }) => {
  if (!parametro) return null;

  const formatValue = (value: number | undefined, unit: string) => {
    return value !== undefined ? `${value} ${unit}` : 'No registrado';
  };

  const MetricCard: React.FC<{
    label: string;
    value: string;
    icon?: React.ReactNode;
  }> = ({ label, value, icon }) => (
    <Box
      p="md"
      style={{
        background:
          'linear-gradient(135deg, rgba(34, 139, 230, 0.05) 0%, rgba(139, 92, 246, 0.05) 100%)',
        borderRadius: '12px',
        border: '1px solid rgba(34, 139, 230, 0.1)',
        transition: 'all 0.3s ease',
      }}
    >
      <Flex direction="column" gap={4}>
        <Text
          size="xs"
          c="dimmed"
          tt="uppercase"
          fw={600}
          style={{ letterSpacing: '0.5px' }}
        >
          {label}
        </Text>
        <Flex align="center" gap="xs">
          {icon}
          <Text size="lg" fw={700} style={{ color: '#228be6' }}>
            {value}
          </Text>
        </Flex>
      </Flex>
    </Box>
  );

  return (
    <Modal
      opened={opened}
      onClose={onClose}
      title={'Detalle del Parámetro'}
      size="lg"
      centered
    >
      <Stack gap="lg" pt="md">
        {/* Información General */}
        <Box>
          <Text
            size="sm"
            fw={700}
            mb="md"
            c="dimmed"
            tt="uppercase"
            style={{ letterSpacing: '0.5px' }}
          >
            Información General
          </Text>
          <Card
            withBorder
            p="lg"
            style={{
              background:
                'linear-gradient(135deg, rgba(34, 139, 230, 0.02) 0%, rgba(139, 92, 246, 0.02) 100%)',
              borderColor: 'rgba(34, 139, 230, 0.15)',
              borderRadius: '12px',
            }}
          >
            <Grid gutter="md">
              <Grid.Col span={6}>
                <Stack gap={4}>
                  <Text size="xs" c="dimmed" fw={600}>
                    Cultivo
                  </Text>
                  <Text fw={600} size="md">
                    {parametro.nombreCultivo}
                  </Text>
                </Stack>
              </Grid.Col>
              <Grid.Col span={6}>
                <Stack gap={4}>
                  <Text size="xs" c="dimmed" fw={600}>
                    Ubicación
                  </Text>
                  <Text fw={600} size="md">
                    {parametro.ubicacionNombre}
                  </Text>
                </Stack>
              </Grid.Col>
              <Grid.Col span={6}>
                <Stack gap={4}>
                  <Text size="xs" c="dimmed" fw={600}>
                    Fecha de Medición
                  </Text>
                  <Text fw={600} size="md">
                    {parametro.fechaMedicion}
                  </Text>
                </Stack>
              </Grid.Col>
              <Grid.Col span={6}>
                <Stack gap={4}>
                  <Text size="xs" c="dimmed" fw={600}>
                    Fuente de Datos
                  </Text>
                  <Badge
                    variant="gradient"
                    gradient={{ from: 'blue', to: 'violet' }}
                    size="lg"
                  >
                    {parametro.fuenteDatos}
                  </Badge>
                </Stack>
              </Grid.Col>
            </Grid>
          </Card>
        </Box>

        {/* Mediciones Ambientales */}
        <Box>
          <Text
            size="sm"
            fw={700}
            mb="md"
            c="dimmed"
            tt="uppercase"
            style={{ letterSpacing: '0.5px' }}
          >
            Mediciones Ambientales
          </Text>
          <Grid gutter="md">
            <Grid.Col span={6}>
              <MetricCard
                label="Temperatura"
                value={formatValue(parametro.temperatura, '°C')}
              />
            </Grid.Col>
            <Grid.Col span={6}>
              <MetricCard
                label="Humedad Ambiente"
                value={formatValue(parametro.humedadAmbiente, '%')}
              />
            </Grid.Col>
            <Grid.Col span={4}>
              <MetricCard
                label="Precipitación"
                value={formatValue(parametro.precipitacionMm, 'mm')}
              />
            </Grid.Col>
            <Grid.Col span={4}>
              <MetricCard
                label="Horas de Sol"
                value={formatValue(parametro.horasSol, 'h')}
              />
            </Grid.Col>
            <Grid.Col span={4}>
              <MetricCard
                label="Velocidad Viento"
                value={formatValue(parametro.velocidadVientoKmh, 'km/h')}
              />
            </Grid.Col>
          </Grid>
        </Box>

        {/* Mediciones del Suelo */}
        <Box>
          <Text
            size="sm"
            fw={700}
            mb="md"
            c="dimmed"
            tt="uppercase"
            style={{ letterSpacing: '0.5px' }}
          >
            Mediciones del Suelo
          </Text>
          <Grid gutter="md">
            <Grid.Col span={6}>
              <MetricCard
                label="Humedad del Suelo"
                value={formatValue(parametro.humedadSuelo, '%')}
              />
            </Grid.Col>
            <Grid.Col span={6}>
              <MetricCard
                label="pH del Suelo"
                value={formatValue(parametro.phSuelo, '')}
              />
            </Grid.Col>
          </Grid>
        </Box>

        {/* Coordenadas GPS */}
        {parametro.coordenadasGps && (
          <Box>
            <Text
              size="sm"
              fw={700}
              mb="md"
              c="dimmed"
              tt="uppercase"
              style={{ letterSpacing: '0.5px' }}
            >
              Ubicación GPS
            </Text>
            <Card
              withBorder
              p="md"
              style={{
                background:
                  'linear-gradient(135deg, rgba(34, 139, 230, 0.05) 0%, rgba(139, 92, 246, 0.05) 100%)',
                borderColor: 'rgba(34, 139, 230, 0.15)',
                borderRadius: '12px',
              }}
            >
              <Text fw={600} size="md" style={{ fontFamily: 'monospace' }}>
                {parametro.coordenadasGps}
              </Text>
            </Card>
          </Box>
        )}
      </Stack>
    </Modal>
  );
};

export const MonitoreoAdmin: React.FC = () => {
  const {
    parametros,
    loading: loadingList,
    error,
    refetch,
  } = useParametrosMonitoreo();
  const {
    CREAR,
    ACTUALIZAR,
    ELIMINAR,
    loading: loadingCRUD,
    clearError,
  } = useParametrosMonitoreoCRUD();

  const [modalOpened, setModalOpened] = useState(false);
  const [detalleModalOpened, setDetalleModalOpened] = useState(false);
  const [deleteModalOpened, setDeleteModalOpened] = useState(false);
  const [selectedParametro, setSelectedParametro] = useState<
    ParametroMonitoreo | undefined
  >();
  const [editMode, setEditMode] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  const notifications = useNotifications();

  const handleCreate = () => {
    setSelectedParametro(undefined);
    setEditMode(false);
    clearError();
    setModalOpened(true);
  };

  const handleEdit = (parametro: ParametroMonitoreo) => {
    setSelectedParametro(parametro);
    setEditMode(true);
    clearError();
    setModalOpened(true);
  };

  const handleView = (parametro: ParametroMonitoreo) => {
    setSelectedParametro(parametro);
    setDetalleModalOpened(true);
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    try {
      await refetch();
    } catch (error: unknown) {
      console.error('Error:', error);
    } finally {
      setRefreshing(false);
    }
  };

  const handleDeleteClick = (parametro: ParametroMonitoreo) => {
    setSelectedParametro(parametro);
    setDeleteModalOpened(true);
  };

  const handleDeleteConfirm = async () => {
    if (!selectedParametro) return;

    const success = await ELIMINAR(selectedParametro.id);
    if (success) {
      notifications.success();
      setDeleteModalOpened(false);
      refetch();
    } else {
      notifications.error(
        NOTIFICATION_MESSAGES.GENERAL.ERROR.title,
        'No se pudo eliminar el parámetro'
      );
    }
  };

  const handleSubmit = async (data: any) => {
    try {
      let result;

      if (editMode && selectedParametro) {
        result = await ACTUALIZAR(selectedParametro.id, data);
      } else {
        result = await CREAR(data);
      }

      if (result) {
        notifications.success();
        setModalOpened(false);
        refetch();
      } else {
        notifications.error(
          NOTIFICATION_MESSAGES.GENERAL.SUCCESS.title,
          `No se pudo ${editMode ? 'actualizar' : 'crear'} el parámetro`
        );
      }
    } catch (error) {
      console.error('Error en handleSubmit:', error);
    }
  };

  const handleCloseModal = () => {
    setModalOpened(false);
    clearError();
  };

  //Columnas Dinamica Ini
  const columns = [
    { key: 'nombreCultivo', label: 'Cultivo' },
    { key: 'fechaMedicion', label: 'Fecha' },
    {
      key: 'temperatura',
      label: 'Temperatura',
      render: (p: ParametroMonitoreo) => p.temperatura ? `${p.temperatura}°C` : '-'
    },
    {
      key: 'humedadSuelo',
      label: 'Humedad Suelo',
      render: (p: ParametroMonitoreo) => p.humedadSuelo ? `${p.humedadSuelo}%` : '-'
    },
    {
      key: 'phSuelo',
      label: 'pH',
      render: (p: ParametroMonitoreo) => p.phSuelo ? p.phSuelo : '-'
    },
    {
      key: 'fuenteDatos',
      label: 'Fuente',
      render: (p: ParametroMonitoreo) => (
        <Badge variant="light" size="sm">{p.fuenteDatos}</Badge>
      )
    },
  ];

  const actions = [
    { icon: <IconEye size="1rem" />, label: 'Ver detalle', color: 'blue', onClick: handleView },
    { icon: <IconEdit size="1rem" />, label: 'Editar', color: 'yellow', onClick: handleEdit },
    { icon: <IconTrash size="1rem" />, label: 'Eliminar', color: 'red', onClick: handleDeleteClick },
  ]; 
  //Columnas Dinamica Fin

  if (error) {
    return (
      <Container size="xl" py="md">
        <Alert icon={<IconAlertCircle size="1rem" />} title="Error" color="red">
          {error}
          <Group mt="md">
            <Button size="sm" variant="light" onClick={refetch}>
              Reintentar
            </Button>
          </Group>
        </Alert>
      </Container>
    );
  }

  return (
    <Box p="md">
      <Stack gap="md">
        <Flex justify="space-between" align="center">
          <Title order={2}>Parámetros de Monitoreo</Title>
          <Group>
            <ActionButtons.Refresh
              onClick={handleRefresh}
              loading={refreshing}
            />
            <ActionButtons.Modal onClick={handleCreate} />
          </Group>
        </Flex>

        <Card withBorder>
          <LoadingOverlay visible={loadingList} />
          {/* Columnas Dinamica Ini */}
          <PaginatedTable
            data={parametros}
            columns={columns}
            actions={actions}
            loading={loadingList}
            searchFields={['nombreCultivo', 'fechaMedicion', 'fuenteDatos']}
            itemsPerPage={5}
            searchPlaceholder="Buscar por cultivo, fecha o fuente..."
            getRowKey={(item) => item.id}
          />
          {/* Columnas Dinamica Fin */}
        </Card>
      </Stack>

      {/* Modal para crear/editar */}
      <ParametroModal
        opened={modalOpened}
        onClose={handleCloseModal}
        parametro={editMode ? selectedParametro : undefined}
        onSubmit={handleSubmit}
        loading={loadingCRUD}
      />

      {/* Modal para ver detalle */}
      <DetalleParametroModal
        opened={detalleModalOpened}
        onClose={() => setDetalleModalOpened(false)}
        parametro={selectedParametro}
      />

      {/* Modal para Eliminar */}
      <DeleteConfirmModal
        opened={deleteModalOpened}
        onClose={() => setDeleteModalOpened(false)}
        onConfirm={handleDeleteConfirm}
        itemName={
          selectedParametro
            ? `${selectedParametro.nombreCultivo} - ${selectedParametro.fechaMedicion}`
            : ''
        }
        itemType="parámetro de monitoreo"
      />
    </Box>
  );
};
