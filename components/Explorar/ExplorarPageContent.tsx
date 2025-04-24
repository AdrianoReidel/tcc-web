'use client';

import React, { useState, useEffect, useRef } from 'react';
import PropertyCarousel from '../PropertyCarousel';

interface ExplorarPageContentProps {
  localPesquisado: string;
  tipoPesquisado: string;
}

export default function ExplorarPageContent({ tipoPesquisado, localPesquisado }: ExplorarPageContentProps) {
  const local = decodeURIComponent(localPesquisado);
  const [selectedOption, setSelectedOption] = useState<string>('explorar');
  const navRef = useRef<HTMLDivElement>(null);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Fecha o dropdown se clicar fora
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    };

    if (isDropdownOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isDropdownOpen]);

  useEffect(() => {}, [selectedOption]);

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

  const capitalizeFirstLetter = (str: string) => {
    return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
  };
  
  return (
    <div className="w-full flex flex-col min-h-screen bg-[#1C2534] text-white">
      <section className="px-20 pt-20 bg-white text-gray-900">
        <div className="pt-14">
          <div className="inline-flex flex-col justify-start items-start gap-2">
            <div className="inline-flex justify-start items-center gap-4">
              <div className="justify-center text-gray-900 text-[40px] font-semibold font-['Urbanist'] leading-[52px]">
                {capitalizeFirstLetter(tipoPesquisado)} em {(local).replace(/-/g, ' ')}
              </div>
            </div>
          </div>
        </div>
      </section>
      {/* Conteúdo Dinâmico */}
      <div className="flex-1 bg-white">
        <section className="px-20 bg-white">
          <div className="pt-5">
            {tipoPesquisado === 'moradias' && (
              <PropertyCarousel properties={properties} text="" />
            )}
            {tipoPesquisado === 'eventos' && (
              <PropertyCarousel properties={properties} text="" />
            )}
            {tipoPesquisado === 'esportes' && (
              <PropertyCarousel properties={properties} text="" />
            )}
          </div>
        </section>
      </div>
    </div>
  );
}
