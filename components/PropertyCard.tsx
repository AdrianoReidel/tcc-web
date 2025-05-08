import Image from 'next/image';
import { useRouter } from 'next/navigation'; 

interface PropertyCardProps {
  id: string;
  image: string;
  name: string;
  location: string;
  price: number;
}

const PropertyCard = ({ id, image, name, location, price }: PropertyCardProps) => {
  const router = useRouter();

  const handleCardClick = () => {
    router.push(`/propriedade/${id}`);
  };

  return (
    <div
      className="relative w-72 rounded-lg overflow-hidden bg-white shadow-md cursor-pointer"
      onClick={handleCardClick}
    >
      {/* Imagem da propriedade */}
      <div className="relative w-72 h-72">
        <Image
          src={image}
          alt={name}
          layout="fill"
          objectFit="cover"
          className="rounded-t-lg"
        />
      </div>

      {/* Detalhes da propriedade */}
      <div className="p-4 space-y-2">
        <h3 className="text-gray-900 text-base font-normal leading-normal">{name}</h3>
        <p className="text-gray-500 text-sm font-normal leading-tight">{location}</p>
        <div className="mt-2 flex items-center justify-between">
          <div className="space-x-2">
            <span className="text-gray-900 text-base font-normal leading-normal">
              R${price.toFixed(2)}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PropertyCard;