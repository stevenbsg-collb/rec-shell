import React from 'react';
import { Group, Text } from '@mantine/core';

interface DataSummaryProps {
  filteredCount: number;
  totalCount: number;
  itemName?: string;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
}

export const DataSummary: React.FC<DataSummaryProps> = ({ 
  filteredCount, 
  totalCount, 
  itemName = 'items',
  size = 'sm'
}) => {
  return (
    <Group justify="space-between">
      <Text size={size} c="dimmed">
        Mostrando {filteredCount} de {totalCount} {itemName}
      </Text>
    </Group>
  );
};