import { Table } from '@mantine/core';

export function AnalisisAdminTableHeader() {
  return (
    <Table.Thead>
      <Table.Tr>
        <Table.Th>Archivo</Table.Th>
        <Table.Th>Ubicación</Table.Th>
        <Table.Th>Estado</Table.Th>
        <Table.Th>Detecciones</Table.Th>
        <Table.Th className="hide-sm">Confianza Promedio</Table.Th>
        <Table.Th className="hide-sm">Deficiencias Detectadas</Table.Th>
        <Table.Th className="hide-sm">Fecha</Table.Th>
        <Table.Th>Acciones</Table.Th>
      </Table.Tr>
    </Table.Thead>
  );
}