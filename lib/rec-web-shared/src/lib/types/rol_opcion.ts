export interface OpcionDTO {
  id: number;
  nombre: string;
  codigo: string;
  icono: string;
  descripcion: string;
}

export function ST_GET_ROLE_USER_ID(): string {
  const userStr = window.sessionStorage.getItem('user');
  return userStr ? JSON.parse(userStr).roles?.[0] ?? '' : '';
}