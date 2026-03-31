export type LoginRequest = {
  emailOrAccountNumber: string;
  password: string;
};

export type RegisterRequest = {
  fullName: string;
  email: string;
  password: string;
};

export type LoginResponse = {
  token: string;
  tokenType: string;
};

export type MessageResponse = {
  message: string;
};

export type AuthUser = {
  email: string;
  role: "ADMIN" | "USER" | "UNKNOWN";
};
