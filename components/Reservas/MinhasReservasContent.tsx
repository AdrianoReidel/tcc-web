'use client';

import React, { useEffect, useState } from 'react';
import { usePropertyContext } from '@/context/PropertyContext';

interface Reservation {
  id?: string;
  propertyId?: string;
  propertyTitle?: string;
  propertyType?: string;
  checkIn: Date;
  checkOut: Date;
  selectedTime: number;
  totalPrice?: number;
  status?: string;
}

export default function MinhasReservasPage() {
  const { getMyReservations } = usePropertyContext();
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [error, setError] = useState<string | null>(null);

  const typeMap: { [key: string]: string } = {
    HOUSING: 'Moradia',
    SPORTS: 'Espaço Esportivo',
    EVENTS: 'Local para Eventos',
  };

  const statusMap: { [key: string]: string } = {
    PENDING: 'Pendente',
    PAID: 'Pago',
    CANCELED: 'Cancelado',
  };

  useEffect(() => {
    const fetchReservations = async () => {
      try {
        const data = await getMyReservations();
        setReservations(data);
      } catch (err: any) {
        console.error('Erro ao carregar reservas do usuário:', err);
        setError(err.message || 'Erro ao carregar reservas');
      }
    };

    fetchReservations();
  }, [getMyReservations]);

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    });
  };

  const formatTime = (hour: number) => {
    if (hour === 0) return 'N/A';
    return `${hour.toString().padStart(2, '0')}:00`;
  };

  const getTimeDescription = (propertyType?: string, selectedTime: number = 0) => {
    if (!propertyType) return 'N/A';
    if (propertyType === 'HOUSING') return 'Por Noite';
    if (propertyType === 'EVENTS') return 'Durante o(s) dia(s)';
    return formatTime(selectedTime) + ' até as ' + formatTime(selectedTime+1);
  };

  return (
    <div className="w-full flex flex-col min-h-screen bg-white text-black pt-20 pb-10 px-8 md:px-20">
      <h1 className="text-3xl font-bold text-left mb-6">Minhas Reservas</h1>

      {error && <p className="text-red-500 mb-4">{error}</p>}

      <table className="w-full border-collapse border border-gray-300">
        <thead className="bg-gray-100">
          <tr>
            <th className="border p-2 text-left"></th>
            <th className="border p-2 text-left">Nome Propriedade</th>
            <th className="border p-2 text-left">Datas</th>
            <th className="border p-2 text-left">Horário</th>
            <th className="border p-2 text-left">Tipo de Propriedade</th>
            <th className="border p-2 text-left">Valor Pago</th>
            <th className="border p-2 text-left">Status</th>
          </tr>
        </thead>
        <tbody>
          {Array.isArray(reservations) && reservations.length > 0 ? (
            reservations.map((reservation, index) => (
              <tr key={reservation.id} className="hover:bg-gray-50">
                <td className="border p-2">{index + 1}</td>
                <td className="border p-2">{reservation.propertyTitle}</td>
                <td className="border p-2">{formatDate(reservation.checkIn)} até {formatDate(reservation.checkOut)}</td>
                <td className="border p-2">{getTimeDescription(reservation.propertyType, reservation.selectedTime)}</td>
                <td className="border p-2">{typeMap[reservation.propertyType || ''] || reservation.propertyType || 'Não informado'}</td>
                <td className="border p-2">R$ {(reservation.totalPrice || 0).toFixed(2)}</td>
                <td className="border p-2">{statusMap[reservation.status || ''] || reservation.status || 'Não informado'}</td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={8} className="border p-2 text-center">
                Nenhuma reserva encontrada
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}