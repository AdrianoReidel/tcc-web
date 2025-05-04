'use client';

import React, { useEffect, useState } from 'react';
import { usePropertyContext } from '@/context/PropertyContext';
import { CameraIcon, TrashIcon } from '@heroicons/react/16/solid';

export interface PropertyListItem {
  id: string;
  title: string;
  city: string;
  state: string;
  pricePerUnit: number;
  type: string;
}

export default function MinhasPropriedadesPage() {
  const { getMyProperties, deleteProperty, addPhoto, removePhoto, getPhotosByPropertyId } = usePropertyContext();
  const [properties, setProperties] = useState<PropertyListItem[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isManageModalOpen, setIsManageModalOpen] = useState(false);
  const [selectedPropertyId, setSelectedPropertyId] = useState<string | null>(null);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [photos, setPhotos] = useState<{ id: string; data: Blob; propertyId: string }[]>([]);

  // Mapeamento dos valores de type para exibição
  const typeMap: { [key: string]: string } = {
    HOUSING: 'Moradia',
    SPORTS: 'Espaço Esportivo',
    EVENTS: 'Local para Eventos',
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
    // Liberar URLs de objeto ao fechar a modal
    photos.forEach((photo) => URL.revokeObjectURL(URL.createObjectURL(photo.data)));
  };

  const removeFile = (index: number) => {
    setSelectedFiles((prevFiles) => prevFiles.filter((_, i) => i !== index));
  };

  const handleDeletePhoto = async (photoId: string) => {
    try {
      await removePhoto(selectedPropertyId!, photoId); // ! pois selectedPropertyId é garantido como não nulo ao abrir a modal
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
                    onClick={() => {
                      console.log(`Editar propriedade com ID: ${property.id}`);
                    }}
                  >
                    Editar propriedade
                  </button>
                  <button
                    className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600 transition"
                    onClick={() => handleDelete(property.id)}
                  >
                    Excluir propriedade
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
    </div>
  );
}