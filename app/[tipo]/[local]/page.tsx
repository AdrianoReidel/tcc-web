'use client';
import ExplorarPageContent from '@/components/Explorar/ExplorarPageContent';
import { notFound } from 'next/navigation';

type PageProps = {
  params: any;
};

export default function Page({ params }: PageProps) {
  // Lista de tipos de rota válidos
  const validTypes = ['moradias', 'eventos', 'esportes'];

  // Valida o tipo de rota, retorna 404 se inválido
  if (!validTypes.includes(params.tipo)) {
    notFound();
  }

  return <ExplorarPageContent tipoPesquisado={params.tipo} localPesquisado={params.local} />;
}