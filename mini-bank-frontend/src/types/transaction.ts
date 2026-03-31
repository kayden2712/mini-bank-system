export type AmountRequest = {
  accountNumber: string;
  amount: number;
};

export type TransferRequest = {
  fromAccountNumber: string;
  toAccountNumber: string;
  amount: number;
};

export type TransactionResponse = {
  id: number;
  type: string;
  amount: number;
  description: string;
  fromAccountNumber: string | null;
  toAccountNumber: string | null;
  createdAt: string;
};
