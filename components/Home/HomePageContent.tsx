'use client';

import React, { useState, useEffect } from 'react';
import { navigationOptions } from '@/data/navigationOptions';
import PropertyCarousel from '../PropertyCarousel';
import ExperienceCarousel from '../ExperienceCarousel';
import RestaurantCarousel from '../RestaurantCarousel';

export default function HomePage() {
  const [selectedOption, setSelectedOption] = useState('explorar');

  useEffect(() => {
  }, [selectedOption]);

  const selectedCategory = navigationOptions.find((option) => option.value === selectedOption);
  const images = selectedCategory?.images || [];

  const properties = [
    {
      image: '/images/hotel-teste.png',
      name: 'Hotel Atlântico Prime',
      location: 'Florianópolis, Santa Catarina',
      rating: 4.9,
      reviews: 1765,
      originalPrice: 350,
      discountedPrice: 180,
      discount: -30,
      hasBreakfast: true,
    },
    {
      image: '/images/hotel-teste.png',
      name: 'Ibis Hotel',
      location: 'Florianópolis, Santa Catarina',
      rating: 4.9,
      reviews: 1765,
      originalPrice: 350,
      discountedPrice: 350,
      discount: -30,
      hasBreakfast: false,
    },
    {
      image: '/images/hotel-teste.png',
      name: 'Pousada',
      location: 'Florianópolis, Santa Catarina',
      rating: 4.9,
      reviews: 1765,
      originalPrice: 350,
      discountedPrice: 350,
      discount: -30,
      hasBreakfast: true,
    },
    {
      image: '/images/hotel-teste.png',
      name: 'Hotel em Chapecó, SC',
      location: 'Florianópolis, Santa Catarina',
      rating: 4.9,
      reviews: 1765,
      originalPrice: 350,
      discountedPrice: 350,
      discount: -30,
      hasBreakfast: false,
    },
    {
      image: '/images/hotel-teste.png',
      name: 'Hotel em Chapecó, SC',
      location: 'Florianópolis, Santa Catarina',
      rating: 4.9,
      reviews: 1765,
      originalPrice: 350,
      discountedPrice: 350,
      discount: -30,
      hasBreakfast: false,
    },
    {
      image: '/images/hotel-teste.png',
      name: 'Hotel Atlântico Prime',
      location: 'Florianópolis, Santa Catarina',
      rating: 4.9,
      reviews: 1765,
      originalPrice: 350,
      discountedPrice: 180,
      discount: -30,
      hasBreakfast: true,
    },
    {
      image: '/images/hotel-teste.png',
      name: 'Ibis Hotel',
      location: 'Florianópolis, Santa Catarina',
      rating: 4.9,
      reviews: 1765,
      originalPrice: 350,
      discountedPrice: 350,
      discount: -30,
      hasBreakfast: false,
    },
    {
      image: '/images/hotel-teste.png',
      name: 'Pousada',
      location: 'Florianópolis, Santa Catarina',
      rating: 4.9,
      reviews: 1765,
      originalPrice: 350,
      discountedPrice: 350,
      discount: -30,
      hasBreakfast: true,
    },
    {
      image: '/images/hotel-teste.png',
      name: 'Hotel em Chapecó, SC',
      location: 'Florianópolis, Santa Catarina',
      rating: 4.9,
      reviews: 1765,
      originalPrice: 350,
      discountedPrice: 350,
      discount: -30,
      hasBreakfast: false,
    },
    {
      image: '/images/hotel-teste.png',
      name: 'Hotel em Chapecó, SC',
      location: 'Florianópolis, Santa Catarina',
      rating: 4.9,
      reviews: 1765,
      originalPrice: 350,
      discountedPrice: 350,
      discount: -30,
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
          <ExperienceCarousel experiences={properties} text="Espaços para Eventos" />
        </div>
      </section>

      <section className="px-20 bg-white">
        <div className="pt-14">
          <div className="border-t border-[#D0D5DD] mb-14" />
          <RestaurantCarousel experiences={properties} text="Locais para praticar Esportes" />
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
