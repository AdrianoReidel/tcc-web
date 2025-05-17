'use client';

import React, { useEffect, useState } from 'react';
import { usePropertyContext } from '@/context/PropertyContext';
import Calendar from './Calendar'; // Ajuste o caminho conforme necessário

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
  const { findById, getPhotosByPropertyIdSinglePage, reserveProperty } = usePropertyContext();
  const [property, setProperty] = useState<Property | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [photos, setPhotos] = useState<{ id: string; data: Blob; propertyId: string }[]>([]);
  const [startDate, setStartDate] = useState<string>('');
  const [endDate, setEndDate] = useState<string>('');
  const [selectedTime, setSelectedTime] = useState<string>('');
  const [totalPrice, setTotalPrice] = useState<number>(0);

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
        const photosData = await getPhotosByPropertyIdSinglePage(id);
        setProperty(data);
        setPhotos(photosData);
      } catch (err: any) {
        console.error('Erro ao buscar propriedade:', err);
        setError(err.message || 'Erro ao carregar os detalhes da propriedade.');
      }
    };
    fetchProperty();
  }, [id, findById, getPhotosByPropertyIdSinglePage]);

  // Calcular preço com base nas regras específicas
  useEffect(() => {
    if (property && startDate && endDate && property.type !== 'SPORTS') {
      const start = new Date(startDate);
      const end = new Date(endDate);
      const diffTime = Math.abs(end.getTime() - start.getTime());
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1; // Inclui o dia final

      if (property.type === 'HOUSING') {
        // Para hospedagens, conta 1 unidade por noite
        setTotalPrice(diffDays > 1 ? property.pricePerUnit * (diffDays - 1) : 0);
      } else if (property.type === 'EVENTS') {
        // Para eventos, conta o número total de dias (incluso início e fim)
        setTotalPrice(diffDays * property.pricePerUnit);
      }
    } else if (property && startDate && selectedTime && property.type === 'SPORTS') {
      // Para esportes, preço é fixo por horário selecionado
      setTotalPrice(property.pricePerUnit);
    } else {
      setTotalPrice(0);
    }
  }, [startDate, endDate, selectedTime, property]);

  if (error) {
    return <div className="w-full flex flex-col min-h-screen bg-white text-black pt-20 pb-10 px-8 md:px-20"><p className="text-red-500">{error}</p></div>;
  }

  if (!property) {
    return <div className="w-full flex flex-col min-h-screen bg-white text-black pt-20 pb-10 px-8 md:px-20"><p>Carregando...</p></div>;
  }

  const handleReserve = async () => {
    try {
      if (property && (startDate || (startDate && selectedTime))) {
        await reserveProperty(id, {
          startDate: property.type === 'SPORTS' ? startDate : startDate || null,
          endDate: property.type !== 'SPORTS' ? endDate || null : null,
          selectedTime: property.type === 'SPORTS' ? selectedTime || null : null,
        });
      } else {
        alert('Por favor, selecione uma data' + (property.type === 'SPORTS' ? ' e horário' : '') + '.');
      }
    } catch (err: any) {
      alert(err.message || 'Erro ao realizar a reserva.');
    }
  };

  return (
    <div className="w-full flex flex-col min-h-screen bg-white text-black pt-20 pb-10 px-8 md:px-20">
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
      <div className="flex justify-between items-start">
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

      {/* Seção de Reserva Fixa */}
      <div className="w-full bg-gray-100 p-4 shadow-md">
        <div className="flex flex-col md:flex-row items-center justify-center space-y-4 md:space-y-0 md:space-x-4">
          {property.type !== 'SPORTS' ? (
            <div className="flex flex-row space-x-4">
              {/* Calendário e Campo de Data Inicial */}
              <div className="flex flex-col items-center">
                <label className="text-sm font-medium mb-1">Data de Início</label>
                <Calendar selectedDate={startDate} onDateSelect={setStartDate} />
              </div>

              {/* Calendário e Campo de Data Final */}
              <div className="flex flex-col items-center">
                <label className="text-sm font-medium mb-1">Data de Fim</label>
                <Calendar selectedDate={endDate} onDateSelect={setEndDate} />
              </div>
            </div>
          ) : (
            <>
              {/* Calendário para Esportes */}
              <div className="flex flex-col">
                <label className="text-sm font-medium mb-1">Data</label>
                <Calendar selectedDate={startDate} onDateSelect={setStartDate} />
              </div>

              {/* Campo de Data para Esportes */}
              <div className="flex flex-col">
                <label className="text-sm font-medium mb-1">Data Selecionada</label>
                <p className="p-2 rounded-md bg-gray-200">{startDate || 'Nenhuma data'}</p>
              </div>

              {/* Input de Horário */}
              <div className="flex flex-col">
                <label className="text-sm font-medium mb-1">Horário</label>
                <input
                  type="time"
                  value={selectedTime}
                  onChange={(e) => setSelectedTime(e.target.value)}
                  className={`p-2 rounded-md border-2 ${selectedTime ? 'border-blue-500' : 'border-gray-300'} focus:outline-none focus:ring-2 focus:ring-blue-500`}
                />
              </div>

              {/* Campo de Horário */}
              <div className="flex flex-col">
                <label className="text-sm font-medium mb-1">Horário Selecionado</label>
                <p className="p-2 rounded-md bg-gray-200">{selectedTime || 'Nenhum horário'}</p>
              </div>
            </>
          )}
        </div>

        {/* Valor Total e Botão de Alugar */}
        <div className="flex flex-col items-center mt-4 space-y-2">
          <p className="text-lg font-medium">Total: R$ {totalPrice.toFixed(2)}</p>
          <button
            onClick={handleReserve}
            className="px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Alugar
          </button>
        </div>
      </div>
    </div>
  );
}