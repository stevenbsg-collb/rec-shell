import { useState, useEffect } from 'react';
import { Role } from '../types/role.types';
import { service } from '../services/role.service';

export const useRoles = () => {
  const [roles, setRoles] = useState<Role[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchRoles = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const fetchedRoles = await service.GET();
      setRoles(fetchedRoles);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const createRole = async (roleData: {
    name: string;
    description: string;
    permissionIds?: number[];
    }) => {
    setLoading(true);
    setError(null);
    
    try {
      const newRole = await service.POST(roleData);
      await fetchRoles();      
      return newRole;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const updateRole = async (id: number, roleData: Partial<Omit<Role, 'id'>>) => {
    setLoading(true);
    setError(null);
    
    try {
      const updatedRole = await service.PUT(id, roleData);
      await fetchRoles();      
      return updatedRole;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const deleteRole = async (id: number) => {
    setLoading(true);
    setError(null);
    
    try {
      await service.DELETE(id);
      await fetchRoles();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRoles();
  }, []);

  return {
    roles,
    loading,
    error,
    fetchRoles,
    createRole,
    updateRole,
    deleteRole
  };
};