import { Stack, Paper, Group, Text } from '@mantine/core';
import { AnalisisImagenYOLO_DTO } from '../../../types/yolo';

interface RecomendacionesSectionProps {
  recomendaciones: AnalisisImagenYOLO_DTO['recomendaciones'];
}

export function RecomendacionesSection({ recomendaciones }: RecomendacionesSectionProps) {
  if (!recomendaciones || Object.keys(recomendaciones).length === 0) {
    return null;
  }

  return (
    <Paper p="md" withBorder bg="blue.0">
      <Stack gap="md">
        {/* Confianza general */}
        <Group>
          <Text fw={500}>Confianza general:</Text>
          <Text>{recomendaciones.confianza_general}%</Text>
        </Group>

        {/* Deficiencias */}
        {recomendaciones.deficiencias.map((def, index) => (
          <Paper key={index} p="sm" withBorder>
            <Stack gap="xs">
              <Text fw={600} c="blue">
                {def.nombre}
              </Text>

              <Text size="sm">
                Confianza: {def.confianza.toFixed(2)}%
              </Text>

              {/* Tratamiento inmediato */}
              <Text fw={500} mt="xs">Tratamiento inmediato</Text>
              <ul>
                {def.recomendaciones.tratamiento_inmediato.map((item, i) => (
                  <li key={i}>
                    <Text size="sm">{item}</Text>
                  </li>
                ))}
              </ul>

              {/* Fertilizantes */}
              <Text fw={500}>Fertilizantes recomendados</Text>
              <ul>
                {def.recomendaciones.fertilizantes_recomendados.map((item, i) => (
                  <li key={i}>
                    <Text size="sm">{item}</Text>
                  </li>
                ))}
              </ul>

              {/* Medidas preventivas */}
              <Text fw={500}>Medidas preventivas</Text>
              <ul>
                {def.recomendaciones.medidas_preventivas.map((item, i) => (
                  <li key={i}>
                    <Text size="sm">{item}</Text>
                  </li>
                ))}
              </ul>
            </Stack>
          </Paper>
        ))}
      </Stack>
    </Paper>
  );
}