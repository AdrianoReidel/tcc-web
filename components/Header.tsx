'use client';
import Image from 'next/image';
import { useState, useEffect, useRef } from 'react';
import AuthModal from './Auth/UserAuth';
import AuthOptionsModal from './Auth/UserAuthOptions';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { XMarkIcon, MagnifyingGlassIcon, HomeIcon } from '@heroicons/react/24/solid';
import { usePathname } from 'next/navigation';

export default function Header() {
  const { isLogged } = useAuth();
  const [isUserDropdownOpen, setIsUserDropdownOpen] = useState(false);
  const [isUserOptionsDropdownOpen, setIsUserOptionsDropdownOpen] = useState(false);
  const [isInputFocused, setIsInputFocused] = useState(false);
  const userDropdownRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const pathname = usePathname();
  const [inputValue, setInputValue] = useState('');
  const router = useRouter();
  const [selectedCategory, setSelectedCategory] = useState('');

  const validTypes = ['moradias', 'eventos', 'esportes'];
  const segments = pathname?.split('/').filter(Boolean);
  const firstSegment = segments?.[0];

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (userDropdownRef.current && !userDropdownRef.current.contains(event.target as Node)) {
        setIsUserDropdownOpen(false);
        setIsUserOptionsDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleClearFocus = () => {
    if (inputRef.current) {
      inputRef.current.value = '';
      inputRef.current.blur();
    }
  };

  const handleSearch = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    
    const trimmed = inputValue.trim();
    if (trimmed) {
      const formattedSearch = trimmed.replace(/\s+/g, '-');
      const encodedSearch = encodeURIComponent(formattedSearch);
      const lowercaseCategory = selectedCategory.toLowerCase();
      router.push(`/${lowercaseCategory}/${encodedSearch}`);
    }
  };
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
  };

  return (
    <header className="header w-full bg-gray-300 text-white shadow-md flex h-16 items-center gap-8 px-20 self-stretch text-sm font-normal ">
      <button
        onClick={() => {
          router.push('/home');
          setSelectedCategory('');
        }}
      >
        <HomeIcon className="w-5 h-5 text-black" />
      </button>
      {/* Search Bar */}
      <div className="flex-1 w-full">
        <div className="relative flex items-center w-full h-11 border border-[#000000] rounded-[999px] focus-within:ring-1 focus-within:ring-[#000000] transition-all duration-300">
          {/* Input */}
          <input
            ref={inputRef}
            type="text"
            value={inputValue}
            onChange={handleInputChange}
            placeholder="Digite uma cidade..."
            className="flex-1 h-full pl-6 pr-2 text-sm font-normal text-[#000000] placeholder-[#000000] bg-transparent focus:outline-none"
            onFocus={() => setIsInputFocused(true)}
            onBlur={() => setIsInputFocused(false)}
          />

          {/* Category Buttons and Magnifying Glass */}
          <div className="flex items-center h-full gap-1.5 pr-5">
            {/* Category Buttons */}
            {['Moradias', 'Eventos', 'Esportes'].map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`h-8 px-3 rounded-[999px] text-xs font-medium transition-all duration-300 ${
                  selectedCategory === category
                    ? 'bg-black text-white border-black'
                    : 'border border-[#000000] text-[#000000] hover:bg-gray-100'
                }`}
              >
                {category}
              </button>
            ))}

            {/* Clear Button (when focused) */}
            {isInputFocused && inputValue && (
              <button
                onMouseDown={handleClearFocus}
                className="p-2 rounded-full flex items-center justify-center z-10"
                aria-label="Limpar pesquisa"
              >
                <XMarkIcon className="w-5 h-5 text-[#000000]" />
              </button>
            )}

            {/* Magnifying Glass Button */}
            <button
              onClick={handleSearch}
              className="p-2 rounded-full flex items-center justify-center"
              aria-label="Pesquisar"
            >
              <MagnifyingGlassIcon className="w-5 h-5 text-[#000000] font-bold" />
            </button>
          </div>
        </div>
      </div>
      {/* Botão de Cadastro */}
      <div className="ml-4">
        <button
          onClick={() => router.push('/cadastrar')}
          className="h-11 px-4 rounded-[999px] border-2 border-black text-black hover:bg-gray-100 transition-all duration-300 text-sm font-medium"
        >
          Cadastrar nova Propriedade/Espaço
        </button>
      </div>

      {/* User Login/Options Modal */}
      <div className="relative ml-4" ref={userDropdownRef}>
        <div className="flex items-center">
          <div
            className="cursor-pointer z-10"
            onClick={() => {
              if (isLogged) {
                setIsUserOptionsDropdownOpen((prev) => !prev);
                setIsUserDropdownOpen(false);
              } else {
                setIsUserDropdownOpen((prev) => !prev);
                setIsUserOptionsDropdownOpen(false);
              }
            }}
          >
            <Image src="/icons/user-login.svg" alt="Login" width={40} height={40} />
          </div>
          {isUserDropdownOpen && <AuthModal onClose={() => setIsUserDropdownOpen(false)} isFromHeader={true} />}
          {isUserOptionsDropdownOpen && <AuthOptionsModal onClose={() => setIsUserOptionsDropdownOpen(false)} />}
        </div>
      </div>
    </header>
  );
}
