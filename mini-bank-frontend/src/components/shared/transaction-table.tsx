import type { TransactionResponse } from "@/types/transaction";
import { formatDateTime, formatVnd } from "@/utils/format";

type Props = {
  rows: TransactionResponse[];
};

export function TransactionTable({ rows }: Props) {
  return (
    <div className="overflow-hidden rounded-xl border border-slate-200 bg-white">
      <div className="overflow-x-auto">
        <table className="min-w-full text-left text-sm">
          <thead className="bg-slate-50 text-slate-600">
            <tr>
              <th className="px-4 py-3 font-medium">Thời gian</th>
              <th className="px-4 py-3 font-medium">Loại</th>
              <th className="px-4 py-3 font-medium">Số tiền</th>
              <th className="px-4 py-3 font-medium">Từ</th>
              <th className="px-4 py-3 font-medium">Đến</th>
              <th className="px-4 py-3 font-medium">Mô tả</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((tx) => (
              <tr key={tx.id} className="border-t border-slate-100">
                <td className="px-4 py-3 text-slate-700">{formatDateTime(tx.createdAt)}</td>
                <td className="px-4 py-3 font-medium text-slate-900">{tx.type}</td>
                <td className="px-4 py-3 text-slate-900">{formatVnd(tx.amount)}</td>
                <td className="px-4 py-3 text-slate-700">{tx.fromAccountNumber || "-"}</td>
                <td className="px-4 py-3 text-slate-700">{tx.toAccountNumber || "-"}</td>
                <td className="px-4 py-3 text-slate-600">{tx.description || "-"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
