'use client';

import React from 'react';
import PropertyCarousel from '../PropertyCarousel';

export default function HomePage() {

  const properties = [
    {
      image: '/images/casa1.png',
      name: 'Hotel Atlântico Prime',
      location: 'Florianópolis, Santa Catarina',
      price: 350,
    },
    {
      image: '/images/casa2.png',
      name: 'Beira Mar Hotel',
      location: 'Florianópolis, Santa Catarina',
      price: 400,
    },
    {
      image: '/images/casa3.png',
      name: 'Pousada Pôr do Sol',
      location: 'Florianópolis, Santa Catarina',
      price: 500,
    },
    {
      image: '/images/casa4.png',
      name: 'Hotel Porto Belo, SC',
      location: 'Porto Belo, Santa Catarina',
      price: 500,
    },
    {
      image: '/images/casa1.png',
      name: 'Hotel Atlântico Prime',
      location: 'Florianópolis, Santa Catarina',
      price: 350,
    },
    {
      image: '/images/casa2.png',
      name: 'Beira Mar Hotel',
      location: 'Florianópolis, Santa Catarina',
      price: 400,
    },
    {
      image: '/images/casa3.png',
      name: 'Pousada Pôr do Sol',
      location: 'Florianópolis, Santa Catarina',
      price: 500,
    },
    {
      image: '/images/casa4.png',
      name: 'Hotel Porto Belo, SC',
      location: 'Porto Belo, Santa Catarina',
      price: 500,
    },
  ];

  const events = [
    {
      image: '/images/evento1.jpeg',
      name: 'Espaço para casamento/bodas',
      location: 'Santo Ângelo, Rio Grande do Sul',
      price: 4500,
    },
    {
      image: '/images/evento2.png',
      name: 'Casa de Eventos Luxo Dourado',
      location: 'Porto Alegre, Rio Grande do Sul',
      price: 5200,
    },
    {
      image: '/images/evento3.png',
      name: 'Casa de Shows Pedra Alta',
      location: 'Gramado, Rio Grande do Sul',
      price: 6000,
    },
    {
      image: '/images/evento4.jpg',
      name: 'Casa Colonial para Festas e Eventos',
      location: 'Caxias do Sul, Rio Grande do Sul',
      price: 3500,
    },
    {
      image: '/images/evento1.jpeg',
      name: 'Espaço para casamento/bodas',
      location: 'Santo Ângelo, Rio Grande do Sul',
      price: 4500,
    },
    {
      image: '/images/evento2.png',
      name: 'Casa de Eventos Luxo Dourado',
      location: 'Porto Alegre, Rio Grande do Sul',
      price: 5200,
    },
    {
      image: '/images/evento3.png',
      name: 'Casa de Shows Pedra Alta',
      location: 'Gramado, Rio Grande do Sul',
      price: 6000,
    },
    {
      image: '/images/evento4.jpg',
      name: 'Casa Colonial para Festas e Eventos',
      location: 'Caxias do Sul, Rio Grande do Sul',
      price: 3500,
    },
  ];

  const sports = [
    {
      image: '/images/quadra1.jpeg',
      name: 'Quadra Society - Centro',
      location: 'Santo Ângelo, Rio Grande do Sul',
      price: 350,
    },
    {
      image: '/images/quadra2.jpeg',
      name: 'Campo de Futebol Society - Praia',
      location: 'Florianópolis, Santa Catarina',
      price: 450,
    },
    {
      image: '/images/quadra4.jpeg',
      name: 'Quadra de Padel da areia',
      location: 'Porto Alegre, Rio Grande do Sul',
      price: 280,
    },
    {
      image: '/images/quadra3.jpeg',
      name: 'Quadra Poliesportiva - Academia',
      location: 'Curitiba, Paraná',
      price: 300,
    },
    {
      image: '/images/quadra1.jpeg',
      name: 'Quadra Society - Centro',
      location: 'Santo Ângelo, Rio Grande do Sul',
      price: 350,
    },
    {
      image: '/images/quadra2.jpeg',
      name: 'Campo de Futebol Society - Praia',
      location: 'Florianópolis, Santa Catarina',
      price: 450,
    },
    {
      image: '/images/quadra4.jpeg',
      name: 'Quadra de Padel da areia',
      location: 'Porto Alegre, Rio Grande do Sul',
      price: 280,
    },
    {
      image: '/images/quadra3.jpeg',
      name: 'Quadra Poliesportiva - Academia',
      location: 'Curitiba, Paraná',
      price: 300,
    },
  ];

  return (
    <div className="w-full flex flex-col min-h-screen bg-[#1C2534] text-white pt-10">
      <section className="px-20 bg-white">
        <div className="pt-14">
          <PropertyCarousel properties={properties} text="Moradias" />
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
