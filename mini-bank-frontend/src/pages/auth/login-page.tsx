import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { z } from "zod";

import { authApi } from "@/api/auth-api";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useAuthStore } from "@/store/auth-store";

const loginSchema = z.object({
  emailOrAccountNumber: z.string().trim().min(1, "Bắt buộc nhập email hoặc số tài khoản"),
  password: z.string().trim().min(1, "Bắt buộc nhập mật khẩu"),
});

type LoginForm = z.infer<typeof loginSchema>;

export function LoginPage() {
  const navigate = useNavigate();
  const setToken = useAuthStore((state) => state.setToken);
  const [loading, setLoading] = useState(false);

  const { register, handleSubmit, formState: { errors } } = useForm<LoginForm>({
    resolver: zodResolver(loginSchema),
    defaultValues: { emailOrAccountNumber: "", password: "" },
  });

  const onSubmit = async (values: LoginForm) => {
    try {
      setLoading(true);
      const res = await authApi.login(values);
      setToken(res.token);
      toast.success("Đăng nhập thành công");
      navigate("/", { replace: true });
    } catch (error) {
      toast.error("Đăng nhập thất bại. Kiểm tra lại thông tin.");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="grid min-h-screen place-items-center bg-gradient-to-br from-slate-100 via-sky-50 to-slate-200 p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Đăng nhập MiniBank</CardTitle>
          <p className="mt-2 text-sm text-slate-500">Bảo mật tài khoản với xác thực JWT</p>
        </CardHeader>
        <CardContent>
          <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
            <div>
              <Input placeholder="Email hoặc số tài khoản" {...register("emailOrAccountNumber")} />
              {errors.emailOrAccountNumber && <p className="mt-1 text-xs text-rose-600">{errors.emailOrAccountNumber.message}</p>}
            </div>
            <div>
              <Input type="password" placeholder="Mật khẩu" {...register("password")} />
              {errors.password && <p className="mt-1 text-xs text-rose-600">{errors.password.message}</p>}
            </div>
            <Button className="w-full" disabled={loading}>
              {loading ? "Đang xử lý..." : "Đăng nhập"}
            </Button>
          </form>
          <p className="mt-4 text-center text-sm text-slate-600">
            Chưa có tài khoản? <Link className="font-semibold text-sky-700" to="/register">Đăng ký ngay</Link>
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
