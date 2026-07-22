import { RowDataPacket } from 'mysql2/promise';

export type AuthProvider = 'local' | 'google';
export type UserRole = 'resident' | 'admin';
export type UserStatus = 'pending_verification' | 'active' | 'suspended';

export interface UserRow extends RowDataPacket {
  user_id: number;
  role: UserRole;
  full_name: string;
  email: string;
  phone_number: string | null;
  password_hash: string | null;
  auth_provider: AuthProvider;
  google_id: string | null;
  google_linked_at: Date | null;
  email_verified: boolean | 0 | 1;
  status: UserStatus;
  address: string | null;
  profile_photo_url: string | null;
  created_at: Date;
  updated_at: Date;
}

export interface PublicUser {
  id: number;
  fullName: string;
  email: string;
  authProvider?: AuthProvider | string;
}

export interface AdminUserRow extends UserRow {
  adoption_apps_count: number;
  rescue_reports_count: number;
  animals_posted_count: number;
}

export interface AdminUserSummary {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  phone: string | null;
  status: UserStatus;
  dateRegistered: string;
  lastLogin: string;
  initials: string;
  address: string | null;
  adoptionApps: number;
  rescueReports: number;
  animalsPosted: number;
  completedModules: number;
}
