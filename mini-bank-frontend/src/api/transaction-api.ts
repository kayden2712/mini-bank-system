import { apiClient } from "@/api/client";
import type {
  AmountRequest,
  TransactionResponse,
  TransferRequest,
} from "@/types/transaction";

export const transactionApi = {
  deposit: async (payload: AmountRequest) => {
    const { data } = await apiClient.post<TransactionResponse>("/api/transactions/deposit", payload);
    return data;
  },
  withdraw: async (payload: AmountRequest) => {
    const { data } = await apiClient.post<TransactionResponse>("/api/transactions/withdraw", payload);
    return data;
  },
  transfer: async (payload: TransferRequest) => {
    const { data } = await apiClient.post<TransactionResponse>("/api/transactions/transfer", payload);
    return data;
  },
  history: async (accountNumber: string) => {
    const { data } = await apiClient.get<TransactionResponse[]>("/api/transactions/history", {
      params: { accountNumber },
    });
    return data;
  },
};
