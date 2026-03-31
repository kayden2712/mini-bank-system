import type { AdminAuditEntry } from "@/types/audit";
import { formatDateTime } from "@/utils/format";

export function AdminAuditLog({ entries }: { entries: AdminAuditEntry[] }) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white">
      <div className="border-b border-slate-100 p-4">
        <h3 className="text-sm font-semibold text-slate-900">Audit Log</h3>
      </div>
      <div className="max-h-72 overflow-y-auto">
        {entries.length === 0 ? (
          <p className="p-4 text-sm text-slate-500">Chưa có sự kiện audit.</p>
        ) : (
          <ul className="divide-y divide-slate-100">
            {entries.map((entry) => (
              <li key={entry.id} className="p-4 text-sm">
                <p className="font-medium text-slate-900">
                  {entry.action} {entry.accountNumber ? `(${entry.accountNumber})` : ""}
                </p>
                <p className={entry.status === "SUCCESS" ? "text-emerald-600" : "text-rose-600"}>
                  {entry.status}
                </p>
                <p className="text-slate-500">{formatDateTime(entry.timestamp)}</p>
                {entry.detail && <p className="text-xs text-slate-500">{entry.detail}</p>}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
