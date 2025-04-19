import axios, { AxiosInstance, AxiosResponse, AxiosError } from 'axios';

// Extende a interface de configuração do Axios para incluir as opções customizadas
declare module 'axios' {
  interface AxiosRequestConfig {
    skipAuthRefresh?: boolean;
    _retry?: boolean;
  }
}

// Define a URL base da API a partir da variável de ambiente do Next.js
const baseURL = process.env.NEXT_PUBLIC_API_URL;

// Variáveis para gerenciar o refresh do token e enfileirar requisições pendentes
let isRefreshing = false;
let queue: Array<{ resolve: (value?: unknown) => void; reject: (error: any) => void }> = [];

// Cria a instância do Axios com as configurações necessárias
const api: AxiosInstance = axios.create({
  baseURL,
  withCredentials: true,
  headers: { 'Content-Type': 'application/json' },
});

// Interceptor de resposta para tratar erros e refresh automático do token
api.interceptors.response.use(
  (response: AxiosResponse) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config;

    // Verifica se originalRequest está definido
    if (!originalRequest) {
      return Promise.reject(error);
    }

    // Se a requisição possuir a flag skipAuthRefresh, não tenta o refresh do token
    if (originalRequest.skipAuthRefresh) {
      return Promise.reject(error);
    }

    // Se o erro for 401 (não autorizado) e a requisição ainda não foi reexecutada
    if (error.response?.status === 401 && !originalRequest._retry) {
      // Não tenta refresh para endpoints de login ou refresh
      if (originalRequest.url?.includes('/auth/login') || originalRequest.url?.includes('/auth/refresh')) {
        return Promise.reject(error);
      }

      originalRequest._retry = true; // Marca a requisição para evitar loop infinito

      if (!isRefreshing) {
        isRefreshing = true;
        try {
          // Tenta renovar o token de acesso
          await api.post('/auth/refresh', {}, { skipAuthRefresh: true });
          isRefreshing = false;
          // Reexecuta todas as requisições pendentes na fila
          queue.forEach((q) => q.resolve());
          queue = [];
        } catch (refreshError) {
          isRefreshing = false;
          // Se o refresh falhar, rejeita todas as requisições pendentes
          queue.forEach((q) => q.reject(refreshError));
          queue = [];
          return Promise.reject(refreshError);
        }
      }
      // Retorna uma nova Promise que adiciona a requisição original na fila
      return new Promise((resolve, reject) => {
        queue.push({
          resolve: () => resolve(api(originalRequest)),
          reject,
        });
      });
    }

    return Promise.reject(error);
  }
);

export default api;
