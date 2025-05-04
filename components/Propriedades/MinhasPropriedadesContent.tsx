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
  const { getMyProperties, deleteProperty } = usePropertyContext();
  const [properties, setProperties] = useState<PropertyListItem[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

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
      // Limpar mensagem de sucesso após 3 segundos
      setTimeout(() => setSuccess(null), 3000);
    } catch (err: any) {
      console.error('Erro ao excluir propriedade:', err);
      setError(err.message || 'Erro ao excluir propriedade');
      setSuccess(null);
    }
  };

  return (
    <div className="w-full flex flex-col min-h-screen bg-white text-black pt-20 pb-10 px-8 md:px-20">
      <h1 className="text-3xl font-bold text-left mb-6">Minhas Propriedades</h1>

      {error && <p className="text-red-500 mb-4">{error}</p>}

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
                      /* Ação futura de edição usando property.id */
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
                    onClick={() => {
                      /* Ação futura de exclusão usando property.id */
                      console.log(`Excluir propriedade com ID: ${property.id}`);
                    }}
                  >
                    <CameraIcon className="w-5 h-5 inline-block text-white" /> 
                    Adicionar Fotos
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
    </div>
  );
}