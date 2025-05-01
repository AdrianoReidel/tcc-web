'use client';

import React from 'react';
import PropertyCarousel from '../PropertyCarousel';

export default function HomePage() {

  const properties = [
    {
      image: '/images/casa1.png',
      name: 'Hotel Atlântico Prime',
      location: 'Florianópolis, Santa Catarina',
      rating: 4.9,
      reviews: 1765,
      originalPrice: 350,
      discountedPrice: 240,
      discount: -30,
      hasBreakfast: true,
    },
    {
      image: '/images/casa2.png',
      name: 'Beira Mar Hotel',
      location: 'Florianópolis, Santa Catarina',
      rating: 4.9,
      reviews: 1765,
      originalPrice: 400,
      discountedPrice: 300,
      discount: -25,
      hasBreakfast: false,
    },
    {
      image: '/images/casa3.png',
      name: 'Pousada Pôr do Sol',
      location: 'Florianópolis, Santa Catarina',
      rating: 4.9,
      reviews: 1765,
      originalPrice: 500,
      discountedPrice: 400,
      discount: -20,
      hasBreakfast: true,
    },
    {
      image: '/images/casa4.png',
      name: 'Hotel Porto Belo, SC',
      location: 'Porto Belo, Santa Catarina',
      rating: 4.9,
      reviews: 1765,
      originalPrice: 500,
      discountedPrice: 400,
      discount: -20,
      hasBreakfast: false,
    },
    {
      image: '/images/casa1.png',
      name: 'Hotel Atlântico Prime',
      location: 'Florianópolis, Santa Catarina',
      rating: 4.9,
      reviews: 1765,
      originalPrice: 350,
      discountedPrice: 240,
      discount: -30,
      hasBreakfast: true,
    },
    {
      image: '/images/casa2.png',
      name: 'Beira Mar Hotel',
      location: 'Florianópolis, Santa Catarina',
      rating: 4.9,
      reviews: 1765,
      originalPrice: 400,
      discountedPrice: 300,
      discount: -25,
      hasBreakfast: false,
    },
    {
      image: '/images/casa3.png',
      name: 'Pousada Pôr do Sol',
      location: 'Florianópolis, Santa Catarina',
      rating: 4.9,
      reviews: 1765,
      originalPrice: 500,
      discountedPrice: 400,
      discount: -20,
      hasBreakfast: true,
    },
    {
      image: '/images/casa4.png',
      name: 'Hotel Porto Belo, SC',
      location: 'Porto Belo, Santa Catarina',
      rating: 4.9,
      reviews: 1765,
      originalPrice: 500,
      discountedPrice: 400,
      discount: -20,
      hasBreakfast: false,
    },
  ];

  const events = [
    {
      image: '/images/evento1.jpeg',
      name: 'Espaço para casamento/bodas',
      location: 'Santo Ângelo, Rio Grande do Sul',
      rating: 4.5,
      reviews: 3765,
      originalPrice: 4500,
      discountedPrice: 4050,
      discount: -10,
      hasBreakfast: false,
    },
    {
      image: '/images/evento2.png',
      name: 'Casa de Eventos Luxo Dourado',
      location: 'Porto Alegre, Rio Grande do Sul',
      rating: 4.7,
      reviews: 2980,
      originalPrice: 5200,
      discountedPrice: 4680,
      discount: -10,
      hasBreakfast: false,
    },
    {
      image: '/images/evento3.png',
      name: 'Casa de Shows Pedra Alta',
      location: 'Gramado, Rio Grande do Sul',
      rating: 4.8,
      reviews: 4120,
      originalPrice: 6000,
      discountedPrice: 5100,
      discount: -15,
      hasBreakfast: false,
    },
    {
      image: '/images/evento4.jpg',
      name: 'Casa Colonial para Festas e Eventos',
      location: 'Caxias do Sul, Rio Grande do Sul',
      rating: 4.4,
      reviews: 2310,
      originalPrice: 3500,
      discountedPrice: 2975,
      discount: -15,
      hasBreakfast: true,
    },
    {
      image: '/images/evento1.jpeg',
      name: 'Espaço para casamento/bodas',
      location: 'Santo Ângelo, Rio Grande do Sul',
      rating: 4.5,
      reviews: 3765,
      originalPrice: 4500,
      discountedPrice: 4050,
      discount: -10,
      hasBreakfast: false,
    },
    {
      image: '/images/evento2.png',
      name: 'Casa de Eventos Luxo Dourado',
      location: 'Porto Alegre, Rio Grande do Sul',
      rating: 4.7,
      reviews: 2980,
      originalPrice: 5200,
      discountedPrice: 4680,
      discount: -10,
      hasBreakfast: false,
    },
    {
      image: '/images/evento3.png',
      name: 'Casa de Shows Pedra Alta',
      location: 'Gramado, Rio Grande do Sul',
      rating: 4.8,
      reviews: 4120,
      originalPrice: 6000,
      discountedPrice: 5100,
      discount: -15,
      hasBreakfast: false,
    },
    {
      image: '/images/evento4.jpg',
      name: 'Casa Colonial para Festas e Eventos',
      location: 'Caxias do Sul, Rio Grande do Sul',
      rating: 4.4,
      reviews: 2310,
      originalPrice: 3500,
      discountedPrice: 2975,
      discount: -15,
      hasBreakfast: true,
    },
  ];

  const sports = [
    {
      image: '/images/quadra1.jpeg',
      name: 'Quadra Society - Centro',
      location: 'Santo Ângelo, Rio Grande do Sul',
      rating: 4.9,
      reviews: 1765,
      originalPrice: 350,
      discountedPrice: 240,
      discount: -30,
      hasBreakfast: false,
    },
    {
      image: '/images/quadra2.jpeg',
      name: 'Campo de Futebol Society - Praia',
      location: 'Florianópolis, Santa Catarina',
      rating: 4.7,
      reviews: 1350,
      originalPrice: 450,
      discountedPrice: 360,
      discount: -20,
      hasBreakfast: false,
    },
    {
      image: '/images/quadra4.jpeg',
      name: 'Quadra de Padel da areia',
      location: 'Porto Alegre, Rio Grande do Sul',
      rating: 4.6,
      reviews: 980,
      originalPrice: 280,
      discountedPrice: 224,
      discount: -20,
      hasBreakfast: false,
    },
    {
      image: '/images/quadra3.jpeg',
      name: 'Quadra Poliesportiva - Academia',
      location: 'Curitiba, Paraná',
      rating: 4.4,
      reviews: 2100,
      originalPrice: 300,
      discountedPrice: 270,
      discount: -10,
      hasBreakfast: false,
    },
    {
      image: '/images/quadra1.jpeg',
      name: 'Quadra Society - Centro',
      location: 'Santo Ângelo, Rio Grande do Sul',
      rating: 4.9,
      reviews: 1765,
      originalPrice: 350,
      discountedPrice: 240,
      discount: -30,
      hasBreakfast: false,
    },
    {
      image: '/images/quadra2.jpeg',
      name: 'Campo de Futebol Society - Praia',
      location: 'Florianópolis, Santa Catarina',
      rating: 4.7,
      reviews: 1350,
      originalPrice: 450,
      discountedPrice: 360,
      discount: -20,
      hasBreakfast: false,
    },
    {
      image: '/images/quadra4.jpeg',
      name: 'Quadra de Padel da areia',
      location: 'Porto Alegre, Rio Grande do Sul',
      rating: 4.6,
      reviews: 980,
      originalPrice: 280,
      discountedPrice: 224,
      discount: -20,
      hasBreakfast: false,
    },
    {
      image: '/images/quadra3.jpeg',
      name: 'Quadra Poliesportiva - Academia',
      location: 'Curitiba, Paraná',
      rating: 4.4,
      reviews: 2100,
      originalPrice: 300,
      discountedPrice: 270,
      discount: -10,
      hasBreakfast: false,
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
