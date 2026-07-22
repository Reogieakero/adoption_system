"use client";

import React, { useState } from "react";
import { ShieldAlert, Lock, KeyRound, Eye, EyeOff } from "lucide-react";
import ShadcnSelect from '@/components/ui/shadcn-select';
import styles from "../page.module.css";

interface SecuritySettingsFormProps {
  currentPassword: string;
  setCurrentPassword: (v: string) => void;
  newPassword: string;
  setNewPassword: (v: string) => void;
  confirmPassword: string;
  setConfirmPassword: (v: string) => void;
  sessionTimeout: string;
  setSessionTimeout: (v: string) => void;
  enable2FA: boolean;
  setEnable2FA: (v: boolean) => void;
  requireStrongPasswords: boolean;
  setRequireStrongPasswords: (v: boolean) => void;
}

export default function SecuritySettingsForm({
  currentPassword, setCurrentPassword, newPassword, setNewPassword,
  confirmPassword, setConfirmPassword,
  sessionTimeout, setSessionTimeout, enable2FA, setEnable2FA,
  requireStrongPasswords, setRequireStrongPasswords,
}: SecuritySettingsFormProps) {
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  return (
    <>
      <div className={styles.cardShadcn}>
        <div className={styles.cardHeaderShadcn}>
          <div className={styles.cardHeaderFlex}>
            <KeyRound size={18} color="var(--text-secondary)" />
            <h2>Change Password</h2>
          </div>
          <p>Update your admin account password.</p>
        </div>
        <div className={styles.cardContentShadcn}>
          <div className={styles.formGroup}>
            <label>Current Password</label>
            <input
              type="password"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              className={styles.formInputShadcn}
              placeholder="Enter current password"
            />
          </div>

          <div className={styles.formGroup}>
            <label>New Password</label>
            <div className={styles.inputIconWrapper}>
              <input
                type={showNew ? "text" : "password"}
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className={styles.formInputShadcn}
                placeholder="Min 8 characters"
                style={{ paddingRight: '2.25rem' }}
              />
              <button
                type="button"
                className={styles.innerIcon}
                onClick={() => setShowNew(!showNew)}
                style={{ right: '0.5rem', left: 'auto', background: 'none', border: 'none', cursor: 'pointer', padding: 0, display: 'flex' }}
                tabIndex={-1}
              >
                {showNew ? <EyeOff size={14} /> : <Eye size={14} />}
              </button>
            </div>
          </div>

          <div className={styles.formGroup}>
            <label>Re-type New Password</label>
            <div className={styles.inputIconWrapper}>
              <input
                type={showConfirm ? "text" : "password"}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className={styles.formInputShadcn}
                placeholder="Re-enter new password"
                style={{ paddingRight: '2.25rem' }}
              />
              <button
                type="button"
                className={styles.innerIcon}
                onClick={() => setShowConfirm(!showConfirm)}
                style={{ right: '0.5rem', left: 'auto', background: 'none', border: 'none', cursor: 'pointer', padding: 0, display: 'flex' }}
                tabIndex={-1}
              >
                {showConfirm ? <EyeOff size={14} /> : <Eye size={14} />}
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className={styles.cardShadcn}>
        <div className={styles.cardHeaderShadcn}>
          <div className={styles.cardHeaderFlex}>
            <ShieldAlert size={18} color="var(--text-secondary)" />
            <h2>Session & Authentication</h2>
          </div>
          <p>Fine-tune operational constraints safeguarding resource pools.</p>
        </div>
        <div className={styles.cardContentShadcn}>
          <div className={styles.formGroup}>
            <label>Session Timeout</label>
            <ShadcnSelect
              value={sessionTimeout}
              onChange={setSessionTimeout}
              placeholder="Session Expiration Block"
              options={[
                { label: "15 minutes", value: "15 minutes" },
                { label: "30 minutes", value: "30 minutes" },
                { label: "1 hour", value: "1 hour" },
                { label: "Never expire", value: "infinite" }
              ]}
            />
          </div>

          <div className={styles.separatorShadcn} />

          <div className={styles.toggleRow}>
            <div className={styles.switchLabelContainer}>
              <span className={styles.switchTitle}>Enable Two-Factor Authentication</span>
              <span className={styles.switchSubtitle}>Enforce hardware authenticator token prompts for admin keys.</span>
            </div>
            <label className={styles.switchToggle}>
              <input type="checkbox" checked={enable2FA} onChange={(e) => setEnable2FA(e.target.checked)} />
              <span className={styles.slider} />
            </label>
          </div>

          <div className={styles.separatorShadcn} />

          <div className={styles.toggleRow}>
            <div className={styles.switchLabelContainer}>
              <span className={styles.switchTitle}>Require Strong Passwords</span>
              <span className={styles.switchSubtitle}>Block credential changes failing complexity checks.</span>
            </div>
            <label className={styles.switchToggle}>
              <input type="checkbox" checked={requireStrongPasswords} onChange={(e) => setRequireStrongPasswords(e.target.checked)} />
              <span className={styles.slider} />
            </label>
          </div>
        </div>
      </div>
    </>
  );
}
