import type { AdminAuditEntry } from "@/types/audit";

const KEY = "mini-bank-admin-audit";

export const getAdminAudit = (): AdminAuditEntry[] => {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return [];
    return JSON.parse(raw) as AdminAuditEntry[];
  } catch {
    return [];
  }
};

export const recordAdminAudit = (
  action: string,
  status: AdminAuditEntry["status"],
  accountNumber?: string,
  detail?: string,
) => {
  const next: AdminAuditEntry = {
    id: crypto.randomUUID(),
    action,
    status,
    accountNumber,
    detail,
    timestamp: new Date().toISOString(),
  };

  const history = getAdminAudit();
  const merged = [next, ...history].slice(0, 30);
  localStorage.setItem(KEY, JSON.stringify(merged));
  return merged;
};
