import { Link } from "react-router-dom";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function ForbiddenPage() {
  return (
    <div className="grid min-h-screen place-items-center bg-gradient-to-br from-slate-100 via-rose-50 to-slate-200 p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Không đủ quyền truy cập</CardTitle>
          <p className="mt-2 text-sm text-slate-500">
            Tài khoản của bạn chưa có quyền ADMIN để truy cập trang này.
          </p>
        </CardHeader>
        <CardContent className="space-y-3">
          <Link to="/" className="block">
            <Button className="w-full">Quay về Dashboard</Button>
          </Link>
          <Link to="/login" className="block">
            <Button variant="secondary" className="w-full">Đăng nhập tài khoản khác</Button>
          </Link>
        </CardContent>
      </Card>
    </div>
  );
}
