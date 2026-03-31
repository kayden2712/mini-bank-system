import { apiClient } from "@/api/client";
import type { AccountCreateRequest, AccountResponse } from "@/types/account";

export const accountApi = {
  create: async (payload: AccountCreateRequest) => {
    const { data } = await apiClient.post<AccountResponse>("/api/accounts", payload);
    return data;
  },
  getByNumber: async (accountNumber: string) => {
    const { data } = await apiClient.get<AccountResponse>(`/api/accounts/${accountNumber}`);
    return data;
  },
};
