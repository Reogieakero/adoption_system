"use client";

import React from "react";
import { ShieldAlert, Lock } from "lucide-react";
import ShadcnSelect from '@/components/ui/shadcn-select';
import styles from "../page.module.css";

interface SecuritySettingsFormProps {
  sessionTimeout: string;
  setSessionTimeout: (v: string) => void;
  enable2FA: boolean;
  setEnable2FA: (v: boolean) => void;
  requireStrongPasswords: boolean;
  setRequireStrongPasswords: (v: boolean) => void;
}

export default function SecuritySettingsForm({
  sessionTimeout, setSessionTimeout, enable2FA, setEnable2FA, requireStrongPasswords, setRequireStrongPasswords
}: SecuritySettingsFormProps) {
  return (
    <div className={styles.cardShadcn}>
      <div className={styles.cardHeaderShadcn}>
        <div className={styles.cardHeaderFlex}>
          <ShieldAlert size={18} color="var(--text-secondary)" />
          <h2>Security Infrastructure</h2>
        </div>
        <p>Fine-tune operational constraints safeguarding resource pools.</p>
      </div>
      <div className={styles.cardContentShadcn}>
        <div className={styles.formGroup}>
          <label>Session Timeout</label>
          <div className={styles.selectWithIconContainer}>
            <Lock size={14} className={styles.selectInnerIcon} />
            <ShadcnSelect
              value={sessionTimeout}
              onChange={setSessionTimeout}
              placeholder="Session Expiration Block"
              options={[
                { label: "15 minutes of inactivity", value: "15 minutes" },
                { label: "30 minutes of inactivity", value: "30 minutes" },
                { label: "1 hour of inactivity", value: "1 hour" },
                { label: "Never expire sessions", value: "infinite" }
              ]}
            />
          </div>
        </div>

        <div className={styles.separatorShadcn}></div>

        <div className={styles.toggleRow}>
          <div className={styles.switchLabelContainer}>
            <span className={styles.switchTitle}>Enable Two-Factor Authentication</span>
            <span className={styles.switchSubtitle}>Enforce continuous hardware authenticator token prompts for admin keys.</span>
          </div>
          <label className={styles.switchToggle}>
            <input type="checkbox" checked={enable2FA} onChange={(e) => setEnable2FA(e.target.checked)} />
            <span className={styles.slider}></span>
          </label>
        </div>

        <div className={styles.separatorShadcn}></div>

        <div className={styles.toggleRow}>
          <div className={styles.switchLabelContainer}>
            <span className={styles.switchTitle}>Require Strong Passwords</span>
            <span className={styles.switchSubtitle}>Block credential changes failing complexity checks.</span>
          </div>
          <label className={styles.switchToggle}>
            <input type="checkbox" checked={requireStrongPasswords} onChange={(e) => setRequireStrongPasswords(e.target.checked)} />
            <span className={styles.slider}></span>
          </label>
        </div>
      </div>
    </div>
  );
}
