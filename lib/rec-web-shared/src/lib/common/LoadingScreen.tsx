import React from 'react';
import { Container, Flex, Stack, Loader, Text } from '@mantine/core';

interface LoadingScreenProps {
  message?: string;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  containerSize?: string;
  height?: number;
}

export const LoadingScreen: React.FC<LoadingScreenProps> = ({ 
  message = 'Cargando...',
  size = 'lg',
  containerSize = 'xl',
  height = 400
}) => {
  return (
    <Container size={containerSize} py="xl">
      <Flex justify="center" align="center" h={height}>
        <Stack align="center">
          <Loader size={size} />
          <Text>{message}</Text>
        </Stack>
      </Flex>
    </Container>
  );
};