'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { usePropertyContext } from '@/context/PropertyContext';

interface Account {
  id: number;
  name: string;
  email: string;
  createdAt: Date;
}

export default function MinhaContaPage() {
  const { getMyAccount, deleteMyAccount } = usePropertyContext();
  const [account, setAccount] = useState<Account>();
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const fetchAccount = async () => {
      try {
        const data = await getMyAccount();
        setAccount(data);
      } catch (err: any) {
        console.error('Erro ao carregar reservas do usuário:', err);
        setError(err.message || 'Erro ao carregar reservas');
      }
    };

    fetchAccount();
  }, [getMyAccount]);

  const handleDeleteAccount = async () => {
    if (window.confirm('Tem certeza que deseja excluir sua conta? Esta ação não pode ser desfeita.')) {
      try {
        await deleteMyAccount();
        router.push('/'); // Redirect to homepage after deletion
      } catch (err: any) {
        console.error('Erro ao excluir conta:', err);
        setError(err.message || 'Erro ao excluir conta');
      }
    }
  };

  return (
    <div className="w-full flex flex-col min-h-screen bg-white text-black pt-20 pb-10 px-8 md:px-20">
      <h1 className="text-3xl font-bold text-left mb-6">Minha Conta</h1>

      {error && <p className="text-red-500 mb-4">{error}</p>}

      {account ? (
        <div className="flex flex-col gap-4">
          <p><strong>Nome:</strong> {account.name}</p>
          <p><strong>Email:</strong> {account.email}</p>
          <p><strong>Data de Criação:</strong> {new Date(account.createdAt).toLocaleDateString('pt-BR')}</p>
          <div className="flex flex-col gap-2 mt-6">
            <button
              className="bg-blue-500 w-50 text-white py-2 px-4 rounded hover:bg-blue-600"
              onClick={() => router.push('/minhas-reservas')}
            >
              Minhas Reservas
            </button>
            <button
              className="bg-yellow-500 w-50 text-white py-2 px-4 rounded hover:bg-yellow-600"
              onClick={() => router.push('/minhas-propriedades')}
            >
              Minhas Propriedades
            </button>
            <button
              className="bg-red-500 w-50 text-white py-2 px-4 rounded hover:bg-red-600"
              onClick={handleDeleteAccount}
            >
              Excluir Conta
            </button>
          </div>
        </div>
      ) : (
        !error && <p>Carregando informações da conta...</p>
      )}
    </div>
  );
}