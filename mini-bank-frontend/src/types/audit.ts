export type AdminAuditEntry = {
  id: string;
  action: string;
  accountNumber?: string;
  status: "SUCCESS" | "FAIL";
  timestamp: string;
  detail?: string;
};
