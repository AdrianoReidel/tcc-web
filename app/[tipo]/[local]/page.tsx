'use client';
import ExplorarPageContent from '@/components/Explorar/ExplorarPageContent';
import { notFound } from 'next/navigation';

type Params = {
  tipo: string;
  local: string;
};

export default async function Page({ params }: { params: Promise<Params> }) {

  const {tipo, local} = await params;
  const validTypes = ['moradias', 'eventos', 'esportes'];

  if (!validTypes.includes(tipo)) notFound();
  return <ExplorarPageContent tipoPesquisado={tipo} localPesquisado={local} />;
}
