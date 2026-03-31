export type JwtPayload = {
  sub?: string;
  role?: string;
  exp?: number;
};

export const parseJwt = (token: string): JwtPayload | null => {
  try {
    const parts = token.split(".");
    if (parts.length < 2) return null;
    const payload = atob(parts[1].replace(/-/g, "+").replace(/_/g, "/"));
    return JSON.parse(payload) as JwtPayload;
  } catch {
    return null;
  }
};
