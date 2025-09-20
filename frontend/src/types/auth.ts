// src/types/auth.ts
export interface AuthRequest {
  email: string;
}

export interface VerifyRequest {
  email: string;
  code: string;
}

export interface RegisterRequest {
  username: string;
  displayName: string;
}

export interface AuthResponse {
  token?: string;
  message: string;
  success: boolean;
}