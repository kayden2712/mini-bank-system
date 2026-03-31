import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

import { accountApi } from "@/api/account-api";
import { transactionApi } from "@/api/transaction-api";
import { LoadingState } from "@/components/shared/loading-state";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import type { AccountResponse } from "@/types/account";
import { formatVnd } from "@/utils/format";

const createSchema = z.object({ email: z.string().trim().email("Email không hợp lệ") });
const amountSchema = z.object({
  accountNumber: z.string().trim().min(1, "Bắt buộc nhập số tài khoản"),
  amount: z
    .string()
    .trim()
    .min(1, "Bắt buộc nhập số tiền")
    .refine((value) => Number(value) > 0, "Số tiền phải lớn hơn 0"),
});

type CreateForm = z.infer<typeof createSchema>;
type AmountForm = z.infer<typeof amountSchema>;

export function AccountPage() {
  const [account, setAccount] = useState<AccountResponse | null>(null);
  const [busy, setBusy] = useState(false);

  const createForm = useForm<CreateForm>({ resolver: zodResolver(createSchema), defaultValues: { email: "" } });
  const depositForm = useForm<AmountForm>({
    resolver: zodResolver(amountSchema),
    defaultValues: { accountNumber: "", amount: "" },
  });
  const withdrawForm = useForm<AmountForm>({
    resolver: zodResolver(amountSchema),
    defaultValues: { accountNumber: "", amount: "" },
  });

  const onCreate = async (values: CreateForm) => {
    try {
      setBusy(true);
      const created = await accountApi.create(values);
      setAccount(created);
      toast.success("Tạo tài khoản thành công");
    } catch {
      toast.error("Không thể tạo tài khoản");
    } finally {
      setBusy(false);
    }
  };

  const onDeposit = async (values: AmountForm) => {
    try {
      setBusy(true);
      await transactionApi.deposit({ accountNumber: values.accountNumber, amount: Number(values.amount) });
      const updated = await accountApi.getByNumber(values.accountNumber);
      setAccount(updated);
      toast.success("Nạp tiền thành công");
    } catch {
      toast.error("Nạp tiền thất bại");
    } finally {
      setBusy(false);
    }
  };

  const onWithdraw = async (values: AmountForm) => {
    try {
      setBusy(true);
      await transactionApi.withdraw({ accountNumber: values.accountNumber, amount: Number(values.amount) });
      const updated = await accountApi.getByNumber(values.accountNumber);
      setAccount(updated);
      toast.success("Rút tiền thành công");
    } catch {
      toast.error("Rút tiền thất bại");
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="grid gap-4 lg:grid-cols-3">
      <Card>
        <CardHeader><CardTitle>Tạo tài khoản</CardTitle></CardHeader>
        <CardContent>
          <form className="space-y-3" onSubmit={createForm.handleSubmit(onCreate)}>
            <Input placeholder="Email chủ tài khoản" {...createForm.register("email")} />
            <Button disabled={busy} className="w-full">Tạo tài khoản</Button>
          </form>
        </CardContent>
      </Card>

      <Card>
        <CardHeader><CardTitle>Nạp tiền</CardTitle></CardHeader>
        <CardContent>
          <form className="space-y-3" onSubmit={depositForm.handleSubmit(onDeposit)}>
            <Input placeholder="Số tài khoản" {...depositForm.register("accountNumber")} />
            <Input type="number" placeholder="Số tiền" {...depositForm.register("amount")} />
            <Button disabled={busy} className="w-full">Nạp</Button>
          </form>
        </CardContent>
      </Card>

      <Card>
        <CardHeader><CardTitle>Rút tiền</CardTitle></CardHeader>
        <CardContent>
          <form className="space-y-3" onSubmit={withdrawForm.handleSubmit(onWithdraw)}>
            <Input placeholder="Số tài khoản" {...withdrawForm.register("accountNumber")} />
            <Input type="number" placeholder="Số tiền" {...withdrawForm.register("amount")} />
            <Button disabled={busy} className="w-full">Rút</Button>
          </form>
        </CardContent>
      </Card>

      {busy && <LoadingState label="Đang xử lý giao dịch..." />}

      {account && (
        <Card className="lg:col-span-3">
          <CardHeader><CardTitle>Thông tin tài khoản mới nhất</CardTitle></CardHeader>
          <CardContent className="grid gap-2 text-sm text-slate-700 sm:grid-cols-2">
            <p>Số tài khoản: <span className="font-semibold text-slate-900">{account.accountNumber}</span></p>
            <p>Chủ tài khoản: <span className="font-semibold text-slate-900">{account.ownerEmail}</span></p>
            <p>Trạng thái: <span className="font-semibold text-slate-900">{account.status}</span></p>
            <p>Số dư: <span className="font-semibold text-slate-900">{formatVnd(account.balance)}</span></p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
