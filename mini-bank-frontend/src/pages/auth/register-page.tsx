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

const registerSchema = z.object({
  fullName: z.string().trim().min(1, "Bắt buộc nhập họ tên"),
  email: z.string().trim().email("Email không hợp lệ"),
  password: z.string().trim().min(1, "Bắt buộc nhập mật khẩu"),
});

type RegisterForm = z.infer<typeof registerSchema>;

export function RegisterPage() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const { register, handleSubmit, formState: { errors } } = useForm<RegisterForm>({
    resolver: zodResolver(registerSchema),
    defaultValues: { fullName: "", email: "", password: "" },
  });

  const onSubmit = async (values: RegisterForm) => {
    try {
      setLoading(true);
      await authApi.register(values);
      toast.success("Đăng ký thành công. Hãy đăng nhập.");
      navigate("/login", { replace: true });
    } catch (error) {
      toast.error("Đăng ký thất bại. Email có thể đã tồn tại.");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="grid min-h-screen place-items-center bg-gradient-to-br from-slate-100 via-cyan-50 to-slate-200 p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Tạo tài khoản ngân hàng số</CardTitle>
          <p className="mt-2 text-sm text-slate-500">Hồ sơ sẽ được xác thực và lưu an toàn</p>
        </CardHeader>
        <CardContent>
          <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
            <div>
              <Input placeholder="Họ và tên" {...register("fullName")} />
              {errors.fullName && <p className="mt-1 text-xs text-rose-600">{errors.fullName.message}</p>}
            </div>
            <div>
              <Input placeholder="Email" {...register("email")} />
              {errors.email && <p className="mt-1 text-xs text-rose-600">{errors.email.message}</p>}
            </div>
            <div>
              <Input type="password" placeholder="Mật khẩu" {...register("password")} />
              {errors.password && <p className="mt-1 text-xs text-rose-600">{errors.password.message}</p>}
            </div>
            <Button className="w-full" disabled={loading}>
              {loading ? "Đang xử lý..." : "Đăng ký"}
            </Button>
          </form>
          <p className="mt-4 text-center text-sm text-slate-600">
            Đã có tài khoản? <Link className="font-semibold text-sky-700" to="/login">Đăng nhập</Link>
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
