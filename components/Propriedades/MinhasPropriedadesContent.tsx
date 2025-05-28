'use client';

import React, { useEffect, useState, useCallback } from 'react';
import { usePropertyContext } from '@/context/PropertyContext';
import { CameraIcon, TrashIcon } from '@heroicons/react/16/solid';

export interface PropertyListItem {
  id: string;
  title: string;
  city: string;
  state: string;
  pricePerUnit: number;
  type: string;
  description: string;
  operatingMode?: string;
}

export interface PropertyUpdateData {
  title: string;
  pricePerUnit: number;
  type: string;
  description: string;
  operatingMode: string;
  image?: File | null;
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
  guestName?: string;
  guestId?: string;
}

export default function MinhasPropriedadesPage() {
  const { getMyProperties, deleteProperty, addPhoto, removePhoto, getPhotosByPropertyId, updateProperty, getPropertyReviews, getReservationsByPropertyId, createGuestRating } = usePropertyContext();
  const [properties, setProperties] = useState<PropertyListItem[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isManageModalOpen, setIsManageModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isReviewsModalOpen, setIsReviewsModalOpen] = useState(false);
  const [isReservationsModalOpen, setIsReservationsModalOpen] = useState(false);
  const [selectedPropertyId, setSelectedPropertyId] = useState<string | null>(null);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [photos, setPhotos] = useState<{ id: string; data: Blob; propertyId: string }[]>([]);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [formData, setFormData] = useState<PropertyUpdateData>({
    title: '',
    pricePerUnit: 0,
    type: 'MORADIA',
    description: '',
    operatingMode: 'Por Noite',
    image: null,
  });

  const typeMap: { [key: string]: string } = {
    HOUSING: 'Moradia',
    SPORTS: 'Espaço Esportivo',
    EVENTS: 'Local para Eventos',
  };

  const typeToBackendMap: { [key: string]: string } = {
    MORADIA: 'HOUSING',
    EVENTO: 'EVENTS',
    ESPORTE: 'SPORTS',
  };

  const operatingModeToBackendMap: { [key: string]: string } = {
    'Por Noite': 'PER_NIGHT',
    'Por Hora': 'PER_HOUR',
    'Por Dia': 'PER_DAY',
  };

  useEffect(() => {
    const fetchProperties = async () => {
      try {
        const data = await getMyProperties();
        setProperties(data);
      } catch (err: any) {
        console.error('Erro ao carregar propriedades do usuário:', err);
        setError(err.message || 'Erro ao carregar propriedades');
      }
    };

    fetchProperties();
  }, [getMyProperties]);

  const handleDelete = async (id: string) => {
    try {
      await deleteProperty(id);
      setProperties(properties.filter((property) => property.id !== id));
      setSuccess('Propriedade excluída com sucesso!');
      setError(null);
      setTimeout(() => setSuccess(null), 3000);
    } catch (err: any) {
      console.error('Erro ao excluir propriedade:', err);
      setError(err.message || 'Erro ao excluir propriedade');
      setSuccess(null);
    }
  };

  const handleAddPhotoClick = (id: string) => {
    setSelectedPropertyId(id);
    setIsAddModalOpen(true);
  };

  const handleManagePhotosClick = async (id: string) => {
    setSelectedPropertyId(id);
    try {
      const photosData = await getPhotosByPropertyId(id);
      setPhotos(photosData);
      setIsManageModalOpen(true);
    } catch (err: any) {
      console.error('Erro ao carregar fotos:', err);
      setError(err.message || 'Erro ao carregar fotos da propriedade.');
    }
  };

  const handleEditPropertyClick = (id: string) => {
    const property = properties.find(p => p.id === id);
    if (property) {
      setFormData({
        title: property.title,
        pricePerUnit: property.pricePerUnit,
        type: property.type,
        description: property.description || '',
        operatingMode: property.operatingMode || 'Por Noite',
        image: null,
      });
      setSelectedPropertyId(id);
      setIsEditModalOpen(true);
    }
  };

  const handleReviewsClick = async (id: string) => {
    setSelectedPropertyId(id);
    try {
      const reviewsData = await getPropertyReviews(id);
      setReviews(reviewsData);
      setIsReviewsModalOpen(true);
    } catch (err: any) {
      console.error('Erro ao carregar avaliações:', err);
      setError(err.message || 'Erro ao carregar avaliações da propriedade.');
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    if (name === 'image') {
      const input = e.target as HTMLInputElement;
      const files = input.files;
      if (files && files.length > 0) {
        setFormData(prev => ({ ...prev, image: files[0] }));
      }
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: name === 'pricePerUnit' ? parseFloat(value) : value,
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedPropertyId) return;

    try {
      const dataToSend = new FormData();
      dataToSend.append('title', formData.title);
      dataToSend.append('pricePerUnit', formData.pricePerUnit.toString());
      dataToSend.append('type', typeToBackendMap[formData.type] || formData.type);
      dataToSend.append('description', formData.description);
      dataToSend.append('operatingMode', operatingModeToBackendMap[formData.operatingMode] || formData.operatingMode);
      if (formData.image) {
        dataToSend.append('image', formData.image);
      }

      await updateProperty(selectedPropertyId, dataToSend);
      setSuccess('Propriedade atualizada com sucesso!');
      setError(null);
      setIsEditModalOpen(false);
      setTimeout(() => setSuccess(null), 3000);

      const updatedProperties = properties.map(p =>
        p.id === selectedPropertyId ? { ...p, ...formData, pricePerUnit: formData.pricePerUnit } : p
      );
      setProperties(updatedProperties);
    } catch (err: any) {
      console.error('Erro ao atualizar propriedade:', err);
      setError(err.message || 'Erro ao atualizar propriedade');
      setSuccess(null);
    }
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      const filesArray = Array.from(event.target.files);
      setSelectedFiles((prevFiles) => [...prevFiles, ...filesArray]);
    }
  };

  const handleSavePhoto = async () => {
    if (!selectedPropertyId || selectedFiles.length === 0) {
      setError('Selecione uma propriedade e pelo menos uma imagem.');
      return;
    }

    try {
      for (const file of selectedFiles) {
        await addPhoto(selectedPropertyId, file);
      }
      setSuccess('Fotos adicionadas com sucesso!');
      setError(null);
      setIsAddModalOpen(false);
      setSelectedFiles([]);
      setTimeout(() => setSuccess(null), 3000);
    } catch (err: any) {
      console.error('Erro ao adicionar fotos:', err);
      setError(err.message || 'Erro ao adicionar fotos.');
      setSuccess(null);
    }
  };

  const handleCloseAddModal = () => {
    setIsAddModalOpen(false);
    setSelectedFiles([]);
    setError(null);
  };

  const handleCloseManageModal = () => {
    setIsManageModalOpen(false);
    setPhotos([]);
    setError(null);
    photos.forEach((photo) => URL.revokeObjectURL(URL.createObjectURL(photo.data)));
  };

  const handleCloseReviewsModal = () => {
    setIsReviewsModalOpen(false);
    setReviews([]);
    setError(null);
  };

  const handleDeletePhoto = async (photoId: string) => {
    try {
      await removePhoto(selectedPropertyId!, photoId);
      setPhotos(photos.filter((photo) => photo.id !== photoId));
      setSuccess('Foto removida com sucesso!');
      setError(null);
      setTimeout(() => setSuccess(null), 3000);
    } catch (err: any) {
      console.error('Erro ao remover foto:', err);
      setError(err.message || 'Erro ao remover foto.');
      setSuccess(null);
    }
  };

  const removeFile = (index: number) => {
    setSelectedFiles((prevFiles) => prevFiles.filter((_, i) => i !== index));
  };

  const handleReservationsClick = async (id: string) => {
    setSelectedPropertyId(id);
    try {
      const reservationsData = await getReservationsByPropertyId(id);
      setReservations(reservationsData);
      setIsReservationsModalOpen(true);
    } catch (err: any) {
      console.error('Erro ao carregar reservas:', err);
      setError(err.message || 'Erro ao carregar reservas da propriedade.');
    }
  };

  const handleCloseReservationsModal = () => {
    setIsReservationsModalOpen(false);
    setReservations([]);
    setError(null);
  };

  const formatTime = (hour: number) => {
    if (hour === 0) return 'N/A';
    return `${hour.toString().padStart(2, '0')}:00`;
  };

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    });
  };

  const formatDateReserve = (date: Date) => {
    return new Date(date).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    });
  };

  const RatingModal: React.FC<{
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (rating: number, comment: string, propertyId?: string, guestId?: string) => void;
  propertyTitle?: string;
  propertyId?: string;
  }> = ({ isOpen, onClose, onSubmit, propertyTitle, propertyId }) => {
    const [rating, setRating] = useState<number>(0);
    const [comment, setComment] = useState<string>('');

    const handleSubmit = () => {
      onSubmit(rating, comment, propertyId, selectedReservation?.guestId);
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

  const handleRatingSubmit = async (rating: number, comment: string, propertyId?: string, guestId?: string) => {
    try {
      if (!propertyId) throw new Error('ID da propriedade não encontrado');
      await createGuestRating(propertyId, guestId, rating, comment);
      console.log(`Avaliação enviada para ${selectedReservation?.propertyTitle}: ${rating} estrelas, Comentário: ${comment}`);
    } catch (err: any) {
      console.error('Erro ao enviar avaliação:', err);
      setError(err.message || 'Erro ao enviar avaliação');
    }
  };

  const [selectedReservation, setSelectedReservation] = useState<Reservation | null>(null);
  const [isModalReviewOpen, setIsModalReviewOpen] = useState<boolean>(false);

  const handleRateClick = (reservation: Reservation) => {
    setSelectedReservation(reservation);
    setIsModalReviewOpen(true);
  };

  return (
    <div className="w-full flex flex-col min-h-screen bg-white text-black pt-20 pb-10 px-8 md:px-20">
      <h1 className="text-3xl font-bold text-left mb-6">Minhas Propriedades</h1>

      {error && <p className="text-red-500 mb-4">{error}</p>}
      {success && <p className="text-green-500 mb-4">{success}</p>}

      <table className="w-full border-collapse border border-gray-300">
        <thead className="bg-gray-100">
          <tr>
            <th className="border p-2 text-left"></th>
            <th className="border p-2 text-left">Título</th>
            <th className="border p-2 text-left">Endereço</th>
            <th className="border p-2 text-left">Tipo</th>
            <th className="border p-2 text-left">Valor</th>
            <th className="border p-2 text-left">Ações</th>
          </tr>
        </thead>
        <tbody>
          {Array.isArray(properties) && properties.length > 0 ? (
            properties.map((property, index) => (
              <tr key={property.id} className="hover:bg-gray-50">
                <td className="border p-2">{index + 1}</td>
                <td className="border p-2">{property.title}</td>
                <td className="border p-2">{property.city}, {property.state}</td>
                <td className="border p-2">{typeMap[property.type] || property.type}</td>
                <td className="border p-2">R$ {property.pricePerUnit.toFixed(2)}</td>
                <td className="border p-2 space-x-2">
                  <button
                    className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 transition"
                    onClick={() => handleEditPropertyClick(property.id)}
                  >
                    Editar
                  </button>
                  <button
                    className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600 transition"
                    onClick={() => handleDelete(property.id)}
                  >
                    Excluir
                  </button>
                  <button
                    className="px-1 py-1 bg-yellow-500 text-white rounded hover:bg-yellow-600 transition"
                    onClick={() => handleAddPhotoClick(property.id)}
                  >
                    <CameraIcon className="w-5 h-5 inline-block text-white" /> Adicionar Fotos
                  </button>
                  <button
                    className="px-3 py-1 bg-green-500 text-white rounded hover:bg-green-600 transition"
                    onClick={() => handleManagePhotosClick(property.id)}
                  >
                    Gerenciar Fotos
                  </button>
                  <button
                    className="px-3 py-1 bg-purple-500 text-white rounded hover:bg-purple-600 transition"
                    onClick={() => handleReviewsClick(property.id)}
                  >
                    Avaliações
                  </button>
                  <button
                    className="px-3 py-1 bg-teal-500 text-white rounded hover:bg-teal-600 transition"
                    onClick={() => handleReservationsClick(property.id)}
                  >
                    Ver Reservas
                  </button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={6} className="border p-2 text-center">
                Nenhuma propriedade encontrada
              </td>
            </tr>
          )}
        </tbody>
      </table>

      {isAddModalOpen && (
        <div
          className="fixed inset-0 bg-black/50 bg-opacity-30 flex items-center justify-center z-50"
          onClick={handleCloseAddModal}
        >
          <div
            className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md"
            onClick={(e) => e.stopPropagation()}
          >
            <h2 className="text-xl font-bold mb-4">Adicionar Foto</h2>
            <label htmlFor="image-upload" className="block p-3 rounded-md bg-white border border-gray-500 text-gray-500 cursor-pointer mb-4">
              <CameraIcon className="w-5 h-5 inline-block text-black mr-2" /> Escolha uma ou mais imagens para adicionar
              <input
                id="image-upload"
                type="file"
                accept="image/*"
                multiple
                onChange={handleFileChange}
                className="absolute w-0 h-0 opacity-0"
              />
            </label>
            {selectedFiles.length > 0 && (
              <table className="w-full border-collapse mb-4">
                <thead>
                  <tr className="bg-gray-100">
                    <th className="border p-2 text-left">Nome do Arquivo</th>
                    <th className="border p-2 text-center">Ação</th>
                  </tr>
                </thead>
                <tbody>
                  {selectedFiles.map((file, index) => (
                    <tr key={index} className="hover:bg-gray-50">
                      <td className="border p-2">{file.name}</td>
                      <td className="border p-2 text-center">
                        <button
                          className="px-2 py-1 bg-red-500 text-white rounded hover:bg-red-600"
                          onClick={() => removeFile(index)}
                        >
                          Remover
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
            <div className="flex justify-end space-x-4">
              <button
                className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
                onClick={handleCloseAddModal}
              >
                Cancelar
              </button>
              <button
                className="px-4 py-2 bg-black text-white rounded hover:bg-gray-900"
                onClick={handleSavePhoto}
              >
                Salvar
              </button>
            </div>
          </div>
        </div>
      )}

      {isManageModalOpen && (
        <div
          className="fixed inset-0 bg-black/50 bg-opacity-30 flex items-center justify-center z-50"
          onClick={handleCloseManageModal}
        >
          <div
            className="bg-white p-6 rounded-lg shadow-lg w-full max-w-2xl flex flex-col max-h-[80vh]"
            onClick={(e) => e.stopPropagation()}
          >
            <h2 className="text-xl font-bold mb-4">Gerenciar Fotos - {properties.find(p => p.id === selectedPropertyId)?.title}</h2>
            {photos.length > 0 ? (
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4 overflow-y-auto max-h-[60vh]">
                {photos.map((photo) => {
                  const imageUrl = URL.createObjectURL(photo.data);
                  return (
                    <div key={photo.id} className="relative">
                      <img
                        src={imageUrl}
                        alt={`Foto da propriedade ${selectedPropertyId}`}
                        className="w-full h-40 object-cover rounded"
                      />
                      <button
                        className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                        onClick={() => handleDeletePhoto(photo.id)}
                      >
                        <TrashIcon className="w-5 h-5" />
                      </button>
                    </div>
                  );
                })}
              </div>
            ) : (
              <p className="text-center">Nenhuma foto encontrada para esta propriedade.</p>
            )}
            <div className="flex justify-end mt-4">
              <button
                className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
                onClick={handleCloseManageModal}
              >
                Fechar
              </button>
            </div>
          </div>
        </div>
      )}

      {isEditModalOpen && (
        <div
          className="fixed inset-0 bg-black/50 bg-opacity-30 flex items-center justify-center z-50"
          onClick={() => setIsEditModalOpen(false)}
        >
          <div
            className="bg-white p-6 rounded-lg shadow-lg max-h-[75vh] max-w-3xl"
            onClick={(e) => e.stopPropagation()}
          >
            <h2 className="text-xl font-bold mb-4">Editar Propriedade</h2>
            <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <input
                type="text"
                name="title"
                placeholder="Título"
                value={formData.title}
                onChange={handleChange}
                className="p-3 rounded-md bg-[#2B3A4B] border border-gray-500 placeholder-gray-500"
                required
              />
              <input
                type="number"
                name="pricePerUnit"
                placeholder="Preço (ex: R$250.00)"
                value={formData.pricePerUnit}
                onChange={handleChange}
                step="0.01"
                className="p-3 rounded-md bg-[#2B3A4B] border border-gray-500 placeholder-gray-500"
                required
              />
              <select
                name="type"
                value={formData.type}
                onChange={handleChange}
                className="p-3 rounded-md bg-white border border-gray-500 text-gray-700"
              >
                <option value="MORADIA">Moradia</option>
                <option value="EVENTO">Evento</option>
                <option value="ESPORTE">Esporte</option>
              </select>
              <select
                name="operatingMode"
                value={formData.operatingMode}
                onChange={handleChange}
                className="p-3 rounded-md bg-white border border-gray-500 text-gray-700"
              >
                <option value="Por Noite">Por Noite</option>
                <option value="Por Hora">Por Hora</option>
                <option value="Por Dia">Por Dia</option>
              </select>
              <label htmlFor="image" className="p-3 rounded-md bg-white border border-gray-500 text-gray-500 cursor-pointer">
                <CameraIcon className="w-5 h-5 inline-block text-black" /> Escolha uma imagem apenas se quiser alterar a capa
                <input
                  type="file"
                  id="image"
                  name="image"
                  accept="image/*"
                  onChange={handleChange}
                  className="hidden"
                />
              </label>
              <textarea
                name="description"
                placeholder="Descrição da propriedade ou espaço..."
                value={formData.description}
                onChange={handleChange}
                rows={4}
                className="col-span-1 md:col-span-2 p-3 rounded-md bg-white border border-gray-500 placeholder-gray-500"
                required
              />
              <div className="col-span-1 md:col-span-2 flex justify-end">
                <button
                  type="submit"
                  className="h-8 px-6 mb-5 rounded-[999px] border-2 border-black text-black bg-transparent hover:bg-gray-200"
                >
                  Salvar Alterações
                </button>
                <button
                  type="button"
                  className="ml-2 h-8 px-6 mb-5 rounded-[999px] border-2 border-black text-white bg-black hover:bg-gray-900"
                  onClick={() => setIsEditModalOpen(false)}
                >
                  Cancelar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {isReviewsModalOpen && (
        <div
          className="fixed inset-0 bg-black/50 bg-opacity-30 flex items-center justify-center z-50"
          onClick={handleCloseReviewsModal}
        >
          <div
            className="bg-white p-6 rounded-lg shadow-lg w-full max-w-2xl flex flex-col max-h-[80vh]"
            onClick={(e) => e.stopPropagation()}
          >
            <h2 className="text-xl font-bold mb-4">Avaliações - {properties.find(p => p.id === selectedPropertyId)?.title}</h2>
            {reviews.length > 0 ? (
              <div className="overflow-y-auto max-h-[60vh]">
                <table className="w-full border-collapse border border-gray-300">
                  <thead className="bg-gray-100">
                    <tr>
                      <th className="border p-2 text-left">Autor</th>
                      <th className="border p-2 text-left">Nota</th>
                      <th className="border p-2 text-left">Comentário</th>
                      <th className="border p-2 text-left">Data</th>
                    </tr>
                  </thead>
                  <tbody>
                    {reviews.map((review) => (
                      <tr key={review.id} className="hover:bg-gray-50">
                        <td className="border p-2">{review.authorName}</td>
                        <td className="border p-2">{review.rating} ★</td>
                        <td className="border p-2">{review.comment}</td>
                        <td className="border p-2">{formatDate(review.createdAt)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <p className="text-center">Nenhuma avaliação encontrada para esta propriedade.</p>
            )}
            <div className="flex justify-end mt-4">
              <button
                className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
                onClick={handleCloseReviewsModal}
              >
                Fechar
              </button>
            </div>
          </div>
        </div>
      )}

      {isReservationsModalOpen && (
        <div
          className="fixed inset-0 bg-black/50 bg-opacity-30 flex items-center justify-center z-50"
          onClick={handleCloseReservationsModal}
        >
          <div
            className="bg-white p-6 rounded-lg shadow-lg w-full max-w-4xl flex flex-col max-h-[130vh]"
            onClick={(e) => e.stopPropagation()}
          >
            <h2 className="text-xl font-bold mb-4">Reservas - {properties.find(p => p.id === selectedPropertyId)?.title}</h2>
            {reservations.length > 0 ? (
              <div className="overflow-y-auto max-h-[60vh]">
                <table className="w-full border-collapse border border-gray-300">
                  <thead className="bg-gray-100">
                    <tr>
                      <th className="border p-2 text-left">Hóspede</th>
                      <th className="border p-2 text-left">Avaliações</th>
                      <th className="border p-2 text-left">Check-in</th>
                      <th className="border p-2 text-left">Check-out</th>
                      <th className="border p-2 text-left">Horário</th>
                      <th className="border p-2 text-left">Status</th>
                      <th className="border p-2 text-left">Ações</th>
                    </tr>
                  </thead>
                  <tbody>
                    {reservations.map((reservation) => (
                      <tr key={reservation.id} className="hover:bg-gray-50">
                        <td className="border p-2">{reservation.guestName || 'Desconhecido'}</td>
                        <td className="border p-2">
                          <button
                            className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600"
                          >
                            Ver 
                          </button>
                        </td>
                        <td className="border p-2">{formatDateReserve(reservation.checkIn)}</td>
                        <td className="border p-2">{reservation.checkOut ? formatDateReserve(reservation.checkOut) : '-'}</td>
                        <td className="border p-2">{reservation.selectedTime ? formatTime(reservation.selectedTime) : '-'}</td>
                        <td className="border p-2">{reservation.status}</td>
                        <td className="border p-2">
                          <button
                            onClick={() => handleRateClick(reservation)}
                            className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600"
                          >
                            Avaliar
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <p className="text-center">Nenhuma reserva encontrada para esta propriedade.</p>
            )}
            <div className="flex justify-end mt-4">
              <button
                className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
                onClick={handleCloseReservationsModal}
              >
                Fechar
              </button>
            </div>
          </div>
        </div>
      )}
      <RatingModal
        isOpen={isModalReviewOpen}
        onClose={() => setIsModalReviewOpen(false)}
        onSubmit={handleRatingSubmit}
        propertyTitle={selectedReservation?.guestName}
        propertyId={selectedReservation?.propertyId}
      />
    </div>
  );
}