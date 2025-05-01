'use client';

import React, { createContext, useContext, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import api from '@/lib/axios';

// Definir o tipo dos dados do formulário para o cadastro
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
  pricePerUnit: string;
  operatingMode?: string;
}

// Definir o tipo para a lista de propriedades retornada pela API (baseado na PropertyListDto)
interface PropertyListItem {
  id: string;
  title: string;
  description: string;
  createdAt: string;
  hostId: string;
  pricePerUnit: number;
  operatingMode?: string;
  type: string;
  city: string;
  state: string;
}

// Definir o tipo do contexto
interface PropertyContextType {
  register: (dados: PropertyData) => Promise<void>;
  getAllProperties: (search?: string, location?: string, type?: string) => Promise<PropertyListItem[]>;
  searchProperties: (location: string, type: string) => Promise<PropertyListItem[]>;
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
      const typeMap: { [key: string]: string } = {
        MORADIA: 'HOUSING',
        EVENTO: 'EVENTS',
        ESPORTE: 'SPORTS',
      };

      const operatingModeMap: { [key: string]: string } = {
        'Por Noite': 'PER_NIGHT',
        'Por Hora': 'PER_HOUR',
        'Por Dia': 'PER_DAY',
      };

      const pricePerUnit = parseFloat(dados.pricePerUnit);
      if (isNaN(pricePerUnit)) {
        throw new Error('O preço por unidade deve ser um número válido.');
      }

      const dataToSend = {
        title: dados.title,
        description: dados.description,
        type: typeMap[dados.type] || dados.type,
        status: dados.status,
        street: dados.street,
        city: dados.city,
        state: dados.state,
        country: dados.country,
        zipCode: dados.zipCode,
        pricePerUnit: pricePerUnit,
        operatingMode: operatingModeMap[dados.operatingMode || ''] || dados.operatingMode,
      };

      await api.post('/property', dataToSend, { skipAuthRefresh: true });
      router.push('/');
    } catch (error: any) {
      console.error('Erro ao cadastrar propriedade:', error);
      throw new Error(error.response?.data?.message || 'Erro ao cadastrar a propriedade.');
    }
  }, [router]);

  const getAllProperties = useCallback(async (search?: string, location?: string, type?: string): Promise<PropertyListItem[]> => {
    try {
      const response = await api.get('/property', {
        params: { search, location, type },
        skipAuthRefresh: true,
      });
      return response.data.data;
    } catch (error: any) {
      console.error('Erro ao buscar propriedades:', error);
      throw new Error(error.response?.data?.message || 'Erro ao buscar propriedades.');
    }
  }, []); 

  const searchProperties = useCallback(async (location: string, type: string): Promise<PropertyListItem[]> => {
    try {
      const response = await api.get('/property/search', {
        params: { location, type },
        skipAuthRefresh: true,
      });
      return response.data;
    } catch (error: any) {
      console.error('Erro ao buscar propriedades filtradas:', error);
      throw new Error(error.response?.data?.message || 'Erro ao buscar propriedades filtradas.');
    }
  }, []);

  return (
    <PropertyContext.Provider value={{ register, getAllProperties, searchProperties }}>
      {children}
    </PropertyContext.Provider>
  );
}

export default PropertyContext;