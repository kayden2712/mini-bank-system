import { ArrowLeftRight, Home, Landmark, LogOut, ReceiptText, ShieldCheck } from "lucide-react";
import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { toast } from "sonner";

import { authApi } from "@/api/auth-api";
import { Button } from "@/components/ui/button";
import { useAuthStore } from "@/store/auth-store";

const navItems = [
  { to: "/", label: "Dashboard", icon: Home },
  { to: "/account", label: "Tài khoản", icon: Landmark },
  { to: "/transfer", label: "Chuyển tiền", icon: ArrowLeftRight },
  { to: "/history", label: "Lịch sử", icon: ReceiptText },
];

export function AppLayout() {
  const user = useAuthStore((state) => state.user);
    const effectiveNavItems =
      user?.role === "ADMIN"
        ? [...navItems, { to: "/admin", label: "Admin", icon: ShieldCheck }]
        : navItems;

  const logoutStore = useAuthStore((state) => state.logout);
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await authApi.logout();
    } catch {
      // Logout endpoint is best-effort for stateless JWT.
    } finally {
      logoutStore();
      toast.success("Đã đăng xuất an toàn");
      navigate("/login", { replace: true });
    }
  };

  return (
    <div className="min-h-screen bg-slate-100">
      <div className="mx-auto grid max-w-7xl grid-cols-1 gap-5 p-4 lg:grid-cols-[260px_1fr] lg:p-6">
        <aside className="hidden rounded-2xl border border-slate-200 bg-white p-5 lg:block">
          <p className="font-display text-2xl font-bold text-slate-900">MiniBank</p>
          <p className="mt-1 text-sm text-slate-500">{user?.email || "-"}</p>
          <span className="mt-2 inline-flex rounded-full bg-slate-100 px-2.5 py-1 text-xs font-semibold text-slate-700">
            Role: {user?.role || "UNKNOWN"}
          </span>
          <nav className="mt-6 space-y-1">
            {effectiveNavItems.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                className={({ isActive }) =>
                  `flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium ${
                    isActive ? "bg-sky-600 text-white" : "text-slate-600 hover:bg-slate-100"
                  }`
                }
              >
                <item.icon className="h-4 w-4" />
                {item.label}
              </NavLink>
            ))}
          </nav>
          <Button variant="secondary" className="mt-6 w-full" onClick={handleLogout}>
            <LogOut className="mr-2 h-4 w-4" /> Đăng xuất
          </Button>
        </aside>

        <main className="space-y-4 pb-20 lg:pb-0">
          <div className="flex items-center justify-between rounded-xl border border-slate-200 bg-white p-3 lg:hidden">
            <p className="text-xs text-slate-500">{user?.email || "-"}</p>
            <span className="rounded-full bg-slate-100 px-2 py-1 text-xs font-semibold text-slate-700">
              {user?.role || "UNKNOWN"}
            </span>
          </div>
          <Outlet />
        </main>
      </div>

      <nav className="fixed inset-x-0 bottom-0 border-t border-slate-200 bg-white p-2 lg:hidden">
        <div className="mx-auto flex max-w-md items-center justify-between">
          {effectiveNavItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                `flex flex-1 flex-col items-center gap-1 rounded-md p-2 text-xs ${
                  isActive ? "text-sky-600" : "text-slate-500"
                }`
              }
            >
              <item.icon className="h-4 w-4" />
              {item.label}
            </NavLink>
          ))}
        </div>
      </nav>
    </div>
  );
}
