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

const RatingModal: React.FC<{
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (rating: number, comment: string, propertyId?: string) => void;
  propertyTitle?: string;
  propertyId?: string;
}> = ({ isOpen, onClose, onSubmit, propertyTitle, propertyId }) => {
  const [rating, setRating] = useState<number>(0);
  const [comment, setComment] = useState<string>('');

  const handleSubmit = () => {
    onSubmit(rating, comment, propertyId);
    setRating(0);
    setComment('');
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
        <h2 className="text-xl font-bold mb-4">Avaliar {propertyTitle}</h2>
        <div className="flex mb-4">
          {[1, 2, 3, 4, 5].map((star) => (
            <button
              key={star}
              onClick={() => setRating(star)}
              className={`text-2xl ${rating >= star ? 'text-yellow-400' : 'text-gray-300'}`}
            >
              ★
            </button>
          ))}
        </div>
        <textarea
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          placeholder="Deixe seu comentário..."
          className="w-full p-2 border rounded mb-4"
          rows={4}
        />
        <div className="flex justify-end gap-2">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
          >
            Cancelar
          </button>
          <button
            onClick={handleSubmit}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            disabled={rating === 0}
          >
            Enviar Avaliação
          </button>
        </div>
      </div>
    </div>
  );
};

export default function MinhasReservasPage() {
  const { getMyReservations, createPropertyRating } = usePropertyContext();
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [selectedReservation, setSelectedReservation] = useState<Reservation | null>(null);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

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
    return `${formatTime(selectedTime)} até as ${formatTime(selectedTime + 1)}`;
  };

  const handleRateClick = (reservation: Reservation) => {
    setSelectedReservation(reservation);
    setIsModalOpen(true);
  };

  const handleRatingSubmit = async (rating: number, comment: string, propertyId?: string) => {
    try {
      if (!propertyId) throw new Error('ID da propriedade não encontrado');
      await createPropertyRating(propertyId, rating, comment);
      console.log(`Avaliação enviada para ${selectedReservation?.propertyTitle}: ${rating} estrelas, Comentário: ${comment}`);
    } catch (err: any) {
      console.error('Erro ao enviar avaliação:', err);
      setError(err.message || 'Erro ao enviar avaliação');
    }
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
            <th className="border p-2 text-left">Ações</th>
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
                <td className="border p-2">
                  <button
                    onClick={() => handleRateClick(reservation)}
                    className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600"
                  >
                    Avaliar
                  </button>
                </td>
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

      <RatingModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleRatingSubmit}
        propertyTitle={selectedReservation?.propertyTitle}
        propertyId={selectedReservation?.propertyId}
      />
    </div>
  );
}