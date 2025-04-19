import React from 'react';
import Image from 'next/image';

interface ImageBannerProps {
  images: { src: string; alt: string }[];
}

const ImageBanner: React.FC<ImageBannerProps> = ({ images }) => {
  if (images.length !== 4) {
    console.error('O componente ImageBanner requer exatamente 4 imagens.');
    return null;
  }

  // Aspect ratio para as imagens do banner (ex.: 360/553)
  const aspectRatio = 360 / 553;

  return (
    <div className="relative w-full h-[553px] overflow-visible mt-14">
      {/* Container das 4 imagens */}
      <div className="flex h-full w-full">
        {images.map((img, index) => (
          <div key={index} className="relative w-1/4 h-full" style={{ aspectRatio: `${aspectRatio}` }}>
            <Image src={img.src} alt={img.alt} fill style={{ objectFit: 'cover' }} quality={100} priority />
          </div>
        ))}
      </div>

      {/* Overlay da ellipse usando fill.
          O container é definido com altura calculada proporcional à largura da tela,
          isto é: altura = (100vw * 42 / 1440).
          Assim, a imagem se ajusta automaticamente sem extrapolar os limites. */}
      <div
        className="absolute top-0 left-0 w-full pointer-events-none z-10"
        style={{ height: 'calc(100vw * 42 / 1440)' }}
      >
        <Image
          src="/images/ellipse.png"
          alt="Curve overlay"
          fill
          quality={100}
          priority
          style={{ objectFit: 'contain' }}
        />
      </div>
    </div>
  );
};

export default ImageBanner;
