'use client';

import React, { useState } from 'react';

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
    operatingMode: 'Por Hora',
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Dados enviados:', formData);
    // Aqui você pode enviar via fetch/axios para sua API
  };

  return (
    // <div className="w-full flex flex-col min-h-screen bg-[#1C2534] text-white pt-10">
    <div className="w-full flex flex-col min-h-screen bg-white text-black pt-20 px-8 md:px-20">
      <h1 className="text-3xl font-bold mb-6">Cadastrar nova Propriedade/Espaço</h1>
      <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <input
          type="text"
          name="title"
          placeholder="Título"
          value={formData.title}
          onChange={handleChange}
          className="p-3 rounded-md bg-[#2B3A4B] border border-gray-500 placeholder-black"
          required
        />

        <input
          type="text"
          name="street"
          placeholder="Rua"
          value={formData.street}
          onChange={handleChange}
          className="p-3 rounded-md bg-[#2B3A4B] border border-gray-500 placeholder-black"
          required
        />

        <input
          type="text"
          name="city"
          placeholder="Cidade"
          value={formData.city}
          onChange={handleChange}
          className="p-3 rounded-md bg-[#2B3A4B] border border-gray-500 placeholder-black"
          required
        />

        <input
          type="text"
          name="state"
          placeholder="Estado"
          value={formData.state}
          onChange={handleChange}
          className="p-3 rounded-md bg-[#2B3A4B] border border-gray-500 placeholder-black"
          required
        />

        <input
          type="text"
          name="country"
          placeholder="País"
          value={formData.country}
          onChange={handleChange}
          className="p-3 rounded-md bg-[#2B3A4B] border border-gray-500 placeholder-black"
          required
        />

        <input
          type="text"
          name="zipCode"
          placeholder="CEP"
          value={formData.zipCode}
          onChange={handleChange}
          className="p-3 rounded-md bg-[#2B3A4B] border border-gray-500 placeholder-black"
          required
        />

        <input
          type="number"
          name="pricePerUnit"
          placeholder="Preço (ex: R$250.00)"
          value={formData.pricePerUnit}
          onChange={handleChange}
          step="0.01"
          className="p-3 rounded-md bg-[#2B3A4B] border border-gray-500 placeholder-black"
          required
        />

        <select
          name="type"
          value={formData.type}
          onChange={handleChange}
          className="p-3 rounded-md bg-white border border-gray-500 text-black"
        >
          <option value="MORADIA">Moradia</option>
          <option value="EVENTO">Evento</option>
          <option value="ESPORTE">Esporte</option>
        </select>

        <select
          name="operatingMode"
          value={formData.operatingMode}
          onChange={handleChange}
          className="p-3 rounded-md bg-white border border-gray-500 text-black"
        >
          <option value="Por Hora">Por Hora</option>
          <option value="Dia">Por Dia</option>
          <option value="Noite">Por Noite</option>
        </select>

        <select
          name="status"
          value={formData.status}
          onChange={handleChange}
          className="p-3 rounded-md bg-white border border-gray-500 text-black"
        >
          <option value="AVAILABLE">Disponível</option>
          <option value="UNAVAILABLE">Indisponível</option>
        </select>

        <textarea
          name="description"
          placeholder="Descrição da propriedade ou espaço..."
          value={formData.description}
          onChange={handleChange}
          rows={4}
          className="col-span-1 md:col-span-2 p-3 rounded-md bg-white border border-gray-500 placeholder-black"
          required
        />

        <div className="col-span-1 md:col-span-2 flex justify-end">
          <button
            type="submit"
            className="h-11 px-6 rounded-[999px] border-2 border-black text-black bg-transparent"
          >
            Cadastrar
          </button>
        </div>
      </form>
    </div>
  );
}
