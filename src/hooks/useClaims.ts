import { useCallback, useEffect, useState } from 'react';
import { Claim, getClaims } from '../services/claims.service';

type ClaimFilter = 'all' | 'open' | 'closed';

interface UseClaimsOptions {
  filter?: ClaimFilter;
}

interface UseClaimsReturn {
  claims: Claim[];
  isLoading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

export function useClaims(options: UseClaimsOptions = {}): UseClaimsReturn {
  const { filter = 'all' } = options;

  const [claims, setClaims] = useState<Claim[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchClaims = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await getClaims();

      if (response.success && response.data) {
        let filteredClaims = response.data;

        if (filter === 'open') {
          filteredClaims = filteredClaims.filter(
            (c) => c.reclamo_estado !== 'CERRADO' && c.reclamo_estado !== 'CANCELADO'
          );
        } else if (filter === 'closed') {
          filteredClaims = filteredClaims.filter(
            (c) => c.reclamo_estado === 'CERRADO' || c.reclamo_estado === 'CANCELADO'
          );
        }

        setClaims(filteredClaims);
      } else {
        setError(response.error || 'Error al cargar reclamos');
      }
    } catch (err) {
      setError('Error de conexión');
    } finally {
      setIsLoading(false);
    }
  }, [filter]);

  useEffect(() => {
    fetchClaims();
  }, [fetchClaims]);

  return {
    claims,
    isLoading,
    error,
    refetch: fetchClaims,
  };
}

