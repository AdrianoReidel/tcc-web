'use client';

import React, { createContext, useContext, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import api from '@/lib/axios';

// Definir o tipo dos dados esperados para o registro (baseado na CreatePropertyDto)
interface PropertyData {
  title: string;
  description: string;
  type: string;
  status?: string;
  street: string;
  city: string;
  state: string;
  country: string;
  zipCode: string;
  pricePerUnit: string; // Será convertido para número antes de enviar
  operatingMode?: string;
}

// Definir o tipo do contexto
interface PropertyContextType {
  register: (dados: PropertyData) => Promise<void>;
}

// Criar o contexto
const PropertyContext = createContext<PropertyContextType | undefined>(undefined);

// Hook para usar o contexto
export const usePropertyContext = () => {
  const context = useContext(PropertyContext);
  if (!context) {
    throw new Error('usePropertyContext must be used within a PropertyProvider');
  }
  return context;
};

// Provider do contexto
export function PropertyProvider({ children }: { children: React.ReactNode }) {
  const router = useRouter();

  const register = useCallback(async (dados: PropertyData) => {
    try {
      // Mapear os valores de type para o formato esperado pela API
      const typeMap: { [key: string]: string } = {
        MORADIA: 'HOUSING',
        EVENTO: 'EVENTS',
        ESPORTE: 'SPORTS',
      };

      // Mapear os valores de operatingMode para o formato esperado pela API
      const operatingModeMap: { [key: string]: string } = {
        'Por Noite': 'PER_NIGHT',
        'Por Hora': 'PER_HOUR',
        'Por Dia': 'PER_DAY',
      };

      // Converter pricePerUnit para número
      const pricePerUnit = parseFloat(dados.pricePerUnit);
      if (isNaN(pricePerUnit)) {
        throw new Error('O preço por unidade deve ser um número válido.');
      }

      // Preparar os dados para enviar à API
      const dataToSend = {
        title: dados.title,
        description: dados.description,
        type: typeMap[dados.type] || dados.type, // Mapear o tipo
        status: dados.status,
        street: dados.street,
        city: dados.city,
        state: dados.state,
        country: dados.country,
        zipCode: dados.zipCode,
        pricePerUnit: pricePerUnit,
        operatingMode: operatingModeMap[dados.operatingMode || ''] || dados.operatingMode, // Mapear o modo de operação
      };

      await api.post('/property', dataToSend, { skipAuthRefresh: true });
      router.push('/'); // Redirecionar após o cadastro (ajuste o caminho conforme necessário)
    } catch (error: any) {
      console.error('Erro ao cadastrar propriedade:', error);
      throw new Error(error.response?.data?.message || 'Erro ao cadastrar a propriedade.');
    }
  }, [router]);

  return (
    <PropertyContext.Provider value={{ register }}>
      {children}
    </PropertyContext.Provider>
  );
}