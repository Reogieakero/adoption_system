import { RowDataPacket } from 'mysql2/promise';

export type AuthProvider = 'local' | 'google';

export interface UserRow extends RowDataPacket {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
  password_hash: string | null;
  is_verified: boolean | 0 | 1;
  verification_code: string | null;
  verification_code_expires: Date | null;
  provider: AuthProvider | null;
  google_uid: string | null;
}

export interface PublicUser {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  provider?: AuthProvider | string;
}
