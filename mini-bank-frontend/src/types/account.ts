export type AccountStatus = "ACTIVE" | "BLOCKED";

export type AccountResponse = {
  id: number;
  accountNumber: string;
  balance: number;
  status: AccountStatus;
  ownerEmail: string;
  createdAt: string;
  updatedAt: string;
};

export type AccountCreateRequest = {
  email: string;
};
