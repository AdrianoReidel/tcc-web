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
}

interface PropriedadePageContentProps {
  id: string;
}

export default function MinhasPropriedadesPage({ id }: PropriedadePageContentProps) {
  const { findById } = usePropertyContext();
  const [property, setProperty] = useState<Property | null>(null);
  const [error, setError] = useState<string | null>(null);

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
        setProperty(data);
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
    <div className="w-full flex flex-col min-h-screen bg-white text-black pt-20 pb-10 px-8 md:px-20">
      <h1 className="text-3xl font-bold text-left mb-6">Propriedade: {property.title}</h1>
      <div className="space-y-4">
        <p><strong>ID:</strong> {property.id}</p>
        <p><strong>Título:</strong> {property.title}</p>
        <p><strong>Descrição:</strong> {property.description}</p>
        <p><strong>Tipo:</strong> {typeMap[property.type] || property.type}</p>
        <p><strong>Status:</strong> {property.status === 'AVAILABLE' ? 'Disponível' : 'Indisponível'}</p>
        <p><strong>Endereço:</strong> {`${property.street}, ${property.city}, ${property.state}, ${property.country}, ${property.zipCode}`}</p>
        <p><strong>Preço por Unidade:</strong> R$ {property.pricePerUnit.toFixed(2)}</p>
        <p><strong>ID do Host:</strong> {property.hostId}</p>
        <p><strong>Criado em:</strong> {new Date(property.createdAt).toLocaleDateString()}</p>
        <p><strong>Atualizado em:</strong> {new Date(property.updatedAt).toLocaleDateString()}</p>
        <p><strong>Modo de Operação:</strong> {property.operatingMode ? operatingModeMap[property.operatingMode] || property.operatingMode : 'Não especificado'}</p>
      </div>
    </div>
  );
}