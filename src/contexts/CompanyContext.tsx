import React, { createContext, useContext, useEffect, useState } from 'react';
import { CompanyInfo, getCompanyInfo } from '../services/company.service';

interface CompanyContextType {
  companyInfo: CompanyInfo | null;
  isLoading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

const CompanyContext = createContext<CompanyContextType | undefined>(undefined);

export function CompanyProvider({ children }: { children: React.ReactNode }) {
  const [companyInfo, setCompanyInfo] = useState<CompanyInfo | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchCompanyInfo = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const response = await getCompanyInfo();

      if (response.success && response.data) {
        setCompanyInfo(response.data);
      } else {
        setError(response.error || response.message || 'Error al obtener información de la compañía');
      }
    } catch {
      setError('Error de conexión');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchCompanyInfo();
  }, []);

  return (
    <CompanyContext.Provider
      value={{
        companyInfo,
        isLoading,
        error,
        refetch: fetchCompanyInfo,
      }}
    >
      {children}
    </CompanyContext.Provider>
  );
}

export function useCompany() {
  const context = useContext(CompanyContext);
  if (context === undefined) {
    throw new Error('useCompany debe usarse dentro de CompanyProvider');
  }
  return context;
}

