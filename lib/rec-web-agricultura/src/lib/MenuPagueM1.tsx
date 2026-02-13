import { useEffect, useState } from 'react';
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
  Loader,
} from '@mantine/core';


import { MonitoreoAdmin } from './UI_MONITOREO/components/MonitoreoAdmin';
import { CultivosAdmin } from './UI_CULTIVO/components/CultivosAdmin';
import { MedidaAdmin } from './UI_MEDIDA/components/MedidaAdmin';
import { NutrienteAdmin } from './UI_NUTRIENTES/components/NutrienteAdmin';
import { SeguimientosAdmin } from './UI_SEGUIMIENTO/components/SeguimientosAdmin';
import { TratamientosAdmin } from './UI_TRATANIENTO/components/TratamientosAdmin';
import { Analisis } from './UI_PROCESS/UI_CARGA_IMAGEN/components/Analisis';
import { ListarAdmin } from './UI_PROCESS/UI_ANALISIS_IMAGEN/components/ListarAdmin';
import { PlanTratamientoListAdmin } from './UI_PROCESS/UI_PLAN_TRATAMIENTO/PlanTratamientoListAdmin';

import { useOpciones } from '@rec-shell/rec-web-auth';
import { OpcionDTO, ST_GET_ROLE_USER_ID } from '@rec-shell/rec-web-shared';
import { Listar } from './UI_PROCESS/UI_CONSULTAR_ANALISIS/components/Listar';


interface ComponentWithNavigation {
  onNavigate?: (tabKey: string) => void;
}

const componentMap: Record<string, React.ComponentType<any>> = {
  'cultivos': CultivosAdmin,
  'nutrientes': NutrienteAdmin,
  'tratamientos': TratamientosAdmin,
  'medidas': MedidaAdmin,
  'generacion': ListarAdmin,
  'seguimientos': PlanTratamientoListAdmin,
  'monitoreo': MonitoreoAdmin,
  'analisis': Analisis,
  'listar': Listar,
};

const colorMap: Record<string, string> = {
  'cultivos': 'green',
  'nutrientes': 'blue',
  'tratamientos': 'violet',
  'medidas': 'cyan',
  'generacion': 'yellow',
  'seguimientos': 'orange',
  'monitoreo': 'teal',
  'analisis': 'purple',
  'listar': 'blue',
};

export function MenuPagueM1({ onNavigate }: ComponentWithNavigation) {
  const [activeSection, setActiveSection] = useState<string | null>(null);
  const { opciones, loading, error, OBTENER_OPCIONES_BY_ROL } = useOpciones();

  useEffect(() => {
    const roleId = ST_GET_ROLE_USER_ID();
    if (roleId) {
      OBTENER_OPCIONES_BY_ROL(roleId, 'CULTIVO');
    }
  }, []);

  if (loading) {
    return (
      <Container fluid p="xl">
        <Stack align="center" justify="center" style={{ minHeight: '400px' }}>
          <Loader size="lg" />
          <Text c="dimmed">Cargando opciones del menú...</Text>
        </Stack>
      </Container>
    );
  }

  if (activeSection) {
    
    const currentOption = opciones.find(opt => opt.codigo === activeSection);
    const Component = currentOption ? componentMap[currentOption.codigo] : null;

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
            Sistema de Gestión Agrícola
          </Title>
          <Text c="dimmed" size="lg">
            Bienvenido al panel de administración. Selecciona una sección para comenzar.
          </Text>
        </Box>

        <SimpleGrid cols={{ base: 1, sm: 2, lg: 3, xl: 3 }} spacing="xl">
            {opciones.map((opcion: OpcionDTO) => (
              <Card
                key={opcion.id}
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
                  console.log('Navegando a:', opcion.codigo);
                  setActiveSection(opcion.codigo);
                }}
              >
                <Stack gap="md">
                  <Group>
                    <ThemeIcon 
                      size="xl" 
                      radius="md" 
                      variant="light" 
                      color={colorMap[opcion.codigo] || 'gray'}
                    >
                      <Text size="xl">{opcion.icono}</Text>
                    </ThemeIcon>
                    <Box style={{ flex: 1 }}>
                      <Text fw={600} size="lg">
                        {opcion.nombre}
                      </Text>
                    </Box>
                  </Group>
                  <Text size="sm" c="dimmed">
                    {opcion.descripcion}
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
  NutrienteAdmin,
  TratamientosAdmin,
  MedidaAdmin,
  CultivosAdmin,
  SeguimientosAdmin,
  MonitoreoAdmin,
  Analisis,
  Listar
};