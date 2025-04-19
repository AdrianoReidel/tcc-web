'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function UnauthorizedPage() {
  const router = useRouter();

  useEffect(() => {
    // Redireciona para /home após 5 segundos
    const timer = setTimeout(() => {
      router.push('/home');
    }, 3000);

    return () => clearTimeout(timer);
  }, [router]);

  return (
    <div className="flex items-center justify-center min-h-screen bg-blue">
      <div className="p-6 bg-white rounded-lg shadow-lg text-center">
        <h1 className="text-4xl font-bold color-orange">Acesso Negado</h1>
        <p className="mt-4 text-xl color-primary">Você não deveria estar aqui!</p>
        <p className="mt-2 text-md color-secondary">Redirecionando para o login...</p>
      </div>
    </div>
  );
}
