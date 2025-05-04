'use client';

import { usePropertyContext } from '@/context/PropertyContext';
import React, { useState } from 'react';
import { CameraIcon  } from '@heroicons/react/24/outline';

export default function CadastrarPage() {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    type: 'MORADIA',
    status: 'AVAILABLE',
    street: '',
    city: '',
    state: '',
    country: 'Brasil',
    zipCode: '',
    pricePerUnit: '',
    operatingMode: 'Por Noite',
    image: null as File | null,
  });
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const { register } = usePropertyContext();

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value, files } = e.target as HTMLInputElement;
    if (name === 'image' && files && files[0]) {
      if (!files[0].type.startsWith('image/')) {
        setError('Por favor, selecione um arquivo de imagem válido (ex: PNG, JPG).');
        return;
      }
      setFormData({ ...formData, image: files[0] });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    // Validar pricePerUnit
    if (!formData.pricePerUnit || isNaN(parseFloat(formData.pricePerUnit))) {
      setError('O preço por unidade deve ser um número válido.');
      return;
    }

    // Validar imagem
    if (!formData.image) {
      setError('Por favor, selecione uma imagem para a propriedade.');
      return;
    }

    try {
      await register(formData);
      setSuccess('Propriedade cadastrada com sucesso!');
    } catch (error: any) {
      setError(error.message || 'Erro ao cadastrar a propriedade. Tente novamente.');
    }
  };

  return (
    <div className="w-full flex flex-col min-h-screen bg-white text-black pt-20 px-8 md:px-20">
      <h1 className="text-3xl font-bold text-left mb-6">Cadastrar nova Propriedade/Espaço</h1>
      {/* Exibir mensagem de sucesso ou erro */}
      {error && <p className="text-red-500 mb-4">{error}</p>}
      {success && <p className="text-green-500 mb-4">{success}</p>}

      <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <input
          type="text"
          name="title"
          placeholder="Título"
          value={formData.title}
          onChange={handleChange}
          className="p-3 rounded-md bg-[#2B3A4B] border border-gray-500 placeholder-gray"
          required
        />

        <input
          type="text"
          name="street"
          placeholder="Rua"
          value={formData.street}
          onChange={handleChange}
          className="p-3 rounded-md bg-[#2B3A4B] border border-gray-500 placeholder-gray"
          required
        />

        <input
          type="text"
          name="city"
          placeholder="Cidade"
          value={formData.city}
          onChange={handleChange}
          className="p-3 rounded-md bg-[#2B3A4B] border border-gray-500 placeholder-gray"
          required
        />

        <input
          type="text"
          name="state"
          placeholder="Estado"
          value={formData.state}
          onChange={handleChange}
          className="p-3 rounded-md bg-[#2B3A4B] border border-gray-500 placeholder-gray"
          required
        />

        <input
          type="text"
          name="country"
          placeholder="País"
          value={formData.country}
          onChange={handleChange}
          className="p-3 rounded-md bg-[#2B3A4B] border border-gray-500 placeholder-gray"
          required
        />

        <input
          type="text"
          name="zipCode"
          placeholder="CEP"
          value={formData.zipCode}
          onChange={handleChange}
          className="p-3 rounded-md bg-[#2B3A4B] border border-gray-500 placeholder-gray"
          required
        />

        <input
          type="number"
          name="pricePerUnit"
          placeholder="Preço (ex: R$250.00)"
          value={formData.pricePerUnit}
          onChange={handleChange}
          step="0.01"
          className="p-3 rounded-md bg-[#2B3A4B] border border-gray-500 placeholder-gray"
          required
        />

        <select
          name="type"
          value={formData.type}
          onChange={handleChange}
          className="p-3 rounded-md bg-white border border-gray-500 text-gray"
        >
          <option value="MORADIA">Moradia</option>
          <option value="EVENTO">Evento</option>
          <option value="ESPORTE">Esporte</option>
        </select>

        <select
          name="operatingMode"
          value={formData.operatingMode}
          onChange={handleChange}
          className="p-3 rounded-md bg-white border border-gray-500 text-gray"
        >
          <option value="Por Noite">Por Noite</option>
          <option value="Por Hora">Por Hora</option>
          <option value="Por Dia">Por Dia</option>
        </select>

        <label htmlFor="image" className="p-3 rounded-md bg-white border border-gray-500 text-gray-500 cursor-pointer">
          <CameraIcon className="w-5 h-5 inline-block text-black" /> Escolha uma imagem para identificar sua propriedade 
          <input
            type="file"
            id="image"
            name="image"
            accept="image/*"
            onChange={handleChange}
            className="hidden"
            required
          />
        </label>


        <textarea
          name="description"
          placeholder="Descrição da propriedade ou espaço..."
          value={formData.description}
          onChange={handleChange}
          rows={4}
          className="col-span-1 md:col-span-2 p-3 rounded-md bg-white border border-gray-500 placeholder-gray"
          required
        />

        <div className="col-span-1 md:col-span-2 flex justify-end">
          <button
            type="submit"
            className="h-11 px-6 mb-5 rounded-[999px] border-2 border-black text-black bg-transparent"
          >
            Cadastrar
          </button>
        </div>
      </form>
    </div>
  );
}