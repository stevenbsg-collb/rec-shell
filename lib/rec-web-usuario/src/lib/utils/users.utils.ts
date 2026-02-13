// utils/users.utils.ts
import { User, UsersFilters, UserStatus, UserRole } from '../types/users.types';
import { STATUS_COLORS, ROLE_COLORS } from '../constants/users.constants';

export const filterUsers = (users: User[], filters: UsersFilters): User[] => {
  return users.filter(user => {
    const matchesSearch = user.username.toLowerCase().includes(filters.searchTerm.toLowerCase()) ||
                         user.email.toLowerCase().includes(filters.searchTerm.toLowerCase()) ||
                         `${user.firstName} ${user.lastName}`.toLowerCase().includes(filters.searchTerm.toLowerCase());
    
    const matchesStatus = !filters.statusFilter || user.status === filters.statusFilter;
    const matchesRole = !filters.roleFilter || user.roles.includes(filters.roleFilter as UserRole);
    
    return matchesSearch && matchesStatus && matchesRole;
  });
};

export const getStatusColor = (status: UserStatus): string => {
  return STATUS_COLORS[status] || 'gray';
};

export const getRoleColor = (role: UserRole): string => {
  return ROLE_COLORS[role] || 'gray';
};

export const formatDate = (dateString: string): string => {
  return new Date(dateString).toLocaleDateString('es-ES', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
};

export const getUserInitials = (firstName: string, lastName: string): string => {
  return `${firstName?.[0] || ''}${lastName?.[0] || ''}`;
};