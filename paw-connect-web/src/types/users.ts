export type UserRole = 'Administrator' | 'Rescuer' | 'Adopter' | 'Citizen';
export type UserStatus = 'Active' | 'Pending' | 'Suspended';

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
