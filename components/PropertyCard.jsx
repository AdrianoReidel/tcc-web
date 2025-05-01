import Image from 'next/image';
import { HeartIcon } from '@heroicons/react/24/outline';

const PropertyCard = ({
  image,
  name,
  location,
  price,
  hasBreakfast,
}) => {
  return (
    <div className="relative w-full  rounded-lg overflow-hidden ">
      {/* Imagem do hotel */}
      <div className="relative  w-72 h-72">
        <Image src={image} alt={name} layout="fill" objectFit="cover" className="rounded-t-lg w-72 h-72" />
        {/* Ícone de favorito */}
        <button className="absolute top-4 right-4 text-white">
          <HeartIcon className="w-6 h-6" />
        </button>
      </div>

      {/* Detalhes do hotel */}
      <div className="space-y-2 mt-2">
        <h3 className="self-stretch justify-center text-gray-900 text-base font-normal leading-normal">{name}</h3>
        <p className="self-stretch justify-center text-gray-500 text-sm font-normal leading-tight">{location}</p>

        {hasBreakfast && (
          <p className="self-stretch justify-center text-gray-500 text-sm font-normal leading-tight">
            Café da manhã incluso
          </p>
        )}
        <div className="mt-2 flex items-center justify-between">
          <div className="space-x-2">
            <span className="justify-center text-gray-900 text-base font-normal leading-normal">
              R${price}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PropertyCard;
