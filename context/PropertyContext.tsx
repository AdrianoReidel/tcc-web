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

// Definir o tipo para as fotos
interface Photo {
  id: string;
  data: Blob;
  propertyId: string;
}

interface PropertyUpdateData {
  title: string;
  pricePerUnit: number;
  type: string;
  description: string;
  operatingMode: string;
  image?: File | null;
}

interface Property {
  id: string;
  title: string;
  description: string;
  type: string;
  status: string;
  street: string;
  city: string;
  state: string;
  country: string;
  zipCode: string;
  pricePerUnit: number;
  hostId: string;
  createdAt: Date;
  updatedAt: Date;
  operatingMode?: string;
}

interface ReservationData {
  startDate?: string | null;
  endDate?: string | null;
  selectedTime?: string | null;
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
  removePhoto: (propertyId: string, photoId: string) => Promise<void>;
  getPhotosByPropertyId: (propertyId: string) => Promise<Photo[]>;
  getPhotosByPropertyIdSinglePage: (propertyId: string) => Promise<Photo[]>;
  updateProperty: (id: string, data: FormData) => Promise<void>;
  findById: (id: string) => Promise<Property>;
  reserveProperty: (propertyId: string, reservation: ReservationData) => Promise<void>;
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
  
  const removePhoto = useCallback(async (propertyId: string, photoId: string): Promise<void> => {
    try {
      await api.delete(`/property/${propertyId}/photos/${photoId}`, {
        skipAuthRefresh: true,
      });
    } catch (error: any) {
      console.error('Erro ao remover foto:', error);
      throw new Error(error.response?.data?.message || 'Erro ao remover foto.');
    }
  }, []);

  const getPhotosByPropertyId = useCallback(async (propertyId: string): Promise<Photo[]> => {
    try {
      const response = await api.get(`/property/${propertyId}/photos`, {
        skipAuthRefresh: true,
      });
      const photos = response.data.data.map((photo: any) => ({
        id: photo.id,
        data: new Blob([new Uint8Array(photo.data.data)], { type: photo.mimeType || 'image/jpeg' }),
        propertyId: photo.propertyId,
      }));
      return photos;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Erro ao buscar fotos.');
    }
  }, []);

  const getPhotosByPropertyIdSinglePage = useCallback(async (propertyId: string): Promise<Photo[]> => {
    try {
      const response = await api.get(`/property/${propertyId}/photosSinglePage`, {
        skipAuthRefresh: true,
      });
      const photos = response.data.data.map((photo: any) => ({
        id: photo.id,
        data: new Blob([new Uint8Array(photo.data.data)], { type: photo.mimeType || 'image/jpeg' }),
        propertyId: photo.propertyId,
      }));
      return photos;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Erro ao buscar fotos.');
    }
  }, []);

  const updateProperty = useCallback(async (id: string, data: FormData): Promise<void> => {
    try {
      await api.put(`/property/${id}`, data, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        skipAuthRefresh: true,
      });
    } catch (error: any) {
      console.error('Erro ao atualizar propriedade:', error);
      throw new Error(error.response?.data?.message || 'Erro ao atualizar propriedade.');
    }
  }, []);

  const findById = async (id: string) => {
    const response = await api.get(`/property/${id}`);
    return response.data.data;
  };

  const reserveProperty = useCallback(async (propertyId: string, reservation: ReservationData): Promise<void> => {
    try {
      const reservationData = {
        propertyId,
        startDate: reservation.startDate,
        endDate: reservation.endDate,
        selectedTime: reservation.selectedTime,
      };

      await api.post(`/property/${propertyId}/reserve`, reservationData, {
        skipAuthRefresh: true,
      });

      router.push('/minhas-reservas'); // Redireciona para uma página de reservas após sucesso
    } catch (error: any) {
      console.error('Erro ao reservar propriedade:', error);
      throw new Error(error.response?.data?.message || 'Erro ao reservar a propriedade.');
    }
  }, [router]);

  return (
    <PropertyContext.Provider value={{ register, getAllProperties, searchProperties, 
    getPhotoDataById, getMyProperties, deleteProperty, addPhoto, removePhoto, getPhotosByPropertyId, 
    getPhotosByPropertyIdSinglePage, updateProperty, findById, reserveProperty }}>
      {children}
    </PropertyContext.Provider>
  );
}

export default PropertyContext;