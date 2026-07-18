import React, { useRef } from 'react';
import Button from '@/components/ui/button';
import styles from './RescueDetailModal.module.css';
import type { RescueCase, WorkflowAction } from '@/types';
import DataSegment from './DataSegment';
import ActivityTimeline from './ActivityTimeline';
import LocationMapPanel from './LocationMapPanel';
import WorkflowActionSelect from './WorkflowActionSelect';

interface RescueDetailModalProps {
  caseDetails: RescueCase;
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
            <span className={styles.modalSubtitle}>Tracking Node Hash Reference: {caseDetails.id}</span>
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

            {/* Changed from Text Button to standard X Icon Close Button */}
            <Button 
              variant="admin-ghost"
              square
              onClick={onClose}
              aria-label="Close Profile"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <line x1="18" y1="6" x2="6" y2="18"></line>
                <line x1="6" y1="6" x2="18" y2="18"></line>
              </svg>
            </Button>
          </div>
        </div>

        <div className={styles.modalBodyGrid}>
          <div className={styles.modalLeftColumnWrapper}>
            <div className={styles.modalLeftColumn} ref={leftPanelScrollRef}>
              <div className={styles.avatarContainer}>
                <div className={styles.circleAvatarFrame}>
                  <img src={caseDetails.imageUrl} alt="Animal Incident Target Profile" className={styles.circleAvatarImage} />
                </div>
              </div>

              <DataSegment
                title="Report Details"
                fields={[
                  { label: 'Report ID', value: caseDetails.id },
                  { label: 'Report Status', value: caseDetails.status },
                  { label: 'Report Type', value: caseDetails.animalType },
                  { label: 'Priority Level', value: caseDetails.priority },
                  { label: 'Date & Time Reported', value: caseDetails.reportedDate, fullWidth: true }
                ]}
              />

              <DataSegment
                title="Animal Details"
                fields={[
                  { label: 'Animal Name', value: caseDetails.animalName },
                  { label: 'Species', value: caseDetails.species },
                  { label: 'Breed', value: caseDetails.breed },
                  { label: 'Estimated Age', value: caseDetails.estimatedAge },
                  { label: 'Sex', value: caseDetails.sex },
                  { label: 'Size', value: caseDetails.size },
                  { label: 'Color/Markings', value: caseDetails.colorMarkings, fullWidth: true },
                  { label: 'Physical Condition', value: caseDetails.condition, fullWidth: true },
                  { label: 'Visible Injuries', value: caseDetails.injuries, fullWidth: true },
                  { label: 'Behavior/Temperament', value: caseDetails.temperament },
                  { label: 'Collar or Tag', value: caseDetails.collarTag }
                ]}
              />

              <DataSegment
                title="Incident Details"
                fields={[
                  { label: 'Incident Description', value: caseDetails.incidentDescription, fullWidth: true },
                  { label: 'Animals Involved', value: caseDetails.animalsInvolved },
                  { label: 'Last Seen Date & Time', value: caseDetails.lastSeen },
                  { label: 'Current Situation', value: caseDetails.currentSituation, fullWidth: true },
                  { label: 'Additional Notes', value: caseDetails.additionalNotes, fullWidth: true }
                ]}
              />

              <DataSegment
                title="Location Details"
                fields={[
                  { label: 'Complete Address', value: caseDetails.location, fullWidth: true },
                  { label: 'Barangay', value: caseDetails.barangay },
                  { label: 'Nearby Landmark', value: caseDetails.landmarks },
                  { label: 'GPS Coordinates', value: `${caseDetails.coords.lat}, ${caseDetails.coords.lon}`, fullWidth: true }
                ]}
              />

              <DataSegment
                title="Reporter Details"
                fields={[
                  { label: 'Reporter Name', value: caseDetails.reporter },
                  { label: 'Contact Number', value: caseDetails.contactNumber },
                  { label: 'Email Address', value: caseDetails.email, fullWidth: true },
                  { label: 'Reporter Type', value: caseDetails.reporterType },
                  { label: 'Anonymous Report', value: caseDetails.anonymous }
                ]}
              />

              <DataSegment
                title="Uploaded Evidence"
                fields={[
                  {
                    label: 'Attached Files List',
                    value: <span className={styles.evidenceLink}>{`\uD83D\uDCF8 ${caseDetails.evidenceFileName}`}</span>,
                    fullWidth: true
                  }
                ]}
              />

              <DataSegment
                title="Rescue Assignment"
                fields={[
                  { label: 'Assigned Rescuer', value: caseDetails.assignedRescuer },
                  { label: 'Rescue Team', value: caseDetails.rescueTeam },
                  { label: 'Assigned Date', value: caseDetails.assignedDate },
                  { label: 'Est. Response Time', value: caseDetails.eta }
                ]}
              />

              <DataSegment
                title="Rescue Progress"
                fields={[
                  { label: 'Current Operational Status', value: caseDetails.operationalStatus },
                  { label: 'Verification Status', value: caseDetails.verificationStatus },
                  { label: 'Dispatch Time', value: caseDetails.dispatchTime },
                  { label: 'Rescue Completion Time', value: caseDetails.completionTime }
                ]}
              />

              <DataSegment
                title="Rescue Outcome"
                fields={[
                  { label: 'Current Outcome Metric', value: caseDetails.outcome, fullWidth: true }
                ]}
              />

              <DataSegment
                title="Admin Notes"
                fields={[
                  { label: 'Internal Dispatch Notes', value: caseDetails.internalNotes, fullWidth: true }
                ]}
              />

              <div className={styles.dataSegmentBlock}>
                <h4 className={styles.segmentTitle}>Activity Timeline</h4>
                <ActivityTimeline steps={caseDetails.timelineSteps} />
              </div>
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

          <LocationMapPanel coords={caseDetails.coords} />
        </div>
      </div>
    </div>
  );
}
