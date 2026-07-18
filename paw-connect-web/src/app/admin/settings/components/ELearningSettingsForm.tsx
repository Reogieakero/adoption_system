"use client";

import React from "react";
import { GraduationCap } from "lucide-react";
import ShadcnSelect from '@/components/ui/shadcn-select';
import styles from "../page.module.css";

interface ELearningSettingsFormProps {
  moduleVisibility: string;
  setModuleVisibility: (v: string) => void;
  allowQuizRetakes: string;
  setAllowQuizRetakes: (v: string) => void;
  enableCertificates: boolean;
  setEnableCertificates: (v: boolean) => void;
  enableReviews: boolean;
  setEnableReviews: (v: boolean) => void;
}

export default function ELearningSettingsForm({
  moduleVisibility, setModuleVisibility, allowQuizRetakes, setAllowQuizRetakes, enableCertificates, setEnableCertificates, enableReviews, setEnableReviews
}: ELearningSettingsFormProps) {
  return (
    <div className={styles.cardShadcn}>
      <div className={styles.cardHeaderShadcn}>
        <div className={styles.cardHeaderFlex}>
          <GraduationCap size={18} color="var(--text-secondary)" />
          <h2>E-Learning Settings</h2>
        </div>
        <p>Control educational paradigms and evaluation pathways.</p>
      </div>
      <div className={styles.cardContentShadcn}>
        <div className={styles.formGrid2}>
          <div className={styles.formGroup}>
            <label>Default Module Visibility</label>
            <ShadcnSelect
              value={moduleVisibility}
              onChange={setModuleVisibility}
              placeholder="Select Access Visibility"
              options={[
                { label: "Publicly Visible", value: "public" },
                { label: "Internal Volunteers Only", value: "volunteers" },
                { label: "Strictly Restricted (Draft)", value: "restricted" }
              ]}
            />
          </div>
          <div className={styles.formGroup}>
            <label>Allow Quiz Retakes</label>
            <ShadcnSelect
              value={allowQuizRetakes}
              onChange={setAllowQuizRetakes}
              placeholder="Select Policy Rule"
              options={[
                { label: "Infinite Retakes Allowed", value: "always" },
                { label: "Limited (3 Attempts Max)", value: "limited" },
                { label: "Single Attempt Only", value: "once" }
              ]}
            />
          </div>
        </div>

        <div className={styles.separatorShadcn}></div>

        <div className={styles.toggleRow}>
          <div className={styles.switchLabelContainer}>
            <span className={styles.switchTitle}>Enable Certificates</span>
            <span className={styles.switchSubtitle}>Generate dynamic secure cryptographic pass slips upon completion.</span>
          </div>
          <label className={styles.switchToggle}>
            <input type="checkbox" checked={enableCertificates} onChange={(e) => setEnableCertificates(e.target.checked)} />
            <span className={styles.slider}></span>
          </label>
        </div>

        <div className={styles.separatorShadcn}></div>

        <div className={styles.toggleRow}>
          <div className={styles.switchLabelContainer}>
            <span className={styles.switchTitle}>Enable Module Reviews</span>
            <span className={styles.switchSubtitle}>Permit learners to lodge operational feedback strings on modules.</span>
          </div>
          <label className={styles.switchToggle}>
            <input type="checkbox" checked={enableReviews} onChange={(e) => setEnableReviews(e.target.checked)} />
            <span className={styles.slider}></span>
          </label>
        </div>
      </div>
    </div>
  );
}
