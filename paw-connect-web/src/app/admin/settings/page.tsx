"use client";

import React, { useState, useEffect, useCallback, useMemo } from "react";
import styles from "./page.module.css";
import type { ProfileData, NotificationPreferenceMap } from '@/services/settings.api';
import {
  fetchProfile, updateProfile,
  fetchNotificationPreferences, updateNotificationPreferences,
  fetchAppSettings, updateAppSettings,
  changePassword,
} from '@/services/settings.api';
import SettingsTabs from './components/SettingsTabs';
import GeneralSettingsForm from './components/GeneralSettingsForm';
import NotificationSettingsForm from './components/NotificationSettingsForm';
import MapSettingsForm from './components/MapSettingsForm';
import ELearningSettingsForm from './components/ELearningSettingsForm';
import SystemSettingsForm from './components/SystemSettingsForm';
import SecuritySettingsForm from './components/SecuritySettingsForm';
import BackupRestoreCard from './components/BackupRestoreCard';
import SettingsFooter from './components/SettingsFooter';
import BackupDialog from './components/BackupDialog';
import Button from '@/components/ui/button';

type SettingsTab = "general" | "notifications" | "maps" | "elearning" | "system" | "security";

const DEFAULT_APP_SETTINGS: Record<string, string> = {
  map_location: 'Mati City 8200',
  enable_heatmap: 'true',
  module_visibility: 'public',
  allow_quiz_retakes: 'always',
  enable_certificates: 'true',
  enable_reviews: 'true',
  date_format: 'MM/DD/YYYY',
  time_format: '12h',
  time_zone: 'EST',
  session_timeout: '30 minutes',
  enable_2fa: 'false',
  require_strong_passwords: 'true',
};

function diff(orig: Record<string, string>, curr: Record<string, string>): string[] {
  const changes: string[] = [];
  for (const key of Object.keys(curr)) {
    if (orig[key] !== curr[key]) {
      const label = key.replace(/_/g, ' ');
      changes.push(`${label}: ${orig[key]} → ${curr[key]}`);
    }
  }
  return changes;
}

export default function AdminSettingsPage() {
  const [activeTab, setActiveTab] = useState<SettingsTab>("general");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [statusMessage, setStatusMessage] = useState('');
  const [confirmOpen, setConfirmOpen] = useState(false);

  const [profile, setProfile] = useState<ProfileData>({
    full_name: '', email: '', phone_number: '', address: '',
  });
  const [notifPrefs, setNotifPrefs] = useState<NotificationPreferenceMap>({});
  const [appSettings, setAppSettings] = useState<Record<string, string>>(DEFAULT_APP_SETTINGS);

  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const [isBackupDialogOpen, setIsBackupDialogOpen] = useState(false);
  const [dialogAction, setDialogAction] = useState<"backup" | "restore" | "export" | null>(null);

  const showStatus = useCallback((msg: string, isError = false) => {
    setStatusMessage((isError ? '⚠ ' : '✓ ') + msg);
    setTimeout(() => setStatusMessage(''), isError ? 6000 : 3000);
  }, []);

  // Snapshot of saved values for change detection
  const [savedProfile, setSavedProfile] = useState<ProfileData>(profile);
  const [savedNotifPrefs, setSavedNotifPrefs] = useState<NotificationPreferenceMap>({});
  const [savedAppSettings, setSavedAppSettings] = useState<Record<string, string>>(DEFAULT_APP_SETTINGS);

  useEffect(() => {
    async function load() {
      const errors: string[] = [];
      try {
        const p = await fetchProfile();
        setProfile(p);
        setSavedProfile(p);
      } catch (e: any) { errors.push('profile: ' + (e.message || '')); }
      try {
        const n = await fetchNotificationPreferences();
        setNotifPrefs(n);
        setSavedNotifPrefs(n);
      } catch (e: any) { errors.push('notifications: ' + (e.message || '')); }
      try {
        const a = await fetchAppSettings();
        setAppSettings(a);
        setSavedAppSettings(a);
      } catch (e: any) { errors.push('app settings: ' + (e.message || '')); }
      if (errors.length > 0) showStatus('Failed to load ' + errors.join('; '), true);
      setLoading(false);
    }
    load();
  }, [showStatus]);

  const setApp = (key: string, value: string) =>
    setAppSettings((prev) => ({ ...prev, [key]: value }));

  const NOTIF_LABELS: Record<string, string> = {
    adoption_status: 'Adoption Status',
    report_status: 'Report Status',
    new_message: 'New Messages',
    new_report: 'New Rescue Reports',
    new_community_listing: 'Community Listings',
    new_application: 'New Applications',
  };

  // Compute changes for the confirmation modal
  const changes = useMemo(() => {
    const list: string[] = [];

    if (profile.full_name !== savedProfile.full_name) list.push(`Full Name: ${savedProfile.full_name} → ${profile.full_name}`);
    if (profile.phone_number !== savedProfile.phone_number) list.push(`Phone: ${savedProfile.phone_number || '—'} → ${profile.phone_number || '—'}`);
    if (profile.address !== savedProfile.address) list.push(`Address: ${savedProfile.address || '—'} → ${profile.address || '—'}`);

    for (const [type, pref] of Object.entries(notifPrefs)) {
      const saved = savedNotifPrefs[type];
      if (!saved || saved.in_app !== pref.in_app) {
        const label = NOTIF_LABELS[type] || type;
        list.push(`${label}: ${pref.in_app ? 'ON' : 'OFF'} (was ${saved?.in_app ? 'ON' : 'OFF'})`);
      }
    }

    if (activeTab === 'security' && currentPassword && newPassword) list.push('Password: will be changed');

    const appDiffs = diff(savedAppSettings, appSettings);
    list.push(...appDiffs);

    return list;
  }, [profile, savedProfile, notifPrefs, savedNotifPrefs, appSettings, savedAppSettings, currentPassword, newPassword, activeTab]);

  function handleSaveClick(e: React.FormEvent) {
    e.preventDefault();
    if (changes.length === 0) {
      showStatus('No changes to save');
      return;
    }
    setConfirmOpen(true);
  }

  async function executeSave() {
    setConfirmOpen(false);
    setSaving(true);
    try {
      switch (activeTab) {
        case 'general':
          setProfile(await updateProfile({
            full_name: profile.full_name,
            phone_number: profile.phone_number,
            address: profile.address,
          }));
          break;
        case 'notifications':
          setNotifPrefs(await updateNotificationPreferences(notifPrefs));
          break;
        case 'security':
          if (currentPassword && newPassword) {
            if (newPassword !== confirmPassword) {
              showStatus('New passwords do not match', true);
              setSaving(false);
              return;
            }
            await changePassword(currentPassword, newPassword);
            setCurrentPassword('');
            setNewPassword('');
            setConfirmPassword('');
          }
          setAppSettings(await updateAppSettings(appSettings));
          break;
        default:
          setAppSettings(await updateAppSettings(appSettings));
          break;
      }
      // Update saved snapshots
      setSavedProfile(profile);
      setSavedNotifPrefs(notifPrefs);
      setSavedAppSettings(appSettings);
      showStatus('Settings saved');
    } catch (err: any) {
      showStatus(err?.message || 'Failed to save', true);
    } finally {
      setSaving(false);
    }
  }

  const handleReset = useCallback(() => {
    fetchProfile().then((p) => { setProfile(p); setSavedProfile(p); }).catch(() => {});
    fetchNotificationPreferences().then((n) => { setNotifPrefs(n); setSavedNotifPrefs(n); }).catch(() => {});
    fetchAppSettings().then((a) => { setAppSettings(a); setSavedAppSettings(a); }).catch(() => {});
    setCurrentPassword('');
    setNewPassword('');
    setConfirmPassword('');
    showStatus('Reset to saved values');
  }, [showStatus]);

  const openActionDialog = (action: "backup" | "restore" | "export") => {
    setDialogAction(action);
    setIsBackupDialogOpen(true);
  };

  if (loading) {
    return (
      <div className={styles.adminContainer}>
        <div className={styles.stateMessage}>Loading settings…</div>
      </div>
    );
  }

  return (
    <div className={styles.adminContainer}>
      <div className={styles.headerContainer}>
        <div className={styles.titleArea}>
          <h1>Settings</h1>
          <p>Configure system preferences and administrative settings.</p>
        </div>
      </div>

      <form onSubmit={handleSaveClick}>
        <SettingsTabs activeTab={activeTab} onTabChange={setActiveTab} />

        <div className={styles.mainGrid}>
          <div className={styles.formContentColumn}>
            {activeTab === "general" && (
              <GeneralSettingsForm profile={profile} onChange={setProfile} />
            )}
            {activeTab === "notifications" && (
              <NotificationSettingsForm preferences={notifPrefs} onChange={setNotifPrefs} />
            )}
            {activeTab === "maps" && (
              <MapSettingsForm
                mapLocation={appSettings.map_location}
                setMapLocation={(v) => setApp('map_location', v)}
                enableHeatmap={appSettings.enable_heatmap === 'true'}
                setEnableHeatmap={(v) => setApp('enable_heatmap', String(v))}
              />
            )}
            {activeTab === "elearning" && (
              <ELearningSettingsForm
                moduleVisibility={appSettings.module_visibility}
                setModuleVisibility={(v) => setApp('module_visibility', v)}
                allowQuizRetakes={appSettings.allow_quiz_retakes}
                setAllowQuizRetakes={(v) => setApp('allow_quiz_retakes', v)}
                enableCertificates={appSettings.enable_certificates === 'true'}
                setEnableCertificates={(v) => setApp('enable_certificates', String(v))}
                enableReviews={appSettings.enable_reviews === 'true'}
                setEnableReviews={(v) => setApp('enable_reviews', String(v))}
              />
            )}
            {activeTab === "system" && (
              <SystemSettingsForm
                dateFormat={appSettings.date_format}
                setDateFormat={(v) => setApp('date_format', v)}
                timeFormat={appSettings.time_format}
                setTimeFormat={(v) => setApp('time_format', v)}
                timeZone={appSettings.time_zone}
                setTimeZone={(v) => setApp('time_zone', v)}
              />
            )}
            {activeTab === "security" && (
              <SecuritySettingsForm
                currentPassword={currentPassword} setCurrentPassword={setCurrentPassword}
                newPassword={newPassword} setNewPassword={setNewPassword}
                confirmPassword={confirmPassword} setConfirmPassword={setConfirmPassword}
                sessionTimeout={appSettings.session_timeout}
                setSessionTimeout={(v) => setApp('session_timeout', v)}
                enable2FA={appSettings.enable_2fa === 'true'}
                setEnable2FA={(v) => setApp('enable_2fa', String(v))}
                requireStrongPasswords={appSettings.require_strong_passwords === 'true'}
                setRequireStrongPasswords={(v) => setApp('require_strong_passwords', String(v))}
              />
            )}
          </div>

          <BackupRestoreCard
            onBackup={() => openActionDialog("backup")}
            onRestore={() => openActionDialog("restore")}
            onExport={() => openActionDialog("export")}
          />
        </div>

        <SettingsFooter onReset={handleReset} saving={saving} statusMessage={statusMessage} />
      </form>

      {/* Confirmation Modal */}
      {confirmOpen && (
        <div className={styles.modalOverlay} onClick={() => setConfirmOpen(false)}>
          <div className={styles.modalContent} onClick={(e) => e.stopPropagation()} style={{ maxWidth: '480px' }}>
            <div className={styles.modalHeader}>
              <h2>Confirm Changes</h2>
              <p>Review the changes below before saving.</p>
            </div>
            <div style={{ maxHeight: '300px', overflowY: 'auto', marginBottom: '1.25rem' }}>
              {changes.length === 0 ? (
                <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>No changes detected.</p>
              ) : (
                <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                  {changes.map((c, i) => (
                    <li key={i} style={{
                      fontSize: '0.8rem',
                      fontFamily: 'var(--font-geist-mono), monospace',
                      padding: '0.5rem 0.65rem',
                      background: 'var(--surface)',
                      borderRadius: '6px',
                      border: '1px solid var(--border)',
                      color: 'var(--text-primary)',
                      lineHeight: 1.4,
                    }}>
                      {c}
                    </li>
                  ))}
                </ul>
              )}
            </div>
            <div className={styles.modalFooter}>
              <Button variant="admin-secondary" onClick={() => setConfirmOpen(false)}>Cancel</Button>
              <Button variant="admin-primary" onClick={executeSave} disabled={changes.length === 0}>
                Save Changes
              </Button>
            </div>
          </div>
        </div>
      )}

      <BackupDialog
        isOpen={isBackupDialogOpen}
        action={dialogAction}
        onClose={() => setIsBackupDialogOpen(false)}
        onConfirm={() => { setIsBackupDialogOpen(false); showStatus("Backup scheduled"); }}
      />
    </div>
  );
}
