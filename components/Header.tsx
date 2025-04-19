'use client';
import Image from 'next/image';
import { useState, useEffect, useRef } from 'react';
import { toast } from 'react-toastify';
import { useLanguage } from '@/context/LanguageContext';
import AuthModal from './Auth/UserAuth';
import AuthOptionsModal from './Auth/UserAuthOptions';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { XMarkIcon, MagnifyingGlassIcon } from '@heroicons/react/24/solid';
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

  const validTypes = ['explorar', 'hospedagens', 'o-que-fazer', 'restaurantes', 'voos'];
  const segments = pathname?.split('/').filter(Boolean);
  const firstSegment = segments?.[0];

  // Close dropdowns when clicking outside
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
      // Substitui espaços por hífens e então codifica
      const formattedSearch = trimmed.replace(/\s+/g, '-');
      const encodedSearch = encodeURIComponent(formattedSearch);
      router.push(`/explorar/${encodedSearch}`);
    }
  };
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
  };

  return (
    <header className="header w-full bg-white text-white shadow-md flex h-16 items-center gap-8 px-20 self-stretch text-sm font-normal ">
      {/* Logo */}
      <div className="flex items-center" onClick={() => router.push('/')}>
        <Image src="/images/logo.svg" alt="Adriano Reidel" width={140} height={40} />
      </div>

      {/* Search Bar */}
      <div className="flex-1 w-full">
        <div className="relative flex items-center">
          <input
            ref={inputRef}
            type="text"
            value={inputValue}
            onChange={handleInputChange}
            placeholder="Procure por moradias, espaços para eventos ou esportes..."
            className={`w-full h-11 rounded-[999px] border border-[#000000] placeholder-[#000000] text-[#000000] focus:ring-1 focus:ring-[#000000] transition-all duration-300 pl-6 text-sm font-normal ${
              isInputFocused ? 'pr-40' : 'pr-16'
            }`}
            onFocus={() => setIsInputFocused(true)}
            onBlur={() => setIsInputFocused(false)}
          />

          {isInputFocused && (
            <button
              onMouseDown={handleClearFocus}
              className="absolute right-12 p-2 rounded-full flex items-center justify-center z-10"
            >
              <XMarkIcon className="w-5 h-5 text-[#000000]" />
            </button>
          )}

          <button
            onClick={handleSearch}
            className="absolute right-2 p-2.5 rounded-full flex items-center justify-center gap-2"
          >
            <MagnifyingGlassIcon className="w-5 h-5 text-[#000000] font-bold" />
          </button>
        </div>
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
