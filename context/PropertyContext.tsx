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
  operatingMode: string;
  image?: File | null;
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
  photoId?: string;
}

// Definir o tipo do contexto
interface PropertyContextType {
  register: (dados: PropertyData) => Promise<void>;
  getAllProperties: (search?: string, location?: string, type?: string) => Promise<PropertyListItem[]>;
  searchProperties: (location: string, type: string) => Promise<PropertyListItem[]>;
  getPhotoDataById: (photoId: string) => Promise<Blob>;
  getMyProperties: () => Promise<PropertyListItem[]>;
  deleteProperty: (id: string) => Promise<void>;
  addPhoto: (propertyId: string, file: File) => Promise<void>;
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

      // Criar FormData para enviar os dados, incluindo a imagem
      const dataToSend = new FormData();
      dataToSend.append('title', dados.title);
      dataToSend.append('description', dados.description);
      dataToSend.append('type', typeMap[dados.type] || dados.type);
      dataToSend.append('status', dados.status || 'AVAILABLE');
      dataToSend.append('street', dados.street);
      dataToSend.append('city', dados.city);
      dataToSend.append('state', dados.state);
      dataToSend.append('country', dados.country);
      dataToSend.append('zipCode', dados.zipCode);
      dataToSend.append('pricePerUnit', pricePerUnit.toString());
      dataToSend.append('operatingMode', operatingModeMap[dados.operatingMode] || dados.operatingMode);
      if (dados.image) {
        dataToSend.append('image', dados.image);
      }

      await api.post('/property', dataToSend, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        skipAuthRefresh: true,
      });

      router.push('/');
    } catch (error: any) {
      console.error('Erro ao cadastrar propriedade:', error);
      throw new Error(error.response?.data?.message || 'Erro ao cadastrar a propriedade.');
    }
  }, [router]);

  const getAllProperties = useCallback(async (search?: string, location?: string, type?: string): Promise<PropertyListItem[]> => {
    try {
      const response = await api.get('/property', {
        params: { search },
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

  const getPhotoDataById = useCallback(async (photoId: string): Promise<Blob> => {
    try {
      const response = await api.get(`property/photos/${photoId}`, {
        responseType: 'blob',
        headers: {
          'Accept': 'image/jpeg'
        },
        skipAuthRefresh: true,
      });
  
      return response.data; 
    } catch (error: any) {
      console.error(`Erro ao buscar imagem para photoId ${photoId}:`, error);
      throw new Error(error.response?.data?.message || 'Erro ao buscar imagem.');
    }
  }, []);

  const getMyProperties = useCallback(async (): Promise<PropertyListItem[]> => {
    try {
      const response = await api.get('/property/me', {
        skipAuthRefresh: true,
      });
      const properties = Array.isArray(response.data) ? response.data : response.data.data || [];
      return properties;
    } catch (error: any) {
      console.error('Erro ao buscar propriedades do usuário:', error);
      throw new Error(error.response?.data?.message || 'Erro ao buscar propriedades do usuário.');
    }
  }, []);

  const deleteProperty = useCallback(async (id: string): Promise<void> => {
    try {
      await api.delete(`/property/${id}`, {
        skipAuthRefresh: true,
      });
    } catch (error: any) {
      console.error('Erro ao excluir propriedade:', error);
      throw new Error(error.response?.data?.message || 'Erro ao excluir propriedade.');
    }
  }, []);

  const addPhoto = useCallback(async (propertyId: string, file: File): Promise<void> => {
    try {
      const formData = new FormData();
      formData.append('image', file);

      await api.post(`/property/${propertyId}/photos`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        skipAuthRefresh: true,
      });
    } catch (error: any) {
      console.error('Erro ao adicionar foto:', error);
      throw new Error(error.response?.data?.message || 'Erro ao adicionar foto.');
    }
  }, []);

  return (
    <PropertyContext.Provider value={{ register, getAllProperties, searchProperties, 
    getPhotoDataById, getMyProperties, deleteProperty, addPhoto }}>
      {children}
    </PropertyContext.Provider>
  );
}

export default PropertyContext;