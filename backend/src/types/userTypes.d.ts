export interface getNameInterface {
  username: string;
}

export interface JWTPayload {
  username: string;
  email: string;
  iat?: number;
  exp?: number;
}

export interface userPayload {
  username: string;
  email: string;
  password: string;
  status: string;
  email_verified: boolean;
  created_at?: Date;
}
