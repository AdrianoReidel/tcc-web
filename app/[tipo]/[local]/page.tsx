'use client';
import ExplorarPageContent from '@/components/Explorar/ExplorarPageContent';
import { notFound } from 'next/navigation';

type PageProps = {
  params: { tipo: string; local: string };
};

export default function Page({ params }: PageProps) {
  // Lista de tipos de rota válidos
  const validTypes = ['explorar', 'hospedagens', 'o-que-fazer', 'restaurantes', 'voos'];

  // Valida o tipo de rota, retorna 404 se inválido
  if (!validTypes.includes(params.tipo)) {
    notFound();
  }

  return <ExplorarPageContent localPesquisado={params.local} tipoPesquisado={params.tipo} />;
}