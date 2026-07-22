import React, { useRef } from 'react';
import { X } from 'lucide-react';
import Button from '@/components/ui/button';
import { formatStatus } from '@/lib/format-status';
import styles from './RescueDetailModal.module.css';
import type { AnimalReport, WorkflowAction } from '@/types';
import DataSegment from './DataSegment';
import LocationMapPanel from './LocationMapPanel';
import WorkflowActionSelect from './WorkflowActionSelect';

interface RescueDetailModalProps {
  caseDetails: AnimalReport;
  actions: WorkflowAction[];
  activeAction: WorkflowAction;
  onSelectAction: (action: WorkflowAction) => void;
  onExecuteAction: () => void;
  onClose: () => void;
}

export default function RescueDetailModal({
  caseDetails,
  actions,
  activeAction,
  onSelectAction,
  onExecuteAction,
  onClose
}: RescueDetailModalProps) {
  const leftPanelScrollRef = useRef<HTMLDivElement>(null);

  const triggerScrollStepDown = () => {
    if (leftPanelScrollRef.current) {
      leftPanelScrollRef.current.scrollBy({ top: 240, behavior: 'smooth' });
    }
  };

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modalContent}>
        <div className={styles.modalHeader}>
          <div>
            <h3 className={styles.modalTitle}>Rescue Report Details</h3>
            <span className={styles.modalSubtitle}>Report #{caseDetails.report_id}</span>
          </div>

          <div className={styles.headerControlsGroup}>
            <WorkflowActionSelect
              actions={actions}
              activeAction={activeAction}
              onSelect={onSelectAction}
            />

            <Button
              variant="admin-primary"
              onClick={onExecuteAction}
            >
              Execute Action
            </Button>

            <Button 
              variant="admin-ghost"
              square
              onClick={onClose}
              aria-label="Close Profile"
            >
              <X size={16} />
            </Button>
          </div>
        </div>

        <div className={styles.modalBodyGrid}>
          <div className={styles.modalLeftColumnWrapper}>
            <div className={styles.modalLeftColumn} ref={leftPanelScrollRef}>
              <div className={styles.avatarContainer}>
                <div className={styles.circleAvatarFrame}>
                  <img src={caseDetails.photo_url} alt="Animal Incident Target Profile" className={styles.circleAvatarImage} />
                </div>
              </div>

              <DataSegment
                title="Report Details"
                fields={[
                  { label: 'Report ID', value: caseDetails.report_id },
                  { label: 'Report Status', value: formatStatus(caseDetails.status) },
                  { label: 'Species', value: caseDetails.species },
                  { label: 'Date & Time Reported', value: caseDetails.submitted_at, fullWidth: true }
                ]}
              />

              <DataSegment
                title="Condition & Location"
                fields={[
                  { label: 'Condition', value: caseDetails.condition_description, fullWidth: true },
                  { label: 'Location Area', value: caseDetails.location_area ?? 'N/A', fullWidth: true },
                  { label: 'Latitude', value: caseDetails.latitude },
                  { label: 'Longitude', value: caseDetails.longitude },
                  { label: 'GPS Coordinates', value: `${caseDetails.latitude}, ${caseDetails.longitude}`, fullWidth: true }
                ]}
              />

              <DataSegment
                title="Contact & Notes"
                fields={[
                  { label: 'Contact Preference', value: caseDetails.contact_preference ?? 'N/A' },
                  { label: 'Resolution Notes', value: caseDetails.resolution_notes ?? 'N/A', fullWidth: true },
                  { label: 'Resolved At', value: caseDetails.resolved_at ?? 'Not yet resolved' },
                  { label: 'Last Updated', value: caseDetails.updated_at, fullWidth: true }
                ]}
              />

              <DataSegment
                title="System Info"
                fields={[
                  { label: 'Synced', value: caseDetails.is_synced ? 'Yes' : 'No' },
                  { label: 'Valid for Heatmap', value: caseDetails.is_valid_for_heatmap ? 'Yes' : 'No' }
                ]}
              />
            </div>

            <div className={styles.stickyScrollFooter}>
              <Button
                variant="admin-ghost"
                square
                onClick={triggerScrollStepDown}
                title="Scroll down through report parameters"
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <polyline points="7 13 12 18 17 13"></polyline>
                  <polyline points="7 6 12 11 17 6"></polyline>
                </svg>
              </Button>
            </div>
          </div>

          <LocationMapPanel coords={{ lat: caseDetails.latitude, lon: caseDetails.longitude }} />
        </div>
      </div>
    </div>
  );
}
