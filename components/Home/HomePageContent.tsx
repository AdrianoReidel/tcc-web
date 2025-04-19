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
      discountedPrice: 240,
      discount: -30,
      hasBreakfast: true,
    },
    {
      image: '/images/denis.jpg',
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
      image: '/images/francis.jpg',
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
      image: '/images/baldasso.jpg',
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
      image: '/images/hotel-teste.png',
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
      image: '/images/denis.jpg',
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
      image: '/images/francis.jpg',
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
      image: '/images/baldasso.jpg',
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
