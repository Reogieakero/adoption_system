import { RowDataPacket } from 'mysql2/promise';

export type AuthProvider = 'local' | 'google';
export type UserRole = 'Administrator' | 'Rescuer' | 'Adopter' | 'Citizen';
export type UserStatus = 'Active' | 'Pending' | 'Suspended';

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
  role: UserRole;
  status: UserStatus;
  phone: string | null;
  address: string | null;
  completed_modules: number;
  agreed_terms: boolean | 0 | 1;
  agreed_terms_at: Date | null;
  created_at: Date;
  last_login_at: Date | null;
}

export interface PublicUser {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  provider?: AuthProvider | string;
}

/**
 * Row shape returned by the admin "list users" query, which LEFT JOINs
 * counts from adoptions/rescues/animals. Adjust the joined field names in
 * user.repository.ts if your table/column names differ.
 */
export interface AdminUserRow extends UserRow {
  adoption_apps_count: number;
  rescue_reports_count: number;
  animals_posted_count: number;
}

/**
 * Shape sent to the frontend admin Users page — matches UserEntry in
 * app/admin/user/page.tsx.
 */
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