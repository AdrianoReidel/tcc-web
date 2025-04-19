import { cookies } from 'next/headers';
import { NextRequest, NextResponse } from 'next/server';

// Agora só colocamos rotas que precisam ser tratadas de forma diferenciada,
// como a rota /accept-invite que pode ter uma lógica específica na página.
const publicRoutes = ['/accept-invite'];

// Se ainda houver rotas protegidas por roles:
const roleBasedRoutes: Record<string, string[]> = {
  '/admin': ['ADMIN'],
  '/host': ['HOST'],
};

export default async function middleware(req: NextRequest) {
  const path = req.nextUrl.pathname;

  // Exclui rotas que não precisam passar pelo middleware
  if (
    path.startsWith('/_next') ||
    path.startsWith('/static') ||
    path.startsWith('/images') ||
    path.startsWith('/icons') ||
    path === '/favicon.ico' ||
    path === '/unauthorized'
  ) {
    return NextResponse.next();
  }

  const cookieStore = cookies();
  const userId = (await cookieStore).get('userId')?.value;
  const userRole = (await cookieStore).get('role')?.value;

  // Se a rota exigir uma role específica, verifica se o usuário tem permissão.
  // Caso contrário, redireciona para /unauthorized.
  if (roleBasedRoutes[path]) {
    const allowedRoles = roleBasedRoutes[path];
    if (!userRole || !allowedRoles.includes(userRole)) {
      return NextResponse.redirect(new URL('/unauthorized', req.nextUrl));
    }
  }

  // Se todas as páginas são públicas (exceto lógica especial em /accept-invite),
  // não há necessidade de redirecionar usuários logados para /home.
  // A lógica de verificação de token na página /accept-invite é feita na própria página.
  return NextResponse.next();
}
