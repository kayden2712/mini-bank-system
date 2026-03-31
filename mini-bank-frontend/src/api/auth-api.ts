import { apiClient } from "@/api/client";
import type {
  LoginRequest,
  LoginResponse,
  MessageResponse,
  RegisterRequest,
} from "@/types/auth";

export const authApi = {
  login: async (payload: LoginRequest) => {
    const { data } = await apiClient.post<LoginResponse>("/api/auth/login", payload);
    return data;
  },
  register: async (payload: RegisterRequest) => {
    const { data } = await apiClient.post<MessageResponse>("/api/auth/register", payload);
    return data;
  },
  logout: async () => {
    const { data } = await apiClient.post<MessageResponse>("/api/auth/logout");
    return data;
  },
};
