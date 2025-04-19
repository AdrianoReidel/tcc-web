'use client';
import { useState } from 'react';
import { EyeIcon, EyeSlashIcon } from '@heroicons/react/24/outline';
import { toast } from 'react-toastify';
import { useAuth } from '@/context/AuthContext';

interface AuthModalProps {
  onClose?: () => void;
  isFromHeader?: boolean;
}

export default function UserAuthDropdown({ onClose, isFromHeader = false }: AuthModalProps) {
  const [showPassword, setShowPassword] = useState(false);
  const [isSignUp, setIsSignUp] = useState(false);
  const { login, register } = useAuth();
  const [error, setError] = useState<string | null>(null);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');

  const handleLogin = async (email: string, password: string) => {
    try {
      if (!email || !password) {
        setError('Por favor, preencha o e-mail e senha.');
        return;
      }
      await login(email, password);
      if (onClose) onClose();
      toast.success('Aproveite nossos serviços!');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Erro ao efetuar login');
    }
  };

  const handleSignUp = async (name: string, email: string, password: string) => {
    try {
      if (!email || !password || !name) {
        setError('Por favor, preencha o nome, e-mail e senha.');
        return;
      }
      await register(name, email, password);
      toast.success('Sua conta foi criada com sucesso!');
      await handleLogin(email, password);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Erro ao efetuar cadastro');
    }
  };

  return (
    <div 
      className={`
        ${isFromHeader ? 
          'absolute right-0 top-full mt-2' : 
          'fixed inset-0 flex items-center justify-center bg-black backdrop-blur-sm'
        }
        z-[1000]
      `}
      onClick={!isFromHeader ? onClose : undefined}
    >
      <div 
        className={`
          p-6 bg-white shadow-[0px_30px_67px_rgba(0,0,0,0.05)] 
          rounded-xl border border-[#D0D5DD]
          ${isFromHeader ? 'w-[373px]' : 'w-[456px] cursor-default'}
        `}
        onClick={e => e.stopPropagation()}
      >
          <div className="w-full p-1 bg-[rgba(208,213,221,0.3)] rounded-xl flex mb-6">
          <button 
            className={`flex-1 py-3 px-6 rounded-xl text-center text-sm font-bold font-['Manrope'] leading-[21px] ${!isSignUp ? 'bg-black text-white' : 'text-[#667085] hover:bg-gray-100'}`}
            onClick={() => setIsSignUp(false)}
          >
            Entrar
          </button>
          <button 
            className={`flex-1 py-3 px-6 rounded-xl text-center text-sm font-bold font-['Manrope'] leading-[21px] ${isSignUp ? 'bg-black text-white' : 'text-[#667085] hover:bg-gray-100'}`}
            onClick={() => setIsSignUp(true)}
          >
            Cadastrar
          </button>
        </div>
        
        {/* Campo Nome (apenas no cadastro) */}
        {isSignUp && (
          <div className="w-full mb-4">
            <div className="w-full px-4 py-[14px] bg-white rounded-xl border border-black">
              <input 
                type="text" 
                placeholder="Nome"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full text-black text-sm font-normal leading-[21px] outline-none bg-transparent"
              />
            </div>
          </div>
        )}
        
        {/* Campo E-mail */}
        <div className="w-full mb-4">
          <div className="w-full px-4 py-[14px] bg-white rounded-xl border border-black">
            <input 
              type="email" 
              placeholder="E-mail"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full text-black text-sm font-normal  leading-[21px] outline-none bg-transparent"
            />
          </div>
        </div>
        
        {/* Campo Senha */}
        <div className="w-full mb-4">
          <div className="w-full px-4 py-[14px] bg-white rounded-xl border border-black flex items-center">
            <input 
              type={showPassword ? "text" : "password"} 
              placeholder="Senha"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="flex-1 text-black text-sm font-normal leading-[21px] outline-none bg-transparent"
            />
            <div className="ml-3 relative group">
            <div 
              className="cursor-pointer"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? (
                <EyeSlashIcon className="w-4 h-4 text-black" />
              ) : (
                <EyeIcon className="w-4 h-4 text-black" />
              )}
            </div>
            <span className="absolute left-1/2 -translate-x-1/2 bottom-full mb-1 px-2 py-1 text-xs bg-black text-white rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
              {showPassword ? "Ocultar senha" : "Mostrar senha"}
            </span>
          </div>
          </div>
        </div>
        
        {/* Botão Principal */}
        <button 
          className="w-full py-4 px-8 bg-black rounded-xl text-white text-base font-normal leading-[24px] mb-6 hover:bg-gray"
          onClick={() => isSignUp ? handleSignUp(name, email, password) : handleLogin(email, password)}
        >
          {isSignUp ? 'Cadastrar' : 'Entrar'}
        </button>
        {error && (
          <div className="text-black text-sm mb-4 text-center">
            {error}
          </div>
        )}
      </div>
    </div>
  );
}