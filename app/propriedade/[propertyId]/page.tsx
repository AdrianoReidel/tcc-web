'use client';
import PropertyPageContent from '@/components/Propriedades/PropriedadePageContent';

type PageProps = {
  params: any;
};

export default function Page({ params }: PageProps) {
  return <PropertyPageContent id={params.id} />;
}