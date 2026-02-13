import { useState, useEffect } from 'react';
import { Permission } from '../types/role.types';
import { service } from '../services/role.service';

export const usePermissions = () => {
  const [permissions, setPermissions] = useState<Permission[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchPermissions = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const fetchedPermissions = await service.GET_PERMISSIONS();
      setPermissions(fetchedPermissions);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al cargar permisos');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPermissions();
  }, []);

  return {
    permissions,
    loading,
    error,
    refetch: fetchPermissions
  };
};