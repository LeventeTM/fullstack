export interface User {
  id: number;
  name: string;
  email: string;
}

export interface AuthUser extends User {
  token: string;
}

export interface LoginResponse {
  message: string;
  user: { is_admin: number | boolean };
  access_token: string;
  token_type: string;
}
