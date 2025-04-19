'use client';

import React, { useState, useCallback, useEffect, useRef } from 'react';
import { navigationOptions } from '@/data/navigationOptions';
import PropertyCarousel from '../PropertyCarousel';
import ExperienceCarousel from '../ExperienceCarousel';
import RestaurantCarousel from '../RestaurantCarousel';
import Link from 'next/link';
import { ChevronRightIcon, MapIcon } from '@heroicons/react/24/outline';
import { toast } from 'react-toastify';
import Image from 'next/image';
import { usePathname } from 'next/navigation';

interface ExplorarPageContentProps {
  localPesquisado: string;
  tipoPesquisado: string;
}

export default function ExplorarPageContent({ localPesquisado, tipoPesquisado }: ExplorarPageContentProps) {
  const local = decodeURIComponent(localPesquisado);
  const [selectedOption, setSelectedOption] = useState<string>('explorar');
  const [navWidth, setNavWidth] = useState('auto');
  const navRef = useRef<HTMLDivElement>(null);
  const [isFixed, setIsFixed] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [selectedOptionCombobox, setSelectedOptionCombobox] = useState('Recomendado');
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

  useEffect(() => {
    const handleScroll = () => {
      if (navRef.current) {
        const offsetTop = navRef.current.offsetTop;
        const scrollTop = window.scrollY;

        // Se rolar mais de 180px, fixa a barra
        if (scrollTop > 180) {
          setIsFixed(true);
        } else {
          setIsFixed(false);
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    if (navRef.current) {
      const width = navRef.current.offsetWidth;
      setNavWidth(`${width}px`);
    }
  }, []);

  useEffect(() => {}, [selectedOption]);

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
    <div className="w-full flex flex-col min-h-screen bg-[#1C2534] text-white">
      <section className="px-20 pt-20 bg-white text-gray-900">
        <div className="pt-14">
          {/* Breadcrumb */}
          <div className="inline-flex flex-col justify-start items-start gap-2">
            {/* Título e Resultados */}
            <div className="inline-flex justify-start items-center gap-4">
              <div className="justify-center text-gray-900 text-[40px] font-semibold font-['Urbanist'] leading-[52px]">
                Moradias em {(local).replace(/-/g, ' ')}
              </div>
            </div>
          </div>
        </div>
      </section>
      {/* Conteúdo Dinâmico */}
      <div className="flex-1 bg-white">
        <section className="px-20 bg-white">
          <div className="pt-14">
            <PropertyCarousel properties={properties} text="" />
          </div>
        </section>
        <section className="px-20 bg-white">
          <div className="pt-14">
            <div className="border-t border-[#D0D5DD]" />
          </div>
        </section>
      </div>
    </div>
  );
}
