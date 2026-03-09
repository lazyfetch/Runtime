export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  name: string;
  email: string;
  password: string;
}

export interface AuthResponse {
  // token is intentionally ignored on the frontend.
  // Auth is handled exclusively via HttpOnly cookies set by the server.
  email: string;
  name: string;
}

export interface User {
  email: string;
  name: string;
}
