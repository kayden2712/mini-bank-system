import { useState } from "react";
import { toast } from "sonner";

import { accountApi } from "@/api/account-api";
import { transactionApi } from "@/api/transaction-api";
import { EmptyState } from "@/components/shared/empty-state";
import { ErrorState } from "@/components/shared/error-state";
import { LoadingState } from "@/components/shared/loading-state";
import { TransactionTable } from "@/components/shared/transaction-table";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import type { AccountResponse } from "@/types/account";
import type { TransactionResponse } from "@/types/transaction";
import { formatVnd } from "@/utils/format";

export function DashboardPage() {
  const [accountNumber, setAccountNumber] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [account, setAccount] = useState<AccountResponse | null>(null);
  const [history, setHistory] = useState<TransactionResponse[]>([]);

  const loadData = async () => {
    if (!accountNumber.trim()) {
      toast.error("Vui lòng nhập số tài khoản");
      return;
    }
    try {
      setLoading(true);
      setError("");
      const [acc, tx] = await Promise.all([
        accountApi.getByNumber(accountNumber.trim()),
        transactionApi.history(accountNumber.trim()),
      ]);
      setAccount(acc);
      setHistory(tx);
    } catch {
      setError("Không tải được dữ liệu tài khoản. Kiểm tra lại số tài khoản.");
      setAccount(null);
      setHistory([]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>Tổng quan tài chính</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col gap-3 sm:flex-row">
            <Input
              placeholder="Nhập số tài khoản để xem tổng quan"
              value={accountNumber}
              onChange={(e) => setAccountNumber(e.target.value)}
            />
            <Button onClick={loadData}>Tải dữ liệu</Button>
          </div>
        </CardContent>
      </Card>

      {loading && <LoadingState />}
      {error && !loading && <ErrorState message={error} onRetry={loadData} />}

      {!loading && !error && account && (
        <Card>
          <CardHeader>
            <CardTitle>Tài khoản {account.accountNumber}</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-3 sm:grid-cols-2">
            <div className="rounded-lg bg-slate-50 p-4">
              <p className="text-sm text-slate-500">Số dư hiện tại</p>
              <p className="mt-1 text-2xl font-bold text-slate-900">{formatVnd(account.balance)}</p>
            </div>
            <div className="rounded-lg bg-slate-50 p-4">
              <p className="text-sm text-slate-500">Chủ tài khoản</p>
              <p className="mt-1 text-base font-semibold text-slate-900">{account.ownerEmail}</p>
              <p className="mt-1 text-xs text-slate-500">Trạng thái: {account.status}</p>
            </div>
          </CardContent>
        </Card>
      )}

      {!loading && !error && account && history.length === 0 && (
        <EmptyState title="Chưa có giao dịch" hint="Hãy thực hiện nạp/rút/chuyển tiền để tạo lịch sử." />
      )}

      {!loading && !error && history.length > 0 && <TransactionTable rows={history.slice(0, 5)} />}
    </>
  );
}
