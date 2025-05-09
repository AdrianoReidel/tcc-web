'use client';

import React, { useEffect, useState } from 'react';
import { usePropertyContext } from '@/context/PropertyContext';

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
  photoIds?: string[];
}

interface PropriedadePageContentProps {
  id: string;
}

export default function MinhasPropriedadesPage({ id }: PropriedadePageContentProps) {
  const { findById, getPhotosByPropertyId } = usePropertyContext();
  const [property, setProperty] = useState<Property | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [photos, setPhotos] = useState<{ id: string; data: Blob; propertyId: string }[]>([]);

  // Mapas de conversão para exibição amigável
  const typeMap: { [key: string]: string } = {
    HOUSING: 'Moradia',
    SPORTS: 'Espaço Esportivo',
    EVENTS: 'Local para Eventos',
  };

  const operatingModeMap: { [key: string]: string } = {
    PER_NIGHT: 'Por Noite',
    PER_HOUR: 'Por Hora',
    PER_DAY: 'Por Dia',
  };

  useEffect(() => {
    const fetchProperty = async () => {
      try {
        const data = await findById(id);
        const photosData = await getPhotosByPropertyId(id);
        setProperty(data);
        setPhotos(photosData);
      } catch (err: any) {
        console.error('Erro ao buscar propriedade:', err);
        setError(err.message || 'Erro ao carregar os detalhes da propriedade.');
      }
    };
    fetchProperty();
  }, [id, findById]);

  if (error) {
    return <div className="w-full flex flex-col min-h-screen bg-white text-black pt-20 pb-10 px-8 md:px-20"><p className="text-red-500">{error}</p></div>;
  }

  if (!property) {
    return <div className="w-full flex flex-col min-h-screen bg-white text-black pt-20 pb-10 px-8 md:px-20"><p>Carregando...</p></div>;
  }

  return (
    <div className="w-full pt-35 flex flex-col min-h-screen bg-white text-black pb-10 px-8 md:px-20">
      {/* Título e Descrição */}
      <div className="space-y-4 mb-6">
        <p className="text-3xl font-bold"><strong>{property.title}</strong></p>
        <p>{property.description}</p>
      </div>

      {/* Fotos em linha com rolagem horizontal */}
      {photos.length > 0 ? (
        <div className="flex flex-row overflow-x-auto space-x-4 mb-6 scrollbar">
          {photos.map((photo) => {
            const imageUrl = URL.createObjectURL(photo.data);
            return (
              <div key={photo.id} className="w-80 h-60 bg-gray-200 rounded overflow-hidden flex-shrink-0">
                <img
                  src={imageUrl}
                  alt={`Foto`}
                  className="w-full h-full object-cover"
                />
              </div>
            );
          })}
        </div>
      ) : (
        <p className="text-center mb-6">Nenhuma foto encontrada para esta propriedade.</p>
      )}

      {/* Layout com Tipo/Disponibilidade à esquerda e Endereço à direita */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Coluna Esquerda: Tipo e Disponibilidade */}
        <div className="space-y-2">
          <p>
            {typeMap[property.type] || property.type}{' '}
            {property.status === 'AVAILABLE' ? 'Disponível' : 'Indisponível'}
          </p>
        </div>

        {/* Coluna Direita: Endereço */}
        <div className="space-y-2 text-right">
          <p>{`${property.street}, ${property.city}, ${property.state}, ${property.country}, ${property.zipCode}`}</p>
        </div>
      </div>

      {/* Preço */}
      <div className="mt-6">
        <p>
          Preço {property.operatingMode ? operatingModeMap[property.operatingMode] || property.operatingMode : ''} R$ {property.pricePerUnit}
        </p>
      </div>
    </div>
  );
}