import React, { useState, useEffect } from 'react';
import {
  Title,
  Table,
  ActionIcon,
  Modal,
  TextInput,
  Textarea,
  Switch,
  Group,
  Alert,
  Loader,
  Badge,
  Stack,
  Card,
  Flex,
  Text,
  Box,
  ScrollArea,
} from '@mantine/core';
import {
  IconEdit,
  IconTrash,
  IconEye,
  IconCheck,
  IconX,
  IconExclamationMark
} from '@tabler/icons-react';
import { DeficienciaNutriente } from '../../types/model';
import { DeficienciaNutrienteInput } from '../../types/dto';
import { ActionButtons, DeleteConfirmModal, NOTIFICATION_MESSAGES, PaginationControls, useNotifications, usePagination } from '@rec-shell/rec-web-shared';
import { useAgricultura } from '../hooks/useAgricultura';

export const NutrienteAdmin = () => {
  const {
    deficiencias,
    loading,
    error,
    CREAR,
    BUSCAR,
    ACTUALIZAR,
    ELIMINAR,
    activar,
    desactivar,
    clearError
  } = useAgricultura();

  const [modalAbierto, setModalAbierto] = useState(false);
  const [modalDetalle, setModalDetalle] = useState(false);
  const [modalELIMINAR, setModalELIMINAR] = useState(false);
  const [deficienciaSeleccionada, setDeficienciaSeleccionada] = useState<DeficienciaNutriente | null>(null);
  const [editando, setEditando] = useState(false);
  const notifications = useNotifications();
  
  const [formulario, setFormulario] = useState<DeficienciaNutrienteInput>({
    codigo: '',
    nombre: '',
    descripcion: '',
    sintomasVisuales: '',
    nutrienteDeficiente: '',
    activo: true
  });

  useEffect(() => {
    BUSCAR();
  }, []);

  // Ref Paginacion Global
  const lista = Array.isArray(deficiencias) ? deficiencias : [];
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
    searchFields: ['codigo', 'nombre', 'nutrienteDeficiente'] 
  });

  const limpiarFormulario = () => {
    setFormulario({
      codigo: '',
      nombre: '',
      descripcion: '',
      sintomasVisuales: '',
      nutrienteDeficiente: '',
      activo: true
    });
  };

  const abrirModal = (deficiencia?: DeficienciaNutriente) => {
    if (deficiencia) {
      setEditando(true);
      setFormulario({
        codigo: deficiencia.codigo,
        nombre: deficiencia.nombre,
        descripcion: deficiencia.descripcion || '',
        sintomasVisuales: deficiencia.sintomasVisuales || '',
        nutrienteDeficiente: deficiencia.nutrienteDeficiente || '',
        activo: deficiencia.activo
      });
      setDeficienciaSeleccionada(deficiencia);
    } else {
      setEditando(false);
      limpiarFormulario();
      setDeficienciaSeleccionada(null);
    }
    setModalAbierto(true);
  };

  const cerrarModal = () => {
    setModalAbierto(false);
    setEditando(false);
    limpiarFormulario();
    setDeficienciaSeleccionada(null);
    clearError();
  };

  const handlerSubmit = async () => {
    if (editando && deficienciaSeleccionada) {
      await ACTUALIZAR(deficienciaSeleccionada.id.toString(), formulario);
      notifications.success();
      cerrarModal();
    } else {
      await CREAR(formulario);
      notifications.success();
      cerrarModal();
    }
  };

  const handlerEliminar = async () => {
    if (deficienciaSeleccionada) {
      const exito = await ELIMINAR(deficienciaSeleccionada.id.toString());
      if (exito) {
        notifications.success(NOTIFICATION_MESSAGES.GENERAL.DELETE.message);
        setModalELIMINAR(false);
        setDeficienciaSeleccionada(null);
      } else {
        notifications.error(NOTIFICATION_MESSAGES.GENERAL.ERROR.title, error || 'No se pudo eliminar el registro');
      }
    }
  };

  const cambiarEstado = async (deficiencia: DeficienciaNutriente) => {
    let resultado;
    
    if (deficiencia.activo) {
      resultado = await desactivar(deficiencia.id.toString());
    } else {
      resultado = await activar(deficiencia.id.toString());
    }
    
    if (resultado) {
      await BUSCAR();
      
      notifications.success(
        NOTIFICATION_MESSAGES.GENERAL.STATE.message, 
        `Registro ${deficiencia.activo ? 'desactivado' : 'activado'} correctamente`
      );
    } else {
      notifications.error(
        NOTIFICATION_MESSAGES.GENERAL.ERROR.title, 
        error || 'No se pudo cambiar el estado'
      );
    }
  };

  const handlerDetalle = (deficiencia: DeficienciaNutriente) => {
    setDeficienciaSeleccionada(deficiencia);
    setModalDetalle(true);
  };

  const rows = paginatedData.map((deficiencia) => (
    <Table.Tr key={deficiencia.id}>
      <Table.Td>{deficiencia.codigo}</Table.Td>
      <Table.Td>{deficiencia.nombre}</Table.Td>
      <Table.Td>{deficiencia.nutrienteDeficiente || '-'}</Table.Td>
      <Table.Td>
        <Badge color={deficiencia.activo ? 'green' : 'red'}>
          {deficiencia.activo ? 'Activo' : 'Inactivo'}
        </Badge>
      </Table.Td>
      <Table.Td>
        <Group gap="xs">
          <ActionIcon
            variant="light"
            color="blue"
            onClick={() => handlerDetalle(deficiencia)}
          >
            <IconEye size={16} />
          </ActionIcon>
          <ActionIcon
            variant="light"
            color="yellow"
            onClick={() => abrirModal(deficiencia)}
          >
            <IconEdit size={16} />
          </ActionIcon>
          <ActionIcon
            variant="light"
            color={deficiencia.activo ? 'red' : 'green'}
            onClick={() => cambiarEstado(deficiencia)}
          >
            {deficiencia.activo ? <IconX size={16} /> : <IconCheck size={16} />}
          </ActionIcon>
          <ActionIcon
            variant="light"
            color="red"
            onClick={() => {
              setDeficienciaSeleccionada(deficiencia);
              setModalELIMINAR(true);
            }}
          >
            <IconTrash size={16} />
          </ActionIcon>
        </Group>
      </Table.Td>
    </Table.Tr>
  ));

  return (
    <Box p="md">
      <Flex justify="space-between" align="center" mb="lg">
        <Title order={2}>Gestión de Deficiencias de Nutrientes</Title>
        <ActionButtons.Modal 
          onClick={() => abrirModal()}               
        />
      </Flex>

      {error && (
        <Alert
          icon={<IconExclamationMark size={16} />}
          title="Error"
          color="red"
          mb="md"
          withCloseButton
          onClose={clearError}
        >
          {error}
        </Alert>
      )}

      {loading ? (
        <Flex justify="center" p="xl">
          <Loader size="md" />
        </Flex>
      ) : (
        <Card shadow="sm" p="lg">
          <ScrollArea type="auto" offsetScrollbars>
        <Table striped highlightOnHover style={{ minWidth: 980 }}>
            <Table.Thead>
              <Table.Tr>
                <Table.Th>Código</Table.Th>
                <Table.Th>Nombre</Table.Th>
                <Table.Th>Nutriente Deficiente</Table.Th>
                <Table.Th>Estado</Table.Th>
                <Table.Th>Acciones</Table.Th>
              </Table.Tr>
            </Table.Thead>
            <Table.Tbody>
              {rows.length > 0 ? rows : (
                <Table.Tr>
                  <Table.Td colSpan={5} style={{ textAlign: 'center' }}>
                    <Text c="dimmed">
                      {searchTerm ? 'No se encontraron resultados para tu búsqueda' : 'No se encontraron registros'}
                    </Text>
                  </Table.Td>
                </Table.Tr>
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
          
        </Card>
      )}

      {/* Modal de Crear/Editar */}
      <Modal
        opened={modalAbierto}
        onClose={cerrarModal}
        title={editando ? 'Editar Registro' : 'Nuevo Registro'}
        size="lg"
      >
        <div>
          <Stack gap="md">
            <TextInput
              label="Código"
              placeholder="Ej: DEF001"
              required
              value={formulario.codigo}
              onChange={(e) => setFormulario(prev => ({ ...prev, codigo: e.target.value }))}
            />
            
            <TextInput
              label="Nombre"
              placeholder="Nombre de la deficiencia"
              required
              value={formulario.nombre}
              onChange={(e) => setFormulario(prev => ({ ...prev, nombre: e.target.value }))}
            />
            
            <Textarea
              label="Descripción"
              placeholder="Descripción detallada"
              rows={3}
              value={formulario.descripcion}
              onChange={(e) => setFormulario(prev => ({ ...prev, descripcion: e.target.value }))}
            />
            
            <Textarea
              label="Síntomas Visuales"
              placeholder="Síntomas que se pueden observar"
              rows={3}
              value={formulario.sintomasVisuales}
              onChange={(e) => setFormulario(prev => ({ ...prev, sintomasVisuales: e.target.value }))}
            />
            
            <TextInput
              label="Nutriente Deficiente"
              placeholder="Ej: Nitrógeno, Fósforo, Potasio"
              value={formulario.nutrienteDeficiente}
              onChange={(e) => setFormulario(prev => ({ ...prev, nutrienteDeficiente: e.target.value }))}
            />
            
            <Switch
              label="Activo"
              size="md"
              color="teal"
              checked={formulario.activo}
              onChange={(e) => setFormulario(prev => ({ ...prev, activo: e.target.checked }))}
            />

            <Group justify="center" mt="md">
              <ActionButtons.Cancel onClick={cerrarModal} />
              <ActionButtons.Save onClick={handlerSubmit} loading={loading} />
            </Group>
          </Stack>
        </div>
      </Modal>

      {/* Modal de Detalle */}
      <Modal
        opened={modalDetalle}
        onClose={() => setModalDetalle(false)}
        title="Detalle de Deficiencia"
        size="md"
      >
        {deficienciaSeleccionada && (
          <Stack gap="md">
            <Group>
              <Text fw={500}>Código:</Text>
              <Text>{deficienciaSeleccionada.codigo}</Text>
            </Group>
            
            <Group>
              <Text fw={500}>Nombre:</Text>
              <Text>{deficienciaSeleccionada.nombre}</Text>
            </Group>
            
            <Group>
              <Text fw={500}>Estado:</Text>
              <Badge color={deficienciaSeleccionada.activo ? 'green' : 'red'}>
                {deficienciaSeleccionada.activo ? 'Activo' : 'Inactivo'}
              </Badge>
            </Group>
            
            {deficienciaSeleccionada.nutrienteDeficiente && (
              <Group>
                <Text fw={500}>Nutriente Deficiente:</Text>
                <Text>{deficienciaSeleccionada.nutrienteDeficiente}</Text>
              </Group>
            )}
            
            {deficienciaSeleccionada.descripcion && (
              <div>
                <Text fw={500} mb="xs">Descripción:</Text>
                <Text>{deficienciaSeleccionada.descripcion}</Text>
              </div>
            )}
            
            {deficienciaSeleccionada.sintomasVisuales && (
              <div>
                <Text fw={500} mb="xs">Síntomas Visuales:</Text>
                <Text>{deficienciaSeleccionada.sintomasVisuales}</Text>
              </div>
            )}
          </Stack>
        )}
      </Modal>

      {/* Modal de Confirmación de Eliminación */}
      <DeleteConfirmModal
        opened={modalELIMINAR}
        onClose={() => setModalELIMINAR(false)}
        onConfirm={handlerEliminar}
        itemName={deficienciaSeleccionada?.nombre || ""}
        itemType="cultivo"
      />
    </Box>
  );
};