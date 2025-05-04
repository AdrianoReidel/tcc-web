'use client';

import React, { useEffect, useState } from 'react';
import { usePropertyContext } from '@/context/PropertyContext';
import { CameraIcon } from '@heroicons/react/16/solid';

export interface PropertyListItem {
  id: string;
  title: string;
  city: string;
  state: string;
  pricePerUnit: number;
  type: string;
}

export default function MinhasPropriedadesPage() {
  const { getMyProperties, deleteProperty, addPhoto } = usePropertyContext();
  const [properties, setProperties] = useState<PropertyListItem[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedPropertyId, setSelectedPropertyId] = useState<string | null>(null);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);

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
    setIsModalOpen(true);
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
      setIsModalOpen(false);
      setSelectedFiles([]);
      setTimeout(() => setSuccess(null), 3000);
    } catch (err: any) {
      console.error('Erro ao adicionar fotos:', err);
      setError(err.message || 'Erro ao adicionar fotos.');
      setSuccess(null);
    }
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedFiles([]);
    setError(null);
  };

  const removeFile = (index: number) => {
    setSelectedFiles((prevFiles) => prevFiles.filter((_, i) => i !== index));
  };

  return (
    <div className="w-full flex flex-col min-h-screen bg-white text-black pt-20 pb-10 px-8 md:px-20">
      <h1 className="text-3xl font-bold text-left mb-6">Minhas Propriedades</h1>

      {error && <p className="text-red-500 mb-4">{error}</p>}
      {success && <p className="text-green-500 mb-4">{success}</p>}

      <table className="w-full border-collapse border border-gray-300">
        <thead className="bg-gray-100">
          <tr>
            <th className="border p-2 text-left">Nº</th>
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

      {isModalOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
          onClick={handleCloseModal}
        >
          <div
            className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md"
            onClick={(e) => e.stopPropagation()} // Impede que o clique no modal feche
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
                onClick={handleCloseModal}
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
    </div>
  );
}