'use client';

import { createContext, useContext, useEffect, useState, ReactNode } from 'react';

// Tipos suportados
export type Language = 'pt' | 'en' | 'es';

// Props do contexto
interface LanguageContextProps {
  language: Language;
  setLanguage: (language: Language) => void;
}

// Cria o contexto
const LanguageContext = createContext<LanguageContextProps | undefined>(undefined);

// Provider que envolve a aplicação
export const LanguageProvider = ({ children }: { children: ReactNode }) => {
  const [language, setLanguageState] = useState<Language>('pt');

  useEffect(() => {
    const savedLang = localStorage.getItem('siteLang') as Language;
    if (savedLang) setLanguageState(savedLang);
  }, []);

  const setLanguage = (language: Language) => {
    setLanguageState(language);
    localStorage.setItem('siteLang', language);
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage }}>
      {children}
    </LanguageContext.Provider>
  );
};

// Hook para acessar o idioma atual
export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) throw new Error('useLanguage must be used within LanguageProvider');
  return context;
};
