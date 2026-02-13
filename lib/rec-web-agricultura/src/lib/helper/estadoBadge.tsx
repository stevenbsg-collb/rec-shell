import { Badge } from "@mantine/core";


export const getEstadoBadge = (estado: string) => {
  const colores: Record<string, string> = {
    ACTIVO: 'green',
    INACTIVO: 'gray',
    COSECHADO: 'blue',
    SUSPENDIDO: 'red',
  };
  
  return <Badge color={colores[estado] || 'gray'}>{estado}</Badge>;
};