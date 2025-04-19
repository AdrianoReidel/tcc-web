import React from 'react';
import Image from 'next/image';
import { navigationOptions } from '@/data/navigationOptions';

interface CategoryTitleProps {
  selectedValue: string;
  title?: string;
}

const CategoryTitle: React.FC<CategoryTitleProps> = ({ selectedValue }) => {
  const selectedCategory = navigationOptions.find((option) => option.value === selectedValue);
  if (!selectedCategory || !selectedCategory.title) return null;

  return (
    <div className="h-[64px] md:h-[80px] mb-6 flex items-center justify-center">
      {selectedCategory.value === 'explorar' ? (
        <h1 className="text-4xl md:text-5xl font-bold urbanist leading-none flex items-center">
          <span>Menos gastos, mais&nbsp;</span>
          <span className="relative inline-block">
            <span className="relative z-10">destinos</span>
            <Image
              src="/images/circle.svg"
              alt="Círculo ao redor da palavra destinos"
              width={900}
              height={100}
              className="absolute top-1/2 left-1/2 transform -translate-x-[51%] -translate-y-1/2 z-0"
            />
          </span>
        </h1>
      ) : (
        <h1 className="text-4xl md:text-5xl font-bold urbanist leading-none">{selectedCategory.title}</h1>
      )}
    </div>
  );
};

export default CategoryTitle;
