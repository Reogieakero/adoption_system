"use client";

import React from "react";
import { Building2, Mail, Phone, MapPin, UploadCloud } from "lucide-react";
import styles from "../page.module.css";

interface GeneralSettingsFormProps {
  orgName: string;
  setOrgName: (v: string) => void;
  contactEmail: string;
  setContactEmail: (v: string) => void;
  contactNumber: string;
  setContactNumber: (v: string) => void;
  officeAddress: string;
  setOfficeAddress: (v: string) => void;
}

export default function GeneralSettingsForm({
  orgName, setOrgName, contactEmail, setContactEmail, contactNumber, setContactNumber, officeAddress, setOfficeAddress
}: GeneralSettingsFormProps) {
  return (
    <div className={styles.cardShadcn}>
      <div className={styles.cardHeaderShadcn}>
        <div className={styles.cardHeaderFlex}>
          <Building2 size={18} color="var(--text-secondary)" />
          <h2>General Settings</h2>
        </div>
        <p>Primary legal configuration pipelines for organizational identifiers.</p>
      </div>
      <div className={styles.cardContentShadcn}>
        <div className={styles.formGroup}>
          <label>Organization Name</label>
          <input type="text" value={orgName} onChange={(e) => setOrgName(e.target.value)} className={styles.formInputShadcn} placeholder="Global Organization ID" />
        </div>

        <div className={styles.formGroup}>
          <label>Organization Logo</label>
          <div className={styles.uploadBox}>
            <UploadCloud size={20} color="var(--text-muted)" />
            <span>Click to upload digital stamp assets (SVG, PNG max 2MB)</span>
          </div>
        </div>

        <div className={styles.formGrid2}>
          <div className={styles.formGroup}>
            <label>Contact Email</label>
            <div className={styles.inputIconWrapper}>
              <Mail size={14} className={styles.innerIcon} />
              <input type="email" value={contactEmail} onChange={(e) => setContactEmail(e.target.value)} className={styles.formInputWithIcon} />
            </div>
          </div>
          <div className={styles.formGroup}>
            <label>Contact Number</label>
            <div className={styles.inputIconWrapper}>
              <Phone size={14} className={styles.innerIcon} />
              <input type="text" value={contactNumber} onChange={(e) => setContactNumber(e.target.value)} className={styles.formInputWithIcon} />
            </div>
          </div>
        </div>

        <div className={styles.formGroup}>
          <label>Office Address</label>
          <div className={styles.inputIconWrapper}>
            <MapPin size={14} className={styles.innerIcon} />
            <input type="text" value={officeAddress} onChange={(e) => setOfficeAddress(e.target.value)} className={styles.formInputWithIcon} />
          </div>
        </div>
      </div>
    </div>
  );
}
