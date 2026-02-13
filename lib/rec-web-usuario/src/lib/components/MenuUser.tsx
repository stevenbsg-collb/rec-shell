import { useState } from 'react';
import {
  Container,
  Title,
  Text,
  Card,
  SimpleGrid,
  Stack,
  Group,
  ThemeIcon,
  Box,
  Button,
} from '@mantine/core';
import { RoleManagement } from './role/POST/RoleManagement';
import { UsersPage } from './users/GET/UsersPage';
import { UserManagement } from './users/POST/UserManagement';


interface ComponentWithNavigation {
  onNavigate?: (tabKey: string) => void;
}

const menuItems = [
  { 
    icon: '👤', 
    label: 'Registrar Usuario', 
    value: 'registrar-usuario',
    color: 'blue',
    description: 'Registra nuevos usuarios en el sistema',
    component: UserManagement
  },
  { 
    icon: '👥', 
    label: 'Consultar Usuarios', 
    value: 'consultar-usuarios',
    color: 'cyan',
    description: 'Visualiza y gestiona usuarios existentes',
    component: UsersPage
  },
  { 
    icon: '🔐', 
    label: 'Gestión de Roles', 
    value: 'roles',
    color: 'grape',
    description: 'Administra roles y permisos del sistema',
    component: RoleManagement
  }
];

export function MenuUser({ onNavigate }: ComponentWithNavigation) {
  const [activeSection, setActiveSection] = useState<string | null>(null);

  if (activeSection) {
    const currentItem = menuItems.find(item => item.value === activeSection);
    const Component = currentItem?.component;

    return (
      <Container fluid p="xl">
        <Stack gap="md">
          <Button
            variant="subtle"
            onClick={() => setActiveSection(null)}
            leftSection={<span>←</span>}
          >
            Volver al menú
          </Button>
          
          {Component && <Component />}
        </Stack>
      </Container>
    );
  }

  return (
    <Container fluid p="xl">
      <Stack gap="xl">
        <Box>
          <Title order={1} mb="xs">
            Administración de Usuarios
          </Title>
          <Text c="dimmed" size="lg">
            Gestiona usuarios, roles y permisos del sistema.
          </Text>
        </Box>

        <SimpleGrid cols={{ base: 1, sm: 2, lg: 3 }} spacing="xl">
          {menuItems.map((item) => (
            <Card
              key={item.value}
              shadow="sm"
              padding="xl"
              radius="md"
              withBorder
              style={{ 
                cursor: 'pointer', 
                transition: 'all 0.2s ease',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-4px)';
                e.currentTarget.style.boxShadow = '0 8px 16px rgba(0,0,0,0.1)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = '';
              }}
              onClick={() => {
                console.log('Navegando a:', item.value);
                setActiveSection(item.value);
              }}
            >
              <Stack gap="md">
                <Group>
                  <ThemeIcon size="xl" radius="md" variant="light" color={item.color}>
                    <Text size="xl">{item.icon}</Text>
                  </ThemeIcon>
                  <Box style={{ flex: 1 }}>
                    <Text fw={600} size="lg">
                      {item.label}
                    </Text>
                  </Box>
                </Group>
                <Text size="sm" c="dimmed">
                  {item.description}
                </Text>
              </Stack>
            </Card>
          ))}
        </SimpleGrid>
      </Stack>
    </Container>
  );
}

export {
  UserManagement,
  UsersPage,
  RoleManagement
};