import { Navigate, Outlet } from "react-router-dom";

import { useAuthStore } from "@/store/auth-store";
import type { AuthUser } from "@/types/auth";

type Props = {
  allowedRoles: AuthUser["role"][];
};

export function RoleRoute({ allowedRoles }: Props) {
  const user = useAuthStore((state) => state.user);

  if (!user || !allowedRoles.includes(user.role)) {
    return <Navigate to="/forbidden" replace />;
  }

  return <Outlet />;
}
