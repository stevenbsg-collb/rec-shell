import { useState, useEffect } from 'react';
import { User, UsersFilters } from '../types/users.types';
import { service } from '../services/users.service';
import { filterUsers } from '../utils/users.utils';

export const useUsers = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState<UsersFilters>({
    searchTerm: '',
    statusFilter: '',
    roleFilter: ''
  });

  const fetchUsers = async () => {
    try {
      setLoading(true);
      setError(null);
      const userData = await service.GET();
      setUsers(userData);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error desconocido');
    } finally {
      setLoading(false);
    }
  };

  const refreshUsers = async () => {
    try {
      setLoading(true);
      const userData = await service.REFRESH();
      setUsers(userData);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al actualizar');
    } finally {
      setLoading(false);
    }
  };

  const updateFilters = (newFilters: Partial<UsersFilters>) => {
    setFilters(prev => ({ ...prev, ...newFilters }));
  };

  const filteredUsers = filterUsers(users, filters);

  useEffect(() => {
    fetchUsers();
  }, []);

  return {
    users,
    filteredUsers,
    loading,
    error,
    filters,
    updateFilters,
    refreshUsers,
    setError
  };
};