'use client';

import React, { useEffect, useState } from 'react';
import { usePropertyContext } from '@/context/PropertyContext';
import PropertyCarousel from '../PropertyCarousel';

export default function HomePage() {
  const [housing, setHousing] = useState<any[]>([]);
  const [events, setEvents] = useState<any[]>([]);
  const [sports, setSports] = useState<any[]>([]);
  const [error, setError] = useState<string | null>(null);

  const { getAllProperties } = usePropertyContext();

  useEffect(() => {
    const fetchProperties = async () => {
      try {
        const properties = await getAllProperties(); // Buscar todas as propriedades

        // Mapear os dados para o formato esperado pelo PropertyCarousel
        const mappedProperties = properties.map((property: any) => ({
          id: property.id,
          name: property.title,
          location: `${property.city}, ${property.state}`, // Usar city e state do backend
          price: property.pricePerUnit,
          image: property.type === 'HOUSING' ? '/images/casa1.png' : 
                 property.type === 'EVENTS' ? '/images/evento1.jpeg' : 
                 '/images/quadra1.jpeg', // Imagem fixa com base no type
          type: property.type, // Manter o type para filtragem
        }));

        // Filtrar por tipo
        setHousing(mappedProperties.filter((p: any) => p.type === 'HOUSING'));
        setEvents(mappedProperties.filter((p: any) => p.type === 'EVENTS'));
        setSports(mappedProperties.filter((p: any) => p.type === 'SPORTS'));
      } catch (err: any) {
        setError(err.message || 'Erro ao carregar as propriedades.');
      }
    };

    fetchProperties();
  }, [getAllProperties]);

  return (
    <div className="w-full flex flex-col min-h-screen bg-[#1C2534] text-white pt-10">
      {error && <p className="text-red-500 text-center mb-4">{error}</p>}

      <section className="px-20 bg-white">
        <div className="pt-14">
          <PropertyCarousel properties={housing} text="Moradias" />
        </div>
      </section>

      <section className="px-20 bg-white">
        <div className="pt-14">
          <div className="border-t border-[#D0D5DD] mb-14" />
          <PropertyCarousel properties={events} text="Espaços para Eventos" />
        </div>
      </section>

      <section className="px-20 bg-white">
        <div className="pt-14">
          <div className="border-t border-[#D0D5DD] mb-14" />
          <PropertyCarousel properties={sports} text="Locais para praticar Esportes" />
        </div>
      </section>

      <section className="px-20 bg-white">
        <div className="pt-14">
          <div className="border-t border-[#D0D5DD]" />
        </div>
      </section>
    </div>
  );
}