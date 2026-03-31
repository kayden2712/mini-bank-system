import { create } from "zustand";
import { persist } from "zustand/middleware";

import { parseJwt } from "@/utils/jwt";
import type { AuthUser } from "@/types/auth";

type AuthState = {
  token: string | null;
  user: AuthUser | null;
  setToken: (token: string) => void;
  logout: () => void;
};

const unknownUser: AuthUser = { email: "", role: "UNKNOWN" };

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      token: null,
      user: null,
      setToken: (token) => {
        const payload = parseJwt(token);
        const user: AuthUser = {
          email: payload?.sub ?? unknownUser.email,
          role:
            payload?.role === "ADMIN" || payload?.role === "USER"
              ? payload.role
              : unknownUser.role,
        };
        set({ token, user });
      },
      logout: () => set({ token: null, user: null }),
    }),
    {
      name: "mini-bank-auth",
    },
  ),
);
