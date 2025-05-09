import { useRef } from 'react';
import PropertyCard from './PropertyCard';
import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/24/outline';

const PropertyCarousel = ({ properties, text }) => {
  const carouselRef = useRef(null);
  debugger
  const scrollLeft = () => {
    if (carouselRef.current) {
      carouselRef.current.scrollBy({ left: -300, behavior: 'smooth' });
    }
  };

  const scrollRight = () => {
    if (carouselRef.current) {
      carouselRef.current.scrollBy({ left: 300, behavior: 'smooth' });
    }
  };

  return (
    <div className="relative w-full">
      <h2 className="text-2xl font-semibold text-blue mb-4 urbanist">{text}</h2>
      <div className="relative mt-6">
        {/* Botões de navegação com posição ajustada e ícones customizados */}
        <button
          onClick={scrollLeft}
          className="absolute left-0 top-[35%] transform -translate-y-1/2 bg-white p-2 rounded-full shadow-lg hover:bg-gray-100 z-10"
        >
          <ChevronLeftIcon className="w-6 h-6 text-[#0C111D]" />
        </button>
        <button
          onClick={scrollRight}
          className="absolute right-0 top-[35%] transform -translate-y-1/2 bg-white p-2 rounded-full shadow-lg hover:bg-gray-100 z-10"
        >
          <ChevronRightIcon className="w-6 h-6 text-[#0C111D]" />
        </button>

        {/* Carrossel */}
        <div
          ref={carouselRef}
          className="
            flex
            flex-nowrap
            space-x-6
            overflow-x-auto
            overflow-y-hidden
            scrollbar-hide
            scroll-smooth
            snap-x
            snap-mandatory
            cursor-grab
          "
          style={{
            WebkitOverflowScrolling: 'touch',
            scrollbarWidth: 'none',
          }}
        >
          {properties.map((property, index) => (
            <div key={index} className="flex-shrink-0 snap-start">
              <PropertyCard
                id={property.id}
                image={property.image}
                name={property.name}
                location={property.location}
                price={property.price}
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default PropertyCarousel;
