import Image from 'next/image';
import { HeartIcon } from '@heroicons/react/24/outline';
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

  // Função para formatar o nome da propriedade para a URL
  const formatPropertyNameForUrl = (propertyName: string) => {
    return propertyName
      .toLowerCase() // Converter para minúsculas
      .replace(/[^a-z0-9\s-]/g, '') // Remover caracteres especiais, exceto espaços e hífens
      .trim() // Remover espaços no início e no fim
      .replace(/\s+/g, '_') // Substituir espaços por underscores
      .replace(/-+/g, '_'); // Substituir hífens por underscores (caso existam)
  };

  // Função para redirecionar ao clicar no card
  const handleCardClick = () => {
    const formattedName = formatPropertyNameForUrl(name);
    router.push(`/propriedade/${formattedName}/${id}`);
  };

  // Função para o botão de favorito (ainda não implementada)
  const handleFavoriteClick = (e: React.MouseEvent) => {
    e.stopPropagation(); // Impede que o clique no botão de favorito dispare o clique do card
    console.log(`Propriedade ${id} adicionada aos favoritos (funcionalidade não implementada)`);
    // Aqui você pode implementar a lógica para adicionar a propriedade aos favoritos
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
        {/* Ícone de favorito */}
        <button
          className="absolute top-4 right-4 text-white"
          onClick={handleFavoriteClick}
          aria-label="Adicionar aos favoritos"
        >
          <HeartIcon className="w-6 h-6" />
        </button>
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