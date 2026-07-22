"use client";

import React from "react";
import { User, Mail, Phone, MapPin } from "lucide-react";
import type { ProfileData } from '@/services/settings.api';
import styles from "../page.module.css";

interface GeneralSettingsFormProps {
  profile: ProfileData;
  onChange: (p: ProfileData) => void;
}

export default function GeneralSettingsForm({ profile, onChange }: GeneralSettingsFormProps) {
  const set = (field: keyof ProfileData) => (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange({ ...profile, [field]: e.target.value });
  };

  return (
    <div className={styles.cardShadcn}>
      <div className={styles.cardHeaderShadcn}>
        <div className={styles.cardHeaderFlex}>
          <User size={18} color="var(--text-secondary)" />
          <h2>Admin Profile</h2>
        </div>
        <p>Your account name and contact information.</p>
      </div>
      <div className={styles.cardContentShadcn}>
        <div className={styles.formGroup}>
          <label>Full Name</label>
          <div className={styles.inputIconWrapper}>
            <User size={14} className={styles.innerIcon} />
            <input
              type="text"
              value={profile.full_name}
              onChange={set('full_name')}
              className={styles.formInputWithIcon}
            />
          </div>
        </div>

        <div className={styles.formGroup}>
          <label>Email</label>
          <div className={styles.inputIconWrapper}>
            <Mail size={14} className={styles.innerIcon} />
            <input
              type="email"
              value={profile.email}
              disabled
              className={styles.formInputWithIcon}
            />
          </div>
        </div>

        <div className={styles.formGrid2}>
          <div className={styles.formGroup}>
            <label>Phone Number</label>
            <div className={styles.inputIconWrapper}>
              <Phone size={14} className={styles.innerIcon} />
              <input
                type="text"
                value={profile.phone_number || ''}
                onChange={set('phone_number')}
                className={styles.formInputWithIcon}
                placeholder="+1 (555) 000-0000"
              />
            </div>
          </div>
        </div>

        <div className={styles.formGroup}>
          <label>Address</label>
          <div className={styles.inputIconWrapper}>
            <MapPin size={14} className={styles.innerIcon} />
            <input
              type="text"
              value={profile.address || ''}
              onChange={set('address')}
              className={styles.formInputWithIcon}
              placeholder="Office address"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
