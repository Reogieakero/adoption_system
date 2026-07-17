"use client";

import React, { useState } from "react";
import {
  Building2,
  Mail,
  Phone,
  MapPin,
  UploadCloud,
  Bell,
  Map,
  GraduationCap,
  Sliders,
  Database,
  ShieldAlert,
  Save,
  RotateCcw,
  Calendar,
  Clock,
  Globe,
  Lock,
  Download,
  Upload
} from "lucide-react";
import Button from '@/components/ui/button';
import ShadcnSelect from '@/components/ui/shadcn-select';
import styles from "./Settings.module.css";

export default function AdminSettingsPage() {
  // Navigation Tabs State
  const [activeTab, setActiveTab] = useState<"general" | "notifications" | "maps" | "elearning" | "system" | "security">("general");

  // Dialog State for Backup Management
  const [isBackupDialogOpen, setIsBackupDialogOpen] = useState(false);
  const [dialogAction, setDialogAction] = useState<"backup" | "restore" | "export" | null>(null);

  // Form Configurations & Defaults
  const [orgName, setOrgName] = useState("Hopeful Paws Sanctuary");
  const [contactEmail, setContactEmail] = useState("admin@hopefulpaws.org");
  const [contactNumber, setContactNumber] = useState("+1 (555) 234-5678");
  const [officeAddress, setOfficeAddress] = useState("742 Evergreen Terrace, Sector 7G");
  
  // Toggle Switch Flags
  const [notifyAdoption, setNotifyAdoption] = useState(true);
  const [notifyRescue, setNotifyRescue] = useState(true);
  const [notifyCommunity, setNotifyCommunity] = useState(false);
  const [notifyHealth, setNotifyHealth] = useState(true);
  const [notifyEmail, setNotifyEmail] = useState(true);

  const [mapLocation, setMapLocation] = useState("San Francisco, CA");
  const [mapZoom, setMapZoom] = useState("12");
  const [enableHeatmap, setEnableHeatmap] = useState(true);

  const [moduleVisibility, setModuleVisibility] = useState("public");
  const [allowQuizRetakes, setAllowQuizRetakes] = useState("always");
  const [enableCertificates, setEnableCertificates] = useState(true);
  const [enableReviews, setEnableReviews] = useState(true);

  const [dateFormat, setDateFormat] = useState("MM/DD/YYYY");
  const [timeFormat, setTimeFormat] = useState("12h");
  const [timeZone, setTimeZone] = useState("EST");

  const [sessionTimeout, setSessionTimeout] = useState("30 minutes");
  const [enable2FA, setEnable2FA] = useState(false);
  const [requireStrongPasswords, setRequireStrongPasswords] = useState(true);

  const handleReset = () => {
    setOrgName("Hopeful Paws Sanctuary");
    setContactEmail("admin@hopefulpaws.org");
    setContactNumber("+1 (555) 234-5678");
    setOfficeAddress("742 Evergreen Terrace, Sector 7G");
    setNotifyAdoption(true);
    setNotifyRescue(true);
    setNotifyCommunity(false);
    setNotifyHealth(true);
    setNotifyEmail(true);
    setMapLocation("San Francisco, CA");
    setMapZoom("12");
    setEnableHeatmap(true);
    setModuleVisibility("public");
    setAllowQuizRetakes("always");
    setEnableCertificates(true);
    setEnableReviews(true);
    setDateFormat("MM/DD/YYYY");
    setTimeFormat("12h");
    setTimeZone("EST");
    setSessionTimeout("30 minutes");
    setEnable2FA(false);
    setRequireStrongPasswords(true);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    alert("System configurations updated successfully across global settings structures.");
  };

  const openActionDialog = (action: "backup" | "restore" | "export") => {
    setDialogAction(action);
    setIsBackupDialogOpen(true);
  };

  return (
    <div className={styles.adminContainer}>
      {/* PAGE HEADER */}
      <div className={styles.headerContainer}>
        <div className={styles.titleArea}>
          <h1>Settings</h1>
          <p>Configure system preferences and administrative settings.</p>
        </div>
      </div>

      <form onSubmit={handleSave}>
        {/* TABS CONTROLLER BAR */}
        <div className={styles.tabsListShadcn}>
          <Button variant="admin-ghost" active={activeTab === "general"} onClick={() => setActiveTab("general")}>General</Button>
          <Button variant="admin-ghost" active={activeTab === "notifications"} onClick={() => setActiveTab("notifications")}>Notifications</Button>
          <Button variant="admin-ghost" active={activeTab === "maps"} onClick={() => setActiveTab("maps")}>Map Specs</Button>
          <Button variant="admin-ghost" active={activeTab === "elearning"} onClick={() => setActiveTab("elearning")}>E-Learning</Button>
          <Button variant="admin-ghost" active={activeTab === "system"} onClick={() => setActiveTab("system")}>System Config</Button>
          <Button variant="admin-ghost" active={activeTab === "security"} onClick={() => setActiveTab("security")}>Security</Button>
        </div>

        {/* CONTENT PANELS CONTAINER */}
        <div className={styles.mainGrid}>
          <div className={styles.formContentColumn}>
            
            {/* GENERAL SETTINGS CARD */}
            {activeTab === "general" && (
              <div className={styles.cardShadcn}>
                <div className={styles.cardHeaderShadcn}>
                  <div className={styles.cardHeaderFlex}>
                    <Building2 size={18} color="#64748b" />
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
                      <UploadCloud size={20} color="#94a3b8" />
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
            )}

            {/* NOTIFICATION SETTINGS CARD */}
            {activeTab === "notifications" && (
              <div className={styles.cardShadcn}>
                <div className={styles.cardHeaderShadcn}>
                  <div className={styles.cardHeaderFlex}>
                    <Bell size={18} color="#64748b" />
                    <h2>Notification Settings</h2>
                  </div>
                  <p>Toggle dispatching hooks for webhooks and automated messaging grids.</p>
                </div>
                <div className={styles.cardContentShadcn}>
                  <div className={styles.toggleRow}>
                    <div className={styles.switchLabelContainer}>
                      <span className={styles.switchTitle}>Enable Adoption Notifications</span>
                      <span className={styles.switchSubtitle}>Trigger instantaneous signals when application status logs update.</span>
                    </div>
                    <label className={styles.switchToggle}>
                      <input type="checkbox" checked={notifyAdoption} onChange={(e) => setNotifyAdoption(e.target.checked)} />
                      <span className={styles.slider}></span>
                    </label>
                  </div>

                  <div className={styles.separatorShadcn}></div>

                  <div className={styles.toggleRow}>
                    <div className={styles.switchLabelContainer}>
                      <span className={styles.switchTitle}>Enable Rescue Notifications</span>
                      <span className={styles.switchSubtitle}>Dispatch dispatch signals to active teams on inbound cases.</span>
                    </div>
                    <label className={styles.switchToggle}>
                      <input type="checkbox" checked={notifyRescue} onChange={(e) => setNotifyRescue(e.target.checked)} />
                      <span className={styles.slider}></span>
                    </label>
                  </div>

                  <div className={styles.separatorShadcn}></div>

                  <div className={styles.toggleRow}>
                    <div className={styles.switchLabelContainer}>
                      <span className={styles.switchTitle}>Enable Community Report Notifications</span>
                      <span className={styles.switchSubtitle}>Flag down review protocols when citizen incident reports surface.</span>
                    </div>
                    <label className={styles.switchToggle}>
                      <input type="checkbox" checked={notifyCommunity} onChange={(e) => setNotifyCommunity(e.target.checked)} />
                      <span className={styles.slider}></span>
                    </label>
                  </div>

                  <div className={styles.separatorShadcn}></div>

                  <div className={styles.toggleRow}>
                    <div className={styles.switchLabelContainer}>
                      <span className={styles.switchTitle}>Enable Health Monitoring Alerts</span>
                      <span className={styles.switchSubtitle}>System telemetry indicators for medical schedule violations.</span>
                    </div>
                    <label className={styles.switchToggle}>
                      <input type="checkbox" checked={notifyHealth} onChange={(e) => setNotifyHealth(e.target.checked)} />
                      <span className={styles.slider}></span>
                    </label>
                  </div>

                  <div className={styles.separatorShadcn}></div>

                  <div className={styles.toggleRow}>
                    <div className={styles.switchLabelContainer}>
                      <span className={styles.switchTitle}>Enable Email Notifications</span>
                      <span className={styles.switchSubtitle}>Route system updates directly to linked administrative mail servers.</span>
                    </div>
                    <label className={styles.switchToggle}>
                      <input type="checkbox" checked={notifyEmail} onChange={(e) => setNotifyEmail(e.target.checked)} />
                      <span className={styles.slider}></span>
                    </label>
                  </div>
                </div>
              </div>
            )}

            {/* MAP SETTINGS CARD */}
            {activeTab === "maps" && (
              <div className={styles.cardShadcn}>
                <div className={styles.cardHeaderShadcn}>
                  <div className={styles.cardHeaderFlex}>
                    <Map size={18} color="#64748b" />
                    <h2>Map Settings</h2>
                  </div>
                  <p>Configure mapping matrices for active geo-tracking panels.</p>
                </div>
                <div className={styles.cardContentShadcn}>
                  <div className={styles.formGrid2}>
                    <div className={styles.formGroup}>
                      <label>Default Map Location</label>
                      <input type="text" value={mapLocation} onChange={(e) => setMapLocation(e.target.value)} className={styles.formInputShadcn} />
                    </div>
                    <div className={styles.formGroup}>
                      <label>Default Map Zoom Level</label>
                      <ShadcnSelect
                        value={mapZoom}
                        onChange={setMapZoom}
                        placeholder="Zoom Level"
                        options={[
                          { label: "Street Level (18)", value: "18" },
                          { label: "City Wide (12)", value: "12" },
                          { label: "Regional (8)", value: "8" },
                          { label: "Continental (4)", value: "4" }
                        ]}
                      />
                    </div>
                  </div>

                  <div className={styles.separatorShadcn}></div>

                  <div className={styles.toggleRow}>
                    <div className={styles.switchLabelContainer}>
                      <span className={styles.switchTitle}>Enable Heatmap</span>
                      <span className={styles.switchSubtitle}>Visualize heavy-density vectors of incident calls across clusters.</span>
                    </div>
                    <label className={styles.switchToggle}>
                      <input type="checkbox" checked={enableHeatmap} onChange={(e) => setEnableHeatmap(e.target.checked)} />
                      <span className={styles.slider}></span>
                    </label>
                  </div>
                </div>
              </div>
            )}

            {/* E-LEARNING SETTINGS CARD */}
            {activeTab === "elearning" && (
              <div className={styles.cardShadcn}>
                <div className={styles.cardHeaderShadcn}>
                  <div className={styles.cardHeaderFlex}>
                    <GraduationCap size={18} color="#64748b" />
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
            )}

            {/* SYSTEM SETTINGS CARD */}
            {activeTab === "system" && (
              <div className={styles.cardShadcn}>
                <div className={styles.cardHeaderShadcn}>
                  <div className={styles.cardHeaderFlex}>
                    <Sliders size={18} color="#64748b" />
                    <h2>System Settings</h2>
                  </div>
                  <p>Establish structural localization constraints across database layers.</p>
                </div>
                <div className={styles.cardContentShadcn}>
                  <div className={styles.formGroup}>
                    <label>Date Format</label>
                    <div className={styles.selectWithIconContainer}>
                      <Calendar size={14} className={styles.selectInnerIcon} />
                      <ShadcnSelect
                        value={dateFormat}
                        onChange={setDateFormat}
                        placeholder="Choose Configuration"
                        options={[
                          { label: "MM/DD/YYYY (Standard ISO)", value: "MM/DD/YYYY" },
                          { label: "DD/MM/YYYY (European Format)", value: "DD/MM/YYYY" },
                          { label: "YYYY-MM-DD (Universal Ledger)", value: "YYYY-MM-DD" }
                        ]}
                      />
                    </div>
                  </div>

                  <div className={styles.formGrid2}>
                    <div className={styles.formGroup}>
                      <label>Time Format</label>
                      <div className={styles.selectWithIconContainer}>
                        <Clock size={14} className={styles.selectInnerIcon} />
                        <ShadcnSelect
                          value={timeFormat}
                          onChange={setTimeFormat}
                          placeholder="Select Clock Grid"
                          options={[
                            { label: "12-Hour (AM/PM)", value: "12h" },
                            { label: "24-Hour (Military Standard)", value: "24h" }
                          ]}
                        />
                      </div>
                    </div>

                    <div className={styles.formGroup}>
                      <label>Time Zone</label>
                      <div className={styles.selectWithIconContainer}>
                        <Globe size={14} className={styles.selectInnerIcon} />
                        <ShadcnSelect
                          value={timeZone}
                          onChange={setTimeZone}
                          placeholder="Select Base Zone"
                          options={[
                            { label: "GMT -5 (Eastern Standard Time)", value: "EST" },
                            { label: "GMT -8 (Pacific Standard Time)", value: "PST" },
                            { label: "GMT +0 (Universal Coordinates)", value: "UTC" },
                            { label: "GMT +8 (Philippine Standard Time)", value: "PHT" }
                          ]}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* SECURITY SETTINGS CARD */}
            {activeTab === "security" && (
              <div className={styles.cardShadcn}>
                <div className={styles.cardHeaderShadcn}>
                  <div className={styles.cardHeaderFlex}>
                    <ShieldAlert size={18} color="#64748b" />
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
            )}

          </div>

          {/* ASIDE COLUMN: BACKUP & RESTORE PIPELINES */}
          <div className={styles.sidebarColumn}>
            <div className={styles.cardShadcn}>
              <div className={styles.cardHeaderShadcn}>
                <div className={styles.cardHeaderFlex}>
                  <Database size={18} color="#64748b" />
                  <h2>Backup & Restore</h2>
                </div>
                <p>System cluster snapshot states and archival pipelines.</p>
              </div>
              <div className={styles.cardContentShadcn}>
                <div className={styles.badgeInfoRow}>
                  <span className={styles.badgeLabel}>Last Backup State</span>
                  <span className={styles.badgeShadcn}>July 12, 2026 - 04:12 UTC</span>
                </div>

                <div className={styles.backupActionsGrid}>
                  <Button variant="admin-secondary" onClick={() => openActionDialog("backup")} className={styles.btnActionUtility}>
                    <Download size={14} /> Backup Database
                  </Button>
                  <Button variant="admin-secondary" onClick={() => openActionDialog("restore")} className={styles.btnActionUtility}>
                    <Upload size={14} /> Restore Database
                  </Button>
                  <Button variant="admin-secondary" onClick={() => openActionDialog("export")} className={`${styles.btnActionUtility} ${styles.btnActionFull}`}>
                    Export System Configuration Data
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* STICKY FOOTER SAVE DRAWER BAR */}
        <div className={styles.stickyFooterShadcn}>
          <div className={styles.footerFlexContainer}>
            <span className={styles.footerStatusMessage}>Unsaved system config nodes detected</span>
            <div className={styles.footerActionButtonGroup}>
              <Button variant="admin-secondary" onClick={handleReset}>
                <RotateCcw size={14} /> Reset Changes
              </Button>
              <Button variant="admin-primary" type="submit">
                <Save size={14} /> Save Changes
              </Button>
            </div>
          </div>
        </div>
      </form>

      {/* MODAL DIALOG CONTAINER */}
      {isBackupDialogOpen && (
        <div className={styles.modalOverlay}>
          <div className={styles.modalContent}>
            <div className={styles.modalHeader}>
              <h2>Confirm Action</h2>
              <p>Are you sure you want to execute the global operational instruction string: <strong>{dialogAction?.toUpperCase()}</strong>?</p>
            </div>
            <p className={styles.dialogNoticeText}>
              Executing transactional parameters on live relational databases changes telemetry logging tracks instantly. Check target indices before proceeding.
            </p>
            <div className={styles.modalFooter}>
              <Button variant="admin-secondary" onClick={() => setIsBackupDialogOpen(false)}>Abort</Button>
              <Button variant="admin-primary" onClick={() => { setIsBackupDialogOpen(false); alert("Instruction pushed into scheduling stack successfully."); }}>Confirm</Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
