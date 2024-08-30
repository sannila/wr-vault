export interface User {
  user_id?: number;
  username?: string;
  email: string;
  password: string;
  role?: string;
}

export interface ENV {
  production: boolean;
  apiURL: string;
  userEmail: string | null;
  role: string | null;
  userID: string | null;
  username: string | null;
}

export enum UserType {
  User = 0,
  Admin
}
