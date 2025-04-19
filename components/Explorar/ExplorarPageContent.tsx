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
  const style = 'invert(0%) sepia(0%) saturate(0%) hue-rotate(0deg) brightness(0%) contrast(100%)';
  const AirplaneIcon = () => (
    <Image src="/icons/airplane.svg" alt="Ícone de avião" width={16} height={16} style={{ filter: style }} />
  );
  const HotelIcon = () => (
    <Image src="/icons/hotel.svg" alt="Ícone de hotel" width={16} height={16} style={{ filter: style }} />
  );
  const CameraIcon = () => (
    <Image src="/icons/camera.svg" alt="Ícone de câmera" width={16} height={16} style={{ filter: style }} />
  );
  const KnifeForkIcon = () => (
    <Image src="/icons/knife-fork.svg" alt="Ícone de garfo e faca" width={16} height={16} style={{ filter: style }} />
  );

  const handleOptionSelect = (option: string) => {
    setSelectedOptionCombobox(option);
    setIsDropdownOpen(false);
  };

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

  const handleClick = () => {
    toast.info('Esta função está em desenvolvimento!');
  };

  const handleSelectOption = useCallback((option: string) => {
    setSelectedOption(option);
  }, []);

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
  const pathname = usePathname();

  useEffect(() => {
    const segments = pathname.split('/').filter(Boolean);
    const section = segments[segments.length - 2];
    if (section && ['hospedagens', 'o-que-fazer', 'restaurantes', 'voos'].includes(section)) {
      setActiveSection(section as 'hospedagens' | 'o-que-fazer' | 'restaurantes' | 'voos');
      setSelectedOption(section);
    } else {
      setActiveSection('explorar');
      setSelectedOption('explorar');
    }
  }, [pathname]);

  const [activeSection, setActiveSection] = useState<
    'explorar' | 'hospedagens' | 'o-que-fazer' | 'restaurantes' | 'voos'
  >('explorar');

  // Opções de navegação
  const navOptions = [
    { label: 'Explorar', path: `/explorar/${local}` },
    { label: 'Hospedagens', path: `/hospedagens/${local}`, icon: <HotelIcon /> },
    { label: 'O que fazer', path: `/o-que-fazer/${local}`, icon: <CameraIcon /> },
    { label: 'Restaurantes', path: `/restaurantes/${local}`, icon: <KnifeForkIcon /> },
    { label: 'Voos', path: `/voos/${local}`, icon: <AirplaneIcon /> },
  ];
  const titleFormats: Record<
    'explorar' | 'hospedagens' | 'o-que-fazer' | 'restaurantes' | 'voos',
    (local: string) => string
  > = {
    explorar: (local) => `Explorar ${local}`,
    hospedagens: (local) => `Hospedagens em ${local}`,
    'o-que-fazer': (local) => `O que fazer em ${local}`,
    restaurantes: (local) => `Restaurantes em ${local}`,
    voos: (local) => `Voos para ${local}`,
  };

  return (
    <div className="w-full flex flex-col min-h-screen bg-[#1C2534] text-white">
      <section className="px-20 pt-20 bg-white text-gray-900">
        <div className="pt-14">
          {/* Breadcrumb */}
          <div className="inline-flex flex-col justify-start items-start gap-2">
            <div className="inline-flex justify-start items-center gap-1">
              <div className="justify-center text-gray-500 text-sm font-normal leading-tight">Brasil</div>
              <ChevronRightIcon className="w-4 h-4 text-gray-500" />
              <div className="justify-center text-gray-500 text-sm font-normal leading-tight">Estado</div>
              <ChevronRightIcon className="w-4 h-4 text-gray-500" />
              <div className="justify-center text-gray-500 text-sm font-normal leading-tight">Cidade</div>
              <ChevronRightIcon className="w-4 h-4 text-gray-500" />
              <div className="justify-center text-gray-500 text-sm font-normal leading-tight">???</div>
            </div>

            {/* Título e Resultados */}
            <div className="inline-flex justify-start items-center gap-4">
              <div className="justify-center text-gray-900 text-[40px] font-semibold font-['Urbanist'] leading-[52px]">
                {titleFormats[activeSection](local).replace(/-/g, ' ')}
              </div>
              <div className="justify-center text-gray-500 text-sm font-normal leading-tight">500 resultados</div>
            </div>
          </div>

          {/* Botões de Navegação e Botão de Mapa */}
          <div
            ref={navRef}
            className={`w-full inline-flex justify-between items-center mt-6 z-50 transition-all duration-300 ${
              isFixed ? 'fixed top-10 left-0 bg-white px-20 py-4 shadow-md' : ''
            }`}
          >
            {/* Botões de Navegação */}
            <div className="flex justify-start items-center gap-2">
              {navOptions.map((option, index) => (
                <Link
                  key={index}
                  href={option.path}
                  className={`px-5 py-3 rounded-[99px] outline outline-1 outline-offset-[-1px] flex justify-center items-center gap-2
                    ${selectedOption === option.label.toLowerCase() ? 'outline-gray-900' : 'outline-gray-300'}`}
                  onClick={() => handleSelectOption(option.label.toLowerCase())}
                >
                  {option.icon}
                  <div className="justify-center text-gray-900 text-sm font-normal leading-tight">{option.label}</div>
                </Link>
              ))}
            </div>
            <div className="flex justify-start items-center gap-2">
              {activeSection !== 'explorar' && (
                <>
                  {/* Botão Filtrar */}
                  <button
                    className="px-5 py-3 rounded-xl flex justify-center items-center gap-2 border border-gray-300 hover:bg-gray-50 transition"
                    onClick={handleClick}
                  >
                    <Image src="/images/setting-config.svg" alt="Ícone de filtro" width={16} height={16} />
                    <div className="text-center text-gray-900 text-sm font-normal leading-tight">Filtrar</div>
                  </button>

                  {/* Combobox */}
                  <div className="relative w-40" ref={dropdownRef}>
                    <button
                      className="w-full px-5 py-3 rounded-xl flex justify-between items-center gap-2 border border-gray-300 hover:bg-gray-50 transition"
                      onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                    >
                      <div className="text-gray-900 text-sm font-normal leading-tight truncate">
                        {selectedOptionCombobox}
                      </div>
                      <Image src="/images/down.svg" alt="Ícone de seta para baixo" width={16} height={16} />
                    </button>

                    {isDropdownOpen && (
                      <div className="absolute z-10 mt-1 w-full bg-white border border-gray-300 rounded-xl shadow-lg">
                        {['Recomendado', 'Todos', 'Mais Alugados'].map((option) => (
                          <button
                            key={option}
                            className={`w-full px-4 py-2 text-left text-sm text-gray-900 hover:bg-gray-100 ${
                              selectedOptionCombobox === option ? 'font-semibold' : ''
                            }`}
                            onClick={() => handleOptionSelect(option)}
                          >
                            {option}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                </>
              )}
              {/* Botão Mostrar Mapa */}
              <button
                className="px-5 py-3 bg-orange-600 rounded-xl flex justify-center items-center gap-2 hover:bg-orange-700 transition"
                onClick={handleClick}
              >
                <MapIcon className="w-4 h-4 text-white" />
                <div className="text-center text-white text-sm font-normal leading-tight">Mostrar mapa</div>
              </button>
            </div>
          </div>
        </div>
      </section>
      {/* Conteúdo Dinâmico */}
      <div className="flex-1 bg-white">
        {activeSection === 'explorar' && (
          <>
            {/* Seções de Carrossel Existentes */}
            <section className="px-20 bg-white">
              <div className="pt-14">
                <PropertyCarousel properties={properties} text="Hospedagens" />
              </div>
            </section>

            <section className="px-20 bg-white">
              <div className="pt-14">
                <div className="border-t border-[#D0D5DD] mb-14" />
                <ExperienceCarousel experiences={properties} text="O que fazer" />
              </div>
            </section>

            <section className="px-20 bg-white">
              <div className="pt-14">
                <div className="border-t border-[#D0D5DD] mb-14" />
                <RestaurantCarousel experiences={properties} text="Melhores restaurantes com desconto" />
              </div>
            </section>

            <section className="px-20 bg-white">
              <div className="pt-14">
                <div className="border-t border-[#D0D5DD]" />
              </div>
            </section>
          </>
        )}

        {activeSection === 'hospedagens' && (
          <></>
        )}

        {activeSection === 'o-que-fazer' && (
          <></>
        )}

        {activeSection === 'restaurantes' && (
          <></>
        )}

        {activeSection === 'voos' && (
          <></>
        )}
      </div>
    </div>
  );
}
