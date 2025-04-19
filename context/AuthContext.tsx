'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Cookies from 'js-cookie';
import api from '@/lib/axios';
import { toast } from 'react-toastify';

type CookieOptions = {
  expires?: number | Date;
  sameSite?: 'strict' | 'lax' | 'none';
  path?: string;
};

type acceptInvite = {
  token: string;
  name: string;
  password: string;
};

interface AuthResponseData {
  userId: string;
  email: string;
  name: string;
  role: string;
}

interface AuthContextData {
  isLogged: boolean;
  userId: string | null;
  email: string | null;
  userName: string | null;
  userRole: string | null;
  loading: boolean;
  register: (name: string, email: string, password: string) => Promise<void>;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  checkAuth: () => Promise<boolean>;
  verifyInviteToken: (token: string) => Promise<boolean>;
  acceptInvite: (data: acceptInvite) => Promise<boolean>;
}

const AuthContext = createContext<AuthContextData>({} as AuthContextData);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [isLogged, setIsLogged] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);
  const [email, setEmail] = useState<string | null>(null);
  const [userName, setUserName] = useState<string | null>(null);
  const [userRole, setUserRole] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const cookieOpts: CookieOptions = { expires: 7, sameSite: 'strict', path: '/' };

  useEffect(() => {
    checkAuth().finally(() => setLoading(false));
  }, []);

  async function checkAuth(): Promise<boolean> {
    try {
      const check = (await api.post('/auth/check', {}, { skipAuthRefresh: false })).data;
      if (!check) {
        clearUser();
        return false;
      }
      setIsLogged(true);
      setUserId(Cookies.get('userId') || null);
      setEmail(Cookies.get('email') || null);
      setUserName(Cookies.get('name') || null);
      setUserRole(Cookies.get('role') || null);
      return true;
    } catch {
      clearUser();
      return false;
    }
  }

  async function register(name: string, email: string, password: string) {
    await api.post('/auth/register', { name, email, password }, { skipAuthRefresh: true });
  }

  async function setAuthCookiesAndCheck(data: AuthResponseData) {
    const { userId, email: userEmail, name, role } = data;
    Cookies.set('userId', userId, cookieOpts);
    Cookies.set('email', userEmail, cookieOpts);
    Cookies.set('name', name, cookieOpts);
    Cookies.set('role', role, cookieOpts);
    await checkAuth();
  }
  
  async function login(email: string, password: string) {
    const { data } = await api.post('/auth/login', { email, password }, { skipAuthRefresh: true });
    await setAuthCookiesAndCheck(data);
  }

  async function logout() {
    try {
      await api.post('/auth/logout', {}, { skipAuthRefresh: true });
    } finally {
      clearUser();
      router.push('/home');
    }
  }

  async function verifyInviteToken(token: string): Promise<boolean> {
    try {
      const response = await api.post(`/auth/verify-invite`, { token }, { skipAuthRefresh: true });
      return response.data.success;
    } catch (error: any) {
      if (error.response?.status === 401) {
        clearUser();
        router.push('/home');
      } else {
        console.error(error);
        router.push('/unauthorized');
      }
      return false;
    }
  }

  async function acceptInvite(data: acceptInvite): Promise<boolean> {
    try {
      await api.post('/auth/accept-invite', data);
      toast.success('Conta criada com sucesso! Faça login para acessar.');
      return true;
    } catch (error: any) {
      throw error;
    }
  }

  function clearUser() {
    setIsLogged(false);
    setUserId(null);
    setEmail(null);
    setUserName(null);
    setUserRole(null);
    Cookies.remove('access_token');
    Cookies.remove('refresh_token');
    Cookies.remove('userId');
    Cookies.remove('email');
    Cookies.remove('name');
    Cookies.remove('role');
  }

  return (
    <AuthContext.Provider
      value={{
        isLogged,
        userId,
        email,
        userName,
        userRole,
        loading,
        register,
        login,
        logout,
        checkAuth,
        verifyInviteToken,
        acceptInvite,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
