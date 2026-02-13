import { UserStatus, UserRole } from '../types/users.types';

export const USER_STATUS_OPTIONS = [
  { value: '', label: 'Todos los estados' },
  { value: 'CONFIRMED', label: 'Confirmado' },
  { value: 'UNCONFIRMED', label: 'Sin confirmar' },
  { value: 'FORCE_CHANGE_PASSWORD', label: 'Cambio de contraseña requerido' },
  { value: 'DISABLED', label: 'Deshabilitado' }
];

export const USER_ROLE_OPTIONS = [
  { value: '', label: 'Todos los roles' },
  { value: 'ADMIN', label: 'Administrador' },
  { value: 'MODERATOR', label: 'Moderador' },
  { value: 'USER', label: 'Usuario' }
];

export const STATUS_COLORS: Record<UserStatus, string> = {
  CONFIRMED: 'green',
  UNCONFIRMED: 'yellow',
  FORCE_CHANGE_PASSWORD: 'orange',
  DISABLED: 'red'
};

export const ROLE_COLORS: Record<UserRole, string> = {
  ADMIN: 'red',
  MODERATOR: 'blue',
  USER: 'gray'
};