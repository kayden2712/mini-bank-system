import { useEffect, useState } from "react";

import { accountApi } from "@/api/account-api";
import { transactionApi } from "@/api/transaction-api";
import { AdminAuditLog } from "@/components/shared/admin-audit-log";
import { EmptyState } from "@/components/shared/empty-state";
import { ErrorState } from "@/components/shared/error-state";
import { LoadingState } from "@/components/shared/loading-state";
import { TransactionTable } from "@/components/shared/transaction-table";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import type { AdminAuditEntry } from "@/types/audit";
import type { AccountResponse } from "@/types/account";
import { getAdminAudit, recordAdminAudit } from "@/utils/admin-audit";
import { formatVnd } from "@/utils/format";

export function AdminPage() {
  const [accountNumber, setAccountNumber] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [account, setAccount] = useState<AccountResponse | null>(null);
  const [totalTransactions, setTotalTransactions] = useState(0);
  const [auditEntries, setAuditEntries] = useState<AdminAuditEntry[]>([]);

  useEffect(() => {
    setAuditEntries(getAdminAudit());
  }, []);

  const loadAdminData = async () => {
    if (!accountNumber.trim()) return;
    try {
      setLoading(true);
      setError("");
      const [acc, txs] = await Promise.all([
        accountApi.getByNumber(accountNumber.trim()),
        transactionApi.history(accountNumber.trim()),
      ]);
      setAccount(acc);
      setTotalTransactions(txs.length);
      setAuditEntries(
        recordAdminAudit("QUERY_ACCOUNT", "SUCCESS", accountNumber.trim(), "Tải dữ liệu quản trị thành công"),
      );
    } catch {
      setAccount(null);
      setTotalTransactions(0);
      setError("Không thể tải dữ liệu kiểm soát. Kiểm tra lại số tài khoản.");
      setAuditEntries(
        recordAdminAudit("QUERY_ACCOUNT", "FAIL", accountNumber.trim(), "Lỗi tải dữ liệu quản trị"),
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>Admin Control Panel</CardTitle>
          <p className="text-sm text-slate-500">Giám sát nhanh tài khoản và giao dịch theo quyền ADMIN.</p>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col gap-3 sm:flex-row">
            <Input
              placeholder="Nhập số tài khoản cần kiểm tra"
              value={accountNumber}
              onChange={(e) => setAccountNumber(e.target.value)}
            />
            <Button onClick={loadAdminData}>Tải dữ liệu</Button>
          </div>
        </CardContent>
      </Card>

      {loading && <LoadingState label="Đang tải dữ liệu quản trị..." />}
      {!loading && error && <ErrorState message={error} onRetry={loadAdminData} />}

      {!loading && !error && !account && (
        <EmptyState title="Chưa có dữ liệu kiểm soát" hint="Nhập một số tài khoản để kiểm tra trạng thái." />
      )}

      {!loading && !error && account && (
        <div className="grid gap-4 sm:grid-cols-3">
          <Card>
            <CardContent className="p-5">
              <p className="text-sm text-slate-500">Số tài khoản</p>
              <p className="mt-1 text-lg font-bold text-slate-900">{account.accountNumber}</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-5">
              <p className="text-sm text-slate-500">Số dư hiện tại</p>
              <p className="mt-1 text-lg font-bold text-slate-900">{formatVnd(account.balance)}</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-5">
              <p className="text-sm text-slate-500">Tổng giao dịch</p>
              <p className="mt-1 text-lg font-bold text-slate-900">{totalTransactions}</p>
            </CardContent>
          </Card>
        </div>
      )}

      {!loading && !error && account && (
        <TransactionHistoryPreview accountNumber={account.accountNumber} />
      )}

      <AdminAuditLog entries={auditEntries} />
    </div>
  );
}

function TransactionHistoryPreview({ accountNumber }: { accountNumber: string }) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [rows, setRows] = useState<Awaited<ReturnType<typeof transactionApi.history>>>([]);

  const load = async () => {
    try {
      setLoading(true);
      setError("");
      const txs = await transactionApi.history(accountNumber);
      setRows(txs);
    } catch {
      setRows([]);
      setError("Không tải được lịch sử giao dịch.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [accountNumber]);

  if (loading) return <LoadingState label="Đang tải lịch sử giao dịch..." />;
  if (error) return <ErrorState message={error} onRetry={load} />;
  if (!rows.length) return <EmptyState title="Không có giao dịch" hint="Tài khoản chưa có giao dịch nào." />;

  return <TransactionTable rows={rows.slice(0, 10)} />;
}
