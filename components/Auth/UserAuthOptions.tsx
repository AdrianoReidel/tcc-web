'use client';
import { useState } from 'react';
import { toast } from 'react-toastify';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation'; 

interface AuthModalProps {
  onClose?: () => void;
}

export default function UserAuthOptionsDropdown({ onClose }: AuthModalProps) {
  const router = useRouter();
  const { logout } = useAuth();
  const [error, setError] = useState<string | null>(null);

  const handleLogout = async () => {
    try {
      await logout();
      if (onClose) onClose();
      toast.success('Você saiu da sua conta!');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Erro ao efetuar login');
    }
  };

  const handleClick = () => {
    toast.info('Esta função está em desenvolvimento!');
  };

  const handlePropertiesClick = () => {
    router.push(`/minhas-propriedades`);
    if (onClose) onClose();
  };

  return (
    <div className="absolute right-0 top-full mt-2 z-[1000]">
      <div 
        className="p-4 bg-white shadow-[0px_30px_67px_rgba(0,0,0,0.05)] rounded-xl border border-[#D0D5DD] w-[200px]"
        onClick={e => e.stopPropagation()}
      >
        <div className="flex flex-col space-y-2">
          <button
            className="w-full text-left px-3 py-2 text-[#667085] text-sm font-normal leading-[21px] hover:bg-gray-100 rounded-md transition-colors"
            onClick={handleClick}
          >
            Minhas reservas
          </button>

          <button
            className="w-full text-left px-3 py-2 text-[#667085] text-sm font-normal leading-[21px] hover:bg-gray-100 rounded-md transition-colors"
            onClick={handlePropertiesClick}
          >
            Minhas propriedades
          </button>
          
          <button
            className="w-full text-left px-3 py-2 text-[#667085] text-sm font-normal leading-[21px] hover:bg-gray-100 rounded-md transition-colors"
            onClick={handleLogout}
          >
            Sair da conta
          </button>
        </div>
      </div>
    </div>
  );
}