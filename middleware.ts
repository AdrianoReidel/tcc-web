import { cookies } from 'next/headers';
import { NextRequest, NextResponse } from 'next/server';

export default async function middleware(req: NextRequest) {
  const path = req.nextUrl.pathname;

  // Exclui rotas que não precisam passar pelo middleware
  if (
    path.startsWith('/home') ||
    path.startsWith('/moradias') ||
    path.startsWith('/eventos') ||
    path.startsWith('/esportes') ||
    path === '/favicon.ico' ||
    path === '/unauthorized'
  ) {
    return NextResponse.next();
  }

  const roleBasedRoutes: Record<string, string[]> = {
    '/minhas-propriedades': ['HOST', 'ADMIN'],
    '/minhas-reservas': ['GUEST', 'ADMIN'],
  };

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

  return NextResponse.next();
}
