import { AdminUserRow, AdminUserSummary } from '../types/user.types';

function toInitials(firstName: string, lastName: string): string {
  const a = firstName?.trim()?.[0] ?? '';
  const b = lastName?.trim()?.[0] ?? '';
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
    id: String(row.id),
    name: `${row.first_name} ${row.last_name}`.trim(),
    email: row.email,
    role: row.role,
    phone: row.phone,
    status: row.status,
    dateRegistered: formatDate(row.created_at),
    lastLogin: formatDateTime(row.last_login_at),
    initials: toInitials(row.first_name, row.last_name),
    address: row.address,
    adoptionApps: Number(row.adoption_apps_count) || 0,
    rescueReports: Number(row.rescue_reports_count) || 0,
    animalsPosted: Number(row.animals_posted_count) || 0,
    completedModules: Number(row.completed_modules) || 0,
  };
}