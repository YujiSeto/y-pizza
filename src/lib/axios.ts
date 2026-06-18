import axios from "axios";
import { getCookie } from "cookies-next/client";

const baseURL = process.env.NEXT_PUBLIC_BASE_URL 
  ? `${process.env.NEXT_PUBLIC_BASE_URL.trim()}/api`
  : "/api";

export const api = axios.create({
  baseURL,
});

export const apiWithAuth = axios.create({
  baseURL,
});

apiWithAuth.interceptors.request.use(async (config) => {
  const token = getCookie("token");
  if (token) {
    config.headers.Authorization = `Token ${token}`;
  }
  return config;
});
