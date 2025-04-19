import Link from 'next/link';
export default function Footer() {
  return (
    <footer className="w-full bg-white shadow-md flex h-[72px] items-center gap-8 px-20 self-stretch py-10">
      <p className="text-gray-500 text-sm">Adriano Reidel © {new Date().getFullYear()} - Todos os direitos reservados</p>
      <div className="flex gap-4 ml-auto">
        <Link href="/termos-de-uso" className="text-gray-500 text-sm hover:underline">
          Termos de Uso
        </Link>
        <Link href="/politica-de-privacidade" className="text-gray-500 text-sm hover:underline">
          Política de Privacidade
        </Link>
        <Link href="/politica-de-cookies" className="text-gray-500 text-sm hover:underline">
          Política de Cookies
        </Link>
      </div>
    </footer>
  );
}
