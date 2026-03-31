import { Navigate, Route, Routes } from "react-router-dom";

import { AppLayout } from "@/components/layout/app-layout";
import { AccountPage } from "@/pages/account/account-page";
import { AdminPage } from "@/pages/admin/admin-page";
import { LoginPage } from "@/pages/auth/login-page";
import { ForbiddenPage } from "@/pages/auth/forbidden-page";
import { RegisterPage } from "@/pages/auth/register-page";
import { DashboardPage } from "@/pages/dashboard/dashboard-page";
import { HistoryPage } from "@/pages/history/history-page";
import { RoleRoute } from "@/routes/role-route";
import { TransferPage } from "@/pages/transfer/transfer-page";
import { ProtectedRoute } from "@/routes/protected-route";

export function AppRoutes() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route path="/forbidden" element={<ForbiddenPage />} />

      <Route element={<ProtectedRoute />}>
        <Route element={<AppLayout />}>
          <Route path="/" element={<DashboardPage />} />
          <Route path="/account" element={<AccountPage />} />
          <Route path="/transfer" element={<TransferPage />} />
          <Route path="/history" element={<HistoryPage />} />
          <Route element={<RoleRoute allowedRoles={["ADMIN"]} />}>
            <Route path="/admin" element={<AdminPage />} />
          </Route>
        </Route>
      </Route>

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
