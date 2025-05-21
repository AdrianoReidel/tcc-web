'use client';

import React, { useEffect, useState } from 'react';
import { usePropertyContext } from '@/context/PropertyContext';
import Calendar from './Calendar';

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
  reservations: { checkIn: Date; checkOut: Date; selectedTime: number }[];
}

interface Review {
  id: number;
  reservationId: string;
  authorName: string;
  rating: number;
  comment: string;
  type: 'GUEST' | 'HOST';
  createdAt: string;
  checkIn: string;
  checkOut: string;
}

interface PropriedadePageContentProps {
  id: string;
}

export default function MinhasPropriedadesPage({ id }: PropriedadePageContentProps) {
  const { findById, getPhotosByPropertyIdSinglePage, reserveProperty, getPropertyReviews } = usePropertyContext();
  const [property, setProperty] = useState<Property | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [photos, setPhotos] = useState<{ id: string; data: Blob; propertyId: string }[]>([]);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [startDate, setStartDate] = useState<string>('');
  const [endDate, setEndDate] = useState<string>('');
  const [selectedTime, setSelectedTime] = useState<string>('');
  const [totalPrice, setTotalPrice] = useState<number>(0);

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

  const timeOptions: string[] = [];
  for (let hour = 8; hour <= 22; hour++) {
    const formattedHour = hour.toString().padStart(2, '0') + ':00';
    timeOptions.push(formattedHour);
  }

  const today = new Date();
  const minDate = today.toISOString().split('T')[0];

  useEffect(() => {
    const fetchPropertyAndReviews = async () => {
      try {
        const [propertyData, photosData, reviewsData] = await Promise.all([
          findById(id),
          getPhotosByPropertyIdSinglePage(id),
          getPropertyReviews(id),
        ]);
        setProperty(propertyData);
        setPhotos(photosData);
        setReviews(reviewsData);
      } catch (err: any) {
        console.error('Erro ao buscar dados:', err);
        setError(err.message || 'Erro ao carregar os detalhes da propriedade ou avaliações.');
      }
    };
    fetchPropertyAndReviews();
  }, [id, findById, getPhotosByPropertyIdSinglePage, getPropertyReviews]);

  useEffect(() => {
    if (property && startDate && endDate && property.type !== 'SPORTS') {
      const start = new Date(startDate);
      const end = new Date(endDate);
      const diffTime = Math.abs(end.getTime() - start.getTime());
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;

      if (property.type === 'HOUSING') {
        setTotalPrice(diffDays > 1 ? property.pricePerUnit * (diffDays - 1) : 0);
      } else if (property.type === 'EVENTS') {
        setTotalPrice(diffDays * property.pricePerUnit);
      }
    } else if (property && startDate && selectedTime && property.type === 'SPORTS') {
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

  // Obter os dias reservados para HOUSING e EVENTS
  const reservedDates: { start: Date; end: Date }[] = property.reservations
    .filter(res => res.checkIn && res.checkOut)
    .map(res => {
      const start = new Date(res.checkIn);
      const end = new Date(res.checkOut);
      // Adicionar 1 dia ao checkOut para incluir o dia final
      end.setDate(end.getDate() + 1);
      return { start, end };
    });

  // Obter os horários reservados para SPORTS na data selecionada
  const reservedTimesForSelectedDate = startDate && property.type === 'SPORTS'
    ? property.reservations
        .filter(res => {
          const reservationDate = new Date(res.checkIn).toISOString().split('T')[0];
          return reservationDate === startDate;
        })
        .map(res => res.selectedTime)
    : [];

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    });
  };

  return (
    <div className="w-full flex flex-col min-h-screen bg-white text-black pt-20 pb-10 px-8 md:px-20">
      <div className="space-y-4 mb-6">
        <p className="text-3xl font-bold"><strong>{property.title}</strong></p>
        <p>{property.description}</p>
      </div>

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

      <div className="flex justify-between items-start">
        <div className="space-y-2">
          <p>
            {typeMap[property.type] || property.type}{' '}
            {property.status === 'AVAILABLE' ? 'Disponível' : 'Indisponível'}
          </p>
        </div>

        <div className="space-y-2 text-right">
          <p>{`${property.street}, ${property.city}, ${property.state}, ${property.country}, ${property.zipCode}`}</p>
        </div>
      </div>

      <div className="mt-6">
        <p>
          Preço {property.operatingMode ? operatingModeMap[property.operatingMode] || property.operatingMode : ''} R$ {property.pricePerUnit}
        </p>
      </div>

      <div className="w-full bg-gray-100 p-4 shadow-md mb-8">
        <div className="flex flex-col md:flex-row items-center justify-center space-y-4 md:space-y-0 md:space-x-4">
          {property.type !== 'SPORTS' ? (
            <div className="flex flex-row space-x-4">
              <div className="flex flex-col items-center">
                <label className="text-sm font-medium mb-1">Data de Início</label>
                <Calendar
                  selectedDate={startDate}
                  onDateSelect={setStartDate}
                  minDate={minDate}
                  reservedDates={reservedDates}
                />
              </div>

              <div className="flex flex-col items-center">
                <label className="text-sm font-medium mb-1">Data de Fim</label>
                <Calendar
                  selectedDate={endDate}
                  onDateSelect={setEndDate}
                  minDate={minDate}
                  reservedDates={reservedDates}
                />
              </div>
            </div>
          ) : (
            <>
              <div className="flex flex-col">
                <label className="text-sm font-medium mb-1">Data</label>
                <Calendar
                  selectedDate={startDate}
                  onDateSelect={setStartDate}
                  minDate={minDate}
                  reservedDates={reservedDates}
                />
              </div>

              <div className="flex flex-col">
                <label className="text-sm font-medium mb-1">Data Selecionada</label>
                <p className="p-2 rounded-md bg-gray-200">{startDate || 'Nenhuma data'}</p>
              </div>

              <div className="flex flex-col">
                <label className="text-sm font-medium mb-1">Horário</label>
                <select
                  value={selectedTime}
                  onChange={(e) => setSelectedTime(e.target.value)}
                  className={`p-2 rounded-md border-2 ${selectedTime ? 'border-blue-500' : 'border-gray-300'} focus:outline-none focus:ring-2 focus:ring-blue-500`}
                  disabled={!startDate}
                >
                  <option value="">Selecione um horário</option>
                  {timeOptions.map((time) => {
                    const hour = parseInt(time.split(':')[0]);
                    const isReserved = reservedTimesForSelectedDate.includes(hour);
                    return (
                      <option key={time} value={time} disabled={isReserved}>
                        {time} {isReserved ? '(Reservado)' : ''}
                      </option>
                    );
                  })}
                </select>
              </div>
            </>
          )}
        </div>

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

      <div className="mt-8">
        <h2 className="text-2xl font-bold text-left mb-4">Avaliações</h2>
        {reviews.length > 0 ? (
          <div className="space-y-6">
            {reviews.map((review) => (
              <div key={review.id} className="border-b border-gray-200 pb-4">
                <div className="flex items-center space-x-2">
                  <p className="font-semibold">{review.authorName}</p>
                  <div className="flex">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <span
                        key={star}
                        className={`text-lg ${review.rating >= star ? 'text-yellow-400' : 'text-gray-300'}`}
                      >
                        ★
                      </span>
                    ))}
                  </div>
                </div>
                <p className="text-gray-600 mt-1">{review.comment}</p>
                <p className="text-sm text-gray-500 mt-1">{formatDate(review.createdAt)}</p>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-600">Nenhuma avaliação disponível para esta propriedade.</p>
        )}
      </div>
    </div>
  );
}