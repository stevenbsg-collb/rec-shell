import React from 'react';
import { Flex, Text, Stack } from '@mantine/core';
import { IconSearch } from '@tabler/icons-react';

interface EmptyStateProps {
  message?: string;
  icon?: React.ReactNode;
  padding?: string;
  textColor?: string;
  withIcon?: boolean;
  actionButton?: React.ReactNode;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  message = 'Lo sentimos, no se encontraron registros',
  icon = <IconSearch size={48} stroke={1} />,
  padding = 'xl',
  textColor = 'dimmed',
  withIcon = false,
  actionButton
}) => {
  return (
    <Flex justify="center" p={padding}>
      <Stack align="center" gap="md">
        {withIcon && (
          <Text c={textColor} ta="center">
            {icon}
          </Text>
        )}
        <Text c={textColor} ta="center">
          {message}
        </Text>
        {actionButton}
      </Stack>
    </Flex>
  );
};