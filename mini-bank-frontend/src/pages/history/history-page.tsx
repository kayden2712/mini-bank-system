import { useState } from "react";

import { transactionApi } from "@/api/transaction-api";
import { EmptyState } from "@/components/shared/empty-state";
import { ErrorState } from "@/components/shared/error-state";
import { LoadingState } from "@/components/shared/loading-state";
import { TransactionTable } from "@/components/shared/transaction-table";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import type { TransactionResponse } from "@/types/transaction";

export function HistoryPage() {
  const [accountNumber, setAccountNumber] = useState("");
  const [rows, setRows] = useState<TransactionResponse[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const loadHistory = async () => {
    if (!accountNumber.trim()) return;
    try {
      setLoading(true);
      setError("");
      const data = await transactionApi.history(accountNumber.trim());
      setRows(data);
    } catch {
      setRows([]);
      setError("Không thể tải lịch sử giao dịch.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>Lịch sử giao dịch</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col gap-3 sm:flex-row">
            <Input
              placeholder="Nhập số tài khoản"
              value={accountNumber}
              onChange={(e) => setAccountNumber(e.target.value)}
            />
            <Button onClick={loadHistory}>Tra cứu</Button>
          </div>
        </CardContent>
      </Card>
      {loading && <LoadingState />}
      {!loading && error && <ErrorState message={error} onRetry={loadHistory} />}
      {!loading && !error && rows.length === 0 && (
        <EmptyState title="Chưa có dữ liệu" hint="Nhập số tài khoản để xem lịch sử giao dịch." />
      )}
      {!loading && !error && rows.length > 0 && <TransactionTable rows={rows} />}
    </div>
  );
}
