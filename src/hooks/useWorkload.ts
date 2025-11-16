import { useCallback, useEffect, useState } from 'react';
import { disableWorkload, enableWorkload, getWorkloadStatus, } from '../services/workload.service';


interface UseWorkloadReturn {
  enabled: boolean | null;
  isLoading: boolean;
  error: string | null;
  toggle: () => Promise<void>;
  refetch: () => Promise<void>;
}

export function useWorkload(): UseWorkloadReturn {
  const [enabled, setEnabled] = useState<boolean | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchStatus = useCallback(async () => {
    setError(null);

    try {
      const response = await getWorkloadStatus();

      if (response.success && response.data && typeof response.data.enabled === 'boolean') {
        setEnabled(response.data.enabled);
      } else {
        setError(response.error || 'Error al cargar estado');
        setEnabled(false);
      }
    } catch {
      setError('Error de conexión');
      setEnabled(false);
    }
  }, []);

  const toggle = useCallback(async () => {
    if (enabled === null || enabled === undefined) {
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const response = enabled ? await disableWorkload() : await enableWorkload();

      if (response.success && response.data && typeof response.data.enabled === 'boolean') {
        setEnabled(response.data.enabled);
      } else {
        setError(response.error || 'Error al cambiar estado');
      }
    } catch {
      setError('Error de conexión');
    } finally {
      setIsLoading(false);
    }
  }, [enabled]);

  useEffect(() => {
    fetchStatus();
  }, [fetchStatus]);

  return {
    enabled,
    isLoading,
    error,
    toggle,
    refetch: fetchStatus,
  };
}

