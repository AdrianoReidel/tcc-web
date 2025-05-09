//app/propriedade/[propertyId]/page.tsx

'use client';
import PropertyPageContent from '@/components/Propriedades/PropriedadePageContent';

type PageProps = {
  params: {
    propertyId: string;
  };
};

export default function Page({ params }: PageProps) {
  return <PropertyPageContent id={params.propertyId} />;
}