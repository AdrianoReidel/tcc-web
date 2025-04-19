export interface NavigationOption {
  label: string;
  value: string;
  icon?: string;
  title?: string;
  images?: { src: string; alt: string }[];
}

export const navigationOptions: NavigationOption[] = [
  {
    label: 'Explorar',
    value: 'explorar',
    title: 'Menos gastos, mais destinos',
    images: [
      { src: '/images/pool.png', alt: 'Piscina' },
      { src: '/images/ferris-wheel.png', alt: 'Roda gigante' },
      { src: '/images/city.png', alt: 'Cidade' },
      { src: '/images/airplane.png', alt: 'Avião' },
    ],
  },
  {
    label: 'Hospedagens',
    value: 'hospedagens',
    icon: '/icons/hotel.svg',
    title: 'Melhores hospedagens com descontos',
    images: [
      { src: '/images/hotel-pool.png', alt: 'Piscina de hotel' },
      { src: '/images/facade.png', alt: 'Fachada' },
      { src: '/images/bedroom.png', alt: 'Quarto' },
      { src: '/images/hall.png', alt: 'Saguão' },
    ],
  },
  {
    label: 'O que fazer',
    value: 'oquefazer',
    icon: '/icons/camera.svg',
    title: 'Veja o que fazer na sua viagem',
    images: [
      { src: '/images/rollercoaster.png', alt: 'Montanha-russa' },
      { src: '/images/parachute.png', alt: 'Paraquedas' },
      { src: '/images/ship.png', alt: 'Navio' },
      { src: '/images/trail.png', alt: 'Trilha' },
    ],
  },
  {
    label: 'Restaurantes',
    value: 'restaurantes',
    icon: '/icons/knife-fork.svg',
    title: 'Descubra restaurantes incríveis',
    images: [
      { src: '/images/cooking.png', alt: 'Cozinhando' },
      { src: '/images/sushi.png', alt: 'Sushi' },
      { src: '/images/food.png', alt: 'Comida' },
      { src: '/images/food-and-drinks.png', alt: 'Comida e bebidas' },
    ],
  },
  {
    label: 'Voos',
    value: 'voos',
    icon: '/icons/airplane.svg',
    title: 'Garanta o melhor voo para seu destino',
    // images: [ ... ]
  },
];
