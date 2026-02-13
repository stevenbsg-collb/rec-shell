import React from 'react';
import { Paper, Flex, Text } from '@mantine/core';

interface LoadingMessageProps {
  message?: string;
  withBorder?: boolean;
  padding?: string;
  textColor?: string;
}

export const LoadingMessage: React.FC<LoadingMessageProps> = ({
  message = 'Cargando registros...',
  withBorder = true,
  padding = 'xl',
  textColor = 'dimmed'
}) => {
  const content = (
    <Flex justify="center" p={padding}>
      <Text c={textColor}>{message}</Text>
    </Flex>
  );

  return withBorder ? <Paper withBorder>{content}</Paper> : content;
};