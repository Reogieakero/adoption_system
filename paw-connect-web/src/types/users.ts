export type UserRole = 'resident' | 'admin';
export type UserStatus = 'pending_verification' | 'active' | 'suspended';

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
