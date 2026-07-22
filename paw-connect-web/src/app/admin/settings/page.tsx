"use client";

import React, { useState } from "react";
import styles from "./page.module.css";
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

type SettingsTab = "general" | "notifications" | "maps" | "elearning" | "system" | "security";

const DEFAULT_ORG_NAME = "Hopeful Paws Sanctuary";
const DEFAULT_CONTACT_EMAIL = "admin@hopefulpaws.org";
const DEFAULT_CONTACT_NUMBER = "+1 (555) 234-5678";
const DEFAULT_OFFICE_ADDRESS = "742 Evergreen Terrace, Sector 7G";
const DEFAULT_NOTIFY_ADOPTION = true;
const DEFAULT_NOTIFY_RESCUE = true;
const DEFAULT_NOTIFY_COMMUNITY = false;
const DEFAULT_NOTIFY_HEALTH = true;
const DEFAULT_NOTIFY_EMAIL = true;
const DEFAULT_MAP_LOCATION = "San Francisco, CA";
const DEFAULT_MAP_ZOOM = "12";
const DEFAULT_ENABLE_HEATMAP = true;
const DEFAULT_MODULE_VISIBILITY = "public";
const DEFAULT_ALLOW_QUIZ_RETAKES = "always";
const DEFAULT_ENABLE_CERTIFICATES = true;
const DEFAULT_ENABLE_REVIEWS = true;
const DEFAULT_DATE_FORMAT = "MM/DD/YYYY";
const DEFAULT_TIME_FORMAT = "12h";
const DEFAULT_TIME_ZONE = "EST";
const DEFAULT_SESSION_TIMEOUT = "30 minutes";
const DEFAULT_ENABLE_2FA = false;
const DEFAULT_REQUIRE_STRONG_PASSWORDS = true;

export default function AdminSettingsPage() {
  const [activeTab, setActiveTab] = useState<SettingsTab>("general");

  const [isBackupDialogOpen, setIsBackupDialogOpen] = useState(false);
  const [dialogAction, setDialogAction] = useState<"backup" | "restore" | "export" | null>(null);

  const [orgName, setOrgName] = useState(DEFAULT_ORG_NAME);
  const [contactEmail, setContactEmail] = useState(DEFAULT_CONTACT_EMAIL);
  const [contactNumber, setContactNumber] = useState(DEFAULT_CONTACT_NUMBER);
  const [officeAddress, setOfficeAddress] = useState(DEFAULT_OFFICE_ADDRESS);

  const [notifyAdoption, setNotifyAdoption] = useState(DEFAULT_NOTIFY_ADOPTION);
  const [notifyRescue, setNotifyRescue] = useState(DEFAULT_NOTIFY_RESCUE);
  const [notifyCommunity, setNotifyCommunity] = useState(DEFAULT_NOTIFY_COMMUNITY);
  const [notifyHealth, setNotifyHealth] = useState(DEFAULT_NOTIFY_HEALTH);
  const [notifyEmail, setNotifyEmail] = useState(DEFAULT_NOTIFY_EMAIL);

  const [mapLocation, setMapLocation] = useState(DEFAULT_MAP_LOCATION);
  const [mapZoom, setMapZoom] = useState(DEFAULT_MAP_ZOOM);
  const [enableHeatmap, setEnableHeatmap] = useState(DEFAULT_ENABLE_HEATMAP);

  const [moduleVisibility, setModuleVisibility] = useState(DEFAULT_MODULE_VISIBILITY);
  const [allowQuizRetakes, setAllowQuizRetakes] = useState(DEFAULT_ALLOW_QUIZ_RETAKES);
  const [enableCertificates, setEnableCertificates] = useState(DEFAULT_ENABLE_CERTIFICATES);
  const [enableReviews, setEnableReviews] = useState(DEFAULT_ENABLE_REVIEWS);

  const [dateFormat, setDateFormat] = useState(DEFAULT_DATE_FORMAT);
  const [timeFormat, setTimeFormat] = useState(DEFAULT_TIME_FORMAT);
  const [timeZone, setTimeZone] = useState(DEFAULT_TIME_ZONE);

  const [sessionTimeout, setSessionTimeout] = useState(DEFAULT_SESSION_TIMEOUT);
  const [enable2FA, setEnable2FA] = useState(DEFAULT_ENABLE_2FA);
  const [requireStrongPasswords, setRequireStrongPasswords] = useState(DEFAULT_REQUIRE_STRONG_PASSWORDS);

  const handleReset = () => {
    setOrgName(DEFAULT_ORG_NAME);
    setContactEmail(DEFAULT_CONTACT_EMAIL);
    setContactNumber(DEFAULT_CONTACT_NUMBER);
    setOfficeAddress(DEFAULT_OFFICE_ADDRESS);
    setNotifyAdoption(DEFAULT_NOTIFY_ADOPTION);
    setNotifyRescue(DEFAULT_NOTIFY_RESCUE);
    setNotifyCommunity(DEFAULT_NOTIFY_COMMUNITY);
    setNotifyHealth(DEFAULT_NOTIFY_HEALTH);
    setNotifyEmail(DEFAULT_NOTIFY_EMAIL);
    setMapLocation(DEFAULT_MAP_LOCATION);
    setMapZoom(DEFAULT_MAP_ZOOM);
    setEnableHeatmap(DEFAULT_ENABLE_HEATMAP);
    setModuleVisibility(DEFAULT_MODULE_VISIBILITY);
    setAllowQuizRetakes(DEFAULT_ALLOW_QUIZ_RETAKES);
    setEnableCertificates(DEFAULT_ENABLE_CERTIFICATES);
    setEnableReviews(DEFAULT_ENABLE_REVIEWS);
    setDateFormat(DEFAULT_DATE_FORMAT);
    setTimeFormat(DEFAULT_TIME_FORMAT);
    setTimeZone(DEFAULT_TIME_ZONE);
    setSessionTimeout(DEFAULT_SESSION_TIMEOUT);
    setEnable2FA(DEFAULT_ENABLE_2FA);
    setRequireStrongPasswords(DEFAULT_REQUIRE_STRONG_PASSWORDS);
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
      <div className={styles.headerContainer}>
        <div className={styles.titleArea}>
          <h1>Settings</h1>
          <p>Configure system preferences and administrative settings.</p>
        </div>
      </div>

      <form onSubmit={handleSave}>
        <SettingsTabs activeTab={activeTab} onTabChange={setActiveTab} />

        <div className={styles.mainGrid}>
          <div className={styles.formContentColumn}>
            {activeTab === "general" && (
              <GeneralSettingsForm
                orgName={orgName} setOrgName={setOrgName}
                contactEmail={contactEmail} setContactEmail={setContactEmail}
                contactNumber={contactNumber} setContactNumber={setContactNumber}
                officeAddress={officeAddress} setOfficeAddress={setOfficeAddress}
              />
            )}
            {activeTab === "notifications" && (
              <NotificationSettingsForm
                notifyAdoption={notifyAdoption} setNotifyAdoption={setNotifyAdoption}
                notifyRescue={notifyRescue} setNotifyRescue={setNotifyRescue}
                notifyCommunity={notifyCommunity} setNotifyCommunity={setNotifyCommunity}
                notifyHealth={notifyHealth} setNotifyHealth={setNotifyHealth}
                notifyEmail={notifyEmail} setNotifyEmail={setNotifyEmail}
              />
            )}
            {activeTab === "maps" && (
              <MapSettingsForm
                mapLocation={mapLocation} setMapLocation={setMapLocation}
                mapZoom={mapZoom} setMapZoom={setMapZoom}
                enableHeatmap={enableHeatmap} setEnableHeatmap={setEnableHeatmap}
              />
            )}
            {activeTab === "elearning" && (
              <ELearningSettingsForm
                moduleVisibility={moduleVisibility} setModuleVisibility={setModuleVisibility}
                allowQuizRetakes={allowQuizRetakes} setAllowQuizRetakes={setAllowQuizRetakes}
                enableCertificates={enableCertificates} setEnableCertificates={setEnableCertificates}
                enableReviews={enableReviews} setEnableReviews={setEnableReviews}
              />
            )}
            {activeTab === "system" && (
              <SystemSettingsForm
                dateFormat={dateFormat} setDateFormat={setDateFormat}
                timeFormat={timeFormat} setTimeFormat={setTimeFormat}
                timeZone={timeZone} setTimeZone={setTimeZone}
              />
            )}
            {activeTab === "security" && (
              <SecuritySettingsForm
                sessionTimeout={sessionTimeout} setSessionTimeout={setSessionTimeout}
                enable2FA={enable2FA} setEnable2FA={setEnable2FA}
                requireStrongPasswords={requireStrongPasswords} setRequireStrongPasswords={setRequireStrongPasswords}
              />
            )}
          </div>

          <BackupRestoreCard
            onBackup={() => openActionDialog("backup")}
            onRestore={() => openActionDialog("restore")}
            onExport={() => openActionDialog("export")}
          />
        </div>

        <SettingsFooter onReset={handleReset} />
      </form>

      <BackupDialog
        isOpen={isBackupDialogOpen}
        action={dialogAction}
        onClose={() => setIsBackupDialogOpen(false)}
        onConfirm={() => { setIsBackupDialogOpen(false); alert("Instruction pushed into scheduling stack successfully."); }}
      />
    </div>
  );
}
