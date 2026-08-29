import axios, { AxiosInstance, AxiosResponse } from "axios";

const API_BASE = "https://apis.imlinkey.store/api/v1/";

// Função auxiliar para extrair tokens dos cookies no ambiente do cliente
const getTokenFromCookie = (): string | null => {
  if (typeof document === "undefined") return null;
  const cookies = document.cookie.split(";").map((c) => c.trim());
  const token = cookies.find((c) => c.startsWith("auth_token="));
  return token ? decodeURIComponent(token.split("=")[1]) : null;
};

export const api: AxiosInstance = axios.create({
  baseURL: API_BASE,
  timeout: 60000,
  withCredentials: true,
  headers: {
    Accept: "application/json",
  },
});

// INTERCEPTOR DE REQUISIÇÃO (CSRF & AUTH TOKENS)
api.interceptors.request.use((config) => {
  if (
    typeof document !== "undefined" &&
    ["post", "put", "patch", "delete"].includes((config.method || "").toLowerCase())
  ) {
    const csrfToken = document.cookie
      .split("; ")
      .find((row) => row.startsWith("csrftoken="))
      ?.split("=")[1];

    if (csrfToken && config.headers) {
      config.headers["X-CSRFToken"] = csrfToken;
    }
  }

  const token = getTokenFromCookie();
  if (token && config.headers) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

// INTERCEPTOR DE RESPOSTA (REDIRECT EM ERROS DE AUTENTICAÇÃO)
api.interceptors.response.use(
  (response: AxiosResponse) => response,
  (error) => {
    if (error.response?.status === 401 || error.response?.status === 403) {
      if (typeof window !== "undefined") {
        window.location.href = "/auth/";
      }
    }
    return Promise.reject(error);
  }
);
