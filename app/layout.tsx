import './globals.css';
import 'react-datepicker/dist/react-datepicker.css';
import { Manrope, Urbanist } from 'next/font/google';
import { AuthProvider } from '@/context/AuthContext';
import Header from '@/components/Header';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import ClientLayout from '@/components/ClientLayout';
import Footer from '@/components/Footer';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'TCC Adriano',
  description: 'Por: Adriano Reidel.',
  keywords: ['reservas online'],

  openGraph: {
    title: 'TCC Adriano',
    description: 'Alugue aqui',
    url: 'https://tccadriano.com',
    siteName: 'TCC Adriano',
    locale: 'pt_BR',
    type: 'website',
  },

  icons: {
    icon: '/app/favicon.ico',
  },

  authors: [{ name: 'Adriano Reidel', url: 'https://github.com/AdrianoReidel' }],
  creator: 'Adriano Reidel',
  publisher: 'Adriano Reidel',
};

const manrope = Manrope({
  subsets: ['latin'],
  variable: '--font-manrope',
  weight: ['400', '500', '600', '700'],
});

const urbanist = Urbanist({
  subsets: ['latin'],
  variable: '--font-urbanist',
  weight: ['400', '500', '600', '700'],
});

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR" className={`${manrope.variable} ${urbanist.variable} font-sans`}>
      <body className="antialiased">
        <ClientLayout>
          <AuthProvider>
            <header className="fixed top-0 left-0 right-0 z-80">
              <Header />
            </header>
            <main className="flex-grow pt-[header-height]">{children}</main>
            <ToastContainer />
            <Footer />
          </AuthProvider>
        </ClientLayout>
      </body>
    </html>
  );
}
