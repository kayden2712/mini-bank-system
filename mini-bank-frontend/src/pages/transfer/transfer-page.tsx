import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

import { transactionApi } from "@/api/transaction-api";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";

const transferSchema = z.object({
  fromAccountNumber: z.string().trim().min(1, "Bắt buộc nhập tài khoản nguồn"),
  toAccountNumber: z.string().trim().min(1, "Bắt buộc nhập tài khoản nhận"),
  amount: z
    .string()
    .trim()
    .min(1, "Bắt buộc nhập số tiền")
    .refine((value) => Number(value) > 0, "Số tiền phải lớn hơn 0"),
});

type TransferForm = z.infer<typeof transferSchema>;

export function TransferPage() {
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [payload, setPayload] = useState<TransferForm | null>(null);
  const [loading, setLoading] = useState(false);

  const form = useForm<TransferForm>({
    resolver: zodResolver(transferSchema),
    defaultValues: { fromAccountNumber: "", toAccountNumber: "", amount: "" },
  });

  const onPrepare = (values: TransferForm) => {
    setPayload(values);
    setConfirmOpen(true);
  };

  const onConfirm = async () => {
    if (!payload) return;
    try {
      setLoading(true);
      await transactionApi.transfer({
        fromAccountNumber: payload.fromAccountNumber,
        toAccountNumber: payload.toAccountNumber,
        amount: Number(payload.amount),
      });
      toast.success("Chuyển tiền thành công");
      form.reset();
    } catch {
      toast.error("Chuyển tiền thất bại");
    } finally {
      setLoading(false);
      setConfirmOpen(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Chuyển tiền liên tài khoản</CardTitle>
      </CardHeader>
      <CardContent>
        <form className="grid gap-3 sm:grid-cols-2" onSubmit={form.handleSubmit(onPrepare)}>
          <div>
            <Input placeholder="Tài khoản nguồn" {...form.register("fromAccountNumber")} />
            {form.formState.errors.fromAccountNumber && <p className="mt-1 text-xs text-rose-600">{form.formState.errors.fromAccountNumber.message}</p>}
          </div>
          <div>
            <Input placeholder="Tài khoản nhận" {...form.register("toAccountNumber")} />
            {form.formState.errors.toAccountNumber && <p className="mt-1 text-xs text-rose-600">{form.formState.errors.toAccountNumber.message}</p>}
          </div>
          <div>
            <Input type="number" placeholder="Số tiền" {...form.register("amount")} />
            {form.formState.errors.amount && <p className="mt-1 text-xs text-rose-600">{form.formState.errors.amount.message}</p>}
          </div>
          <div className="sm:col-span-2">
            <Button disabled={loading}>Xác nhận chuyển</Button>
          </div>
        </form>
      </CardContent>

      <Dialog open={confirmOpen} onOpenChange={setConfirmOpen}>
        <DialogContent>
          <DialogTitle>Xác nhận giao dịch</DialogTitle>
          <DialogDescription>
            Bạn sắp chuyển {Number(payload?.amount || 0).toLocaleString("vi-VN")} VND từ {payload?.fromAccountNumber} sang {payload?.toAccountNumber}.
          </DialogDescription>
          <div className="mt-5 flex justify-end gap-2">
            <Button variant="secondary" onClick={() => setConfirmOpen(false)}>Hủy</Button>
            <Button onClick={onConfirm} disabled={loading}>{loading ? "Đang xử lý..." : "Đồng ý"}</Button>
          </div>
        </DialogContent>
      </Dialog>
    </Card>
  );
}
