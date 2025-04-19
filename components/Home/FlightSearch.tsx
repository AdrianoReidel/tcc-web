import React, { useState } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { registerLocale } from 'react-datepicker';
import { ptBR } from 'date-fns/locale/pt-BR';

// Register the Portuguese locale
registerLocale('pt-BR', ptBR);

export default function FlightSearch() {
  const [formData, setFormData] = useState({
    origin: '',
    destination: '',
    departureDate: undefined,
    returnDate: undefined,
    travelers: '',
  });

  const handleChange = (e: any) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleDateChange = (date: any, field: any) => {
    setFormData((prev) => ({ ...prev, [field]: date }));
  };

  const handleSubmit = (e: any) => {
    e.preventDefault();
  };

  return (
    <div className="w-full flex justify-center items-center bg-[#1C2534] py-8">
      <form onSubmit={handleSubmit} className="flex items-center space-x-4 max-w-5xl w-full">
        {/* Origin Input */}
        <div className="flex-1">
          <input
            type="text"
            name="origin"
            placeholder="De: Estado, cidade ou aeroporto"
            value={formData.origin}
            onChange={handleChange}
            className="w-full h-14 rounded-[999px] border border-[#D0D5DD] bg-[#1C2534] text-gray-300 placeholder-gray-300 focus:ring-1 focus:ring-white transition-all duration-300 px-6"
          />
        </div>

        {/* Destination Input */}
        <div className="flex-1">
          <input
            type="text"
            name="destination"
            placeholder="Para: Estado, cidade ou aeroporto"
            value={formData.destination}
            onChange={handleChange}
            className="w-full h-14 rounded-[999px] border border-[#D0D5DD] bg-[#1C2534] text-gray-300 placeholder-gray-300 focus:ring-1 focus:ring-white transition-all duration-300 px-6"
          />
        </div>

        {/* Departure Date (Ida) */}
        <div className="flex-1">
          <DatePicker
            selected={formData.departureDate}
            onChange={(date) => handleDateChange(date, 'departureDate')}
            placeholderText="Ida: Selecionar"
            dateFormat="dd/MM/yyyy"
            locale="pt-BR"
            className="w-full h-14 rounded-[999px] border border-[#D0D5DD] bg-[#1C2534] text-gray-300 placeholder-gray-300 focus:ring-1 focus:ring-white transition-all duration-300 px-6"
            wrapperClassName="w-full"
          />
        </div>

        {/* Return Date (Volta) */}
        <div className="flex-1">
          <DatePicker
            selected={formData.returnDate}
            onChange={(date) => handleDateChange(date, 'returnDate')}
            placeholderText="Volta: Selecionar"
            dateFormat="dd/MM/yyyy"
            locale="pt-BR"
            minDate={formData.departureDate}
            className="w-full h-14 rounded-[999px] border border-[#D0D5DD] bg-[#1C2534] text-gray-300 placeholder-gray-300 focus:ring-1 focus:ring-white transition-all duration-300 px-6"
            wrapperClassName="w-full"
          />
        </div>

        {/* Travelers Input */}
        <div className="flex-1">
          <input
            type="text"
            name="travelers"
            placeholder="Viajantes: Selecionar"
            value={formData.travelers}
            onChange={handleChange}
            className="w-full h-14 rounded-[999px] border border-[#D0D5DD] bg-[#1C2534] text-gray-300 placeholder-gray-300 focus:ring-1 focus:ring-white transition-all duration-300 px-6"
          />
        </div>

        {/* Search Button */}
        <button type="submit" className="h-14 px-8 button-orange text-white rounded-[999px] ">
          Buscar
        </button>
      </form>
    </div>
  );
}
