'use client';

import React, { useState, useEffect, useRef } from 'react';
import { usePropertyContext } from '@/context/PropertyContext';
import PropertyCarousel from '../PropertyCarousel';

interface Property {
  id: string;
  name: string;
  location: string;
  price: number;
  image: string;
  type: string;
  photoId?: string;
}

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
  const [properties, setProperties] = useState<Property[]>([]);
  const [error, setError] = useState<string | null>(null);

  const { searchProperties, getPhotoDataById } = usePropertyContext();

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

  // Buscar propriedades com base nos parâmetros
  useEffect(() => {
    const fetchProperties = async () => {
      try {
        // Mapear tipoPesquisado para o formato do backend (HOUSING, EVENTS, SPORTS)
        const typeMap: { [key: string]: string } = {
          moradias: 'HOUSING',
          eventos: 'EVENTS',
          esportes: 'SPORTS',
        };
        const type = typeMap[tipoPesquisado.toLowerCase()];
  
        const propertiesData = await searchProperties(localPesquisado, type);
  
        // Mapear os dados para o formato esperado pelo PropertyCarousel
        const mappedProperties = await Promise.all(
          propertiesData.map(async (property: any) => {
            let imageUrl = '/images/casa1.png'; // Imagem padrão como fallback
  
            if (property.photoId) {
              try {
                const photoBlob = await getPhotoDataById(property.photoId); // Buscar BLOB
                imageUrl = URL.createObjectURL(photoBlob); // Criar URL de objeto
              } catch (error) {
                console.error(`Erro ao carregar imagem para photoId ${property.photoId}:`, error);
              }
            }
  
            return {
              id: property.id,
              name: property.title,
              location: `${property.city}, ${property.state}`,
              price: parseFloat(property.pricePerUnit),
              image: imageUrl, // URL da imagem ou padrão
              type: property.type,
            };
          })
        );
  
        setProperties(mappedProperties);
  
        // Limpar URLs de objeto quando o componente for desmontado
        return () => {
          mappedProperties.forEach((p) => {
            if (p.image.startsWith('blob:')) {
              URL.revokeObjectURL(p.image); // Liberar memória
            }
          });
        };
      } catch (err: any) {
        console.error('Erro ao buscar propriedades:', err);
        setError(err.message || 'Erro ao carregar as propriedades.');
      }
    };
  
    fetchProperties();
  }, [localPesquisado, tipoPesquisado, searchProperties, getPhotoDataById]);

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
                {capitalizeFirstLetter(tipoPesquisado)} em {local.replace(/-/g, ' ')}
              </div>
            </div>
          </div>
        </div>
      </section>
      {/* Conteúdo Dinâmico */}
      <div className="flex-1 bg-white">
        <section className="px-20 bg-white">
          <div className="pt-5">
            {error && <p className="text-red-500 text-center mb-4">{error}</p>}
            <PropertyCarousel properties={properties} text="" />
          </div>
        </section>
      </div>
    </div>
  );
}