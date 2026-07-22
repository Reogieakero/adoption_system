import { AdminUserRow, AdminUserSummary } from '../types/user.types';

function toInitials(fullName: string): string {
  const parts = fullName.trim().split(/\s+/);
  const a = parts[0]?.[0] ?? '';
  const b = parts.length > 1 ? parts[parts.length - 1][0] : '';
  return `${a}${b}`.toUpperCase() || '?';
}

function formatDate(value: Date | null): string {
  if (!value) return 'Never Verified';
  return new Date(value).toISOString().slice(0, 10);
}

function formatDateTime(value: Date | null): string {
  if (!value) return 'Never Verified';
  const d = new Date(value);
  return d.toISOString().slice(0, 16).replace('T', ' ');
}

export function toAdminUserSummary(row: AdminUserRow): AdminUserSummary {
  return {
    id: String(row.user_id),
    name: row.full_name,
    email: row.email,
    role: row.role,
    phone: row.phone_number,
    status: row.status,
    dateRegistered: formatDate(row.created_at),
    lastLogin: formatDateTime(row.updated_at),
    initials: toInitials(row.full_name),
    address: row.address,
    adoptionApps: Number(row.adoption_apps_count) || 0,
    rescueReports: Number(row.rescue_reports_count) || 0,
    animalsPosted: Number(row.animals_posted_count) || 0,
    completedModules: 0,
  };
}
