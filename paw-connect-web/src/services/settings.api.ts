import { createServiceClient } from '@/lib/api-client';

const { request } = createServiceClient('/api/admin/settings');

export interface ProfileData {
  full_name: string;
  email: string;
  phone_number: string | null;
  address: string | null;
}

export interface NotificationPreferenceMap {
  [type: string]: { in_app: boolean; email: boolean };
}

export async function fetchProfile(): Promise<ProfileData> {
  const data = await request<{ success: boolean; profile: ProfileData }>('/profile');
  return data.profile;
}

export async function updateProfile(profile: Partial<ProfileData>): Promise<ProfileData> {
  const data = await request<{ success: boolean; profile: ProfileData }>('/profile', {
    method: 'PATCH',
    body: JSON.stringify(profile),
  });
  return data.profile;
}

export async function changePassword(current_password: string, new_password: string): Promise<void> {
  await request<{ success: boolean }>('/password', {
    method: 'PUT',
    body: JSON.stringify({ current_password, new_password }),
  });
}

export async function fetchNotificationPreferences(): Promise<NotificationPreferenceMap> {
  const data = await request<{ success: boolean; preferences: NotificationPreferenceMap }>(
    '/notification-preferences'
  );
  return data.preferences;
}

export async function updateNotificationPreferences(
  preferences: NotificationPreferenceMap
): Promise<NotificationPreferenceMap> {
  const data = await request<{ success: boolean; preferences: NotificationPreferenceMap }>(
    '/notification-preferences',
    { method: 'PATCH', body: JSON.stringify({ preferences }) }
  );
  return data.preferences;
}

export async function fetchAppSettings(): Promise<Record<string, string>> {
  const data = await request<{ success: boolean; settings: Record<string, string> }>('/app');
  return data.settings;
}

export async function updateAppSettings(
  settings: Record<string, string>
): Promise<Record<string, string>> {
  const data = await request<{ success: boolean; settings: Record<string, string> }>(
    '/app',
    { method: 'PATCH', body: JSON.stringify({ settings }) }
  );
  return data.settings;
}
