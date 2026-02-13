export interface User {
  id: number;
  username: string;
  email: string;
  firstName: string;
  lastName: string;
  phoneNumber?: string;
  status: UserStatus;
  enabled: boolean;
  createdAt: string;
  updatedAt: string;
  roles: UserRole[];
}

export type UserStatus = 
  | 'CONFIRMED' 
  | 'UNCONFIRMED' 
  | 'FORCE_CHANGE_PASSWORD' 
  | 'DISABLED';

export type UserRole = 'ADMIN' | 'MODERATOR' | 'USER';

export const statusOptions = [
  { value: 'CONFIRMED', label: 'Confirmado' },
  { value: 'ARCHIVED', label: 'Archivado' },
  { value: 'COMPROMISED', label: 'Comprometido' },
  { value: 'UNKNOWN', label: 'Desconocido' },
  { value: 'FORCE_CHANGE_PASSWORD', label: 'Forzar cambio de contraseña' }
];

export interface UsersFilters {
  searchTerm: string;
  statusFilter: string;
  roleFilter: string;
}

export interface UsersTableProps {
  users: User[];
  loading: boolean;
  onEditUser: (userId: number) => void;
  onManageRoles: (userId: number) => void;
}

export interface UsersFiltersProps {
  filters: UsersFilters;
  onFiltersChange: (filters: UsersFilters) => void;
}

export interface UserRowProps {
  user: User;
  onEditUser: (userId: number) => void;
  onManageRoles: (userId: number) => void;
}

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T | null;
  timestamp: string;
}

export interface EditUserFormValues {
  username: string;
  email: string;
  firstName: string;
  lastName: string;
  phoneNumber: string;
  enabled: boolean;
  status: string;
  newPassword?: string;
  confirmNewPassword?: string;
}

export type UpdateUserResponse  = ApiResponse<User>;