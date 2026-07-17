"use client";

import React, { useState } from 'react';
import Button from '@/components/ui/button';
import styles from './page.module.css';
import { RescueCase, RescueStage, WorkflowAction } from './types';
import { WORKFLOW_ACTIONS } from './mockData';
import { useRescues } from '@/hooks/admin/use-rescues';
import {
  assignRescuer,
  updateRescueNotes,
  updateRescuePriority,
  updateRescueStage,
  updateRescueStatus,
} from '@/services/rescues.api';
import CaseCard from './components/CaseCard';
import CaseTable from './components/CaseTable';
import StageTabs from './components/StageTabs';
import ViewModeToggle, { ViewMode } from './components/ViewModeToggle';
import AllReportsModal from './components/AllReportsModal';
import RescueDetailModal from './components/RescueDetailModal';

const STAGES: RescueStage[] = ['New Reports', 'Verified Reports', 'Rescue Operations'];
const PREVIEW_LIMIT = 3;

export default function RescuesPage() {
  const { cases, isLoading, error, refetch, setCases } = useRescues();
  const [viewMode, setViewMode] = useState<ViewMode>('cards');
  const [activeTableStage, setActiveTableStage] = useState<RescueStage>(STAGES[0]);
  const [selectedCaseDetails, setSelectedCaseDetails] = useState<RescueCase | null>(null);
  const [activeStageModal, setActiveStageModal] = useState<RescueStage | null>(null);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [activeAction, setActiveAction] = useState<WorkflowAction>(WORKFLOW_ACTIONS[0]);

  const handleView = (item: RescueCase) => {
    setSelectedCaseDetails(item);
    setIsDropdownOpen(false);
    setActiveAction(WORKFLOW_ACTIONS[0]);
  };

  const handleSelectAction = (action: WorkflowAction) => {
    setActiveAction(action);
    setIsDropdownOpen(false);
  };

  const handleExecuteAction = async () => {
    if (!selectedCaseDetails) return;
    const id = selectedCaseDetails.id;

    try {
      let updated: RescueCase | null = null;

      switch (activeAction.id) {
        case 'verify':
          updated = await updateRescueStage(id, 'Verified Reports');
          break;

        case 'assign': {
          const assignedRescuer = window.prompt('Assign to (rescuer name):', selectedCaseDetails.assignedRescuer);
          if (!assignedRescuer) return;
          const rescueTeam = window.prompt('Rescue team:', selectedCaseDetails.rescueTeam) ?? '';
          const eta = window.prompt('ETA (e.g. "15 Minutes"):', selectedCaseDetails.eta) ?? undefined;
          updated = await assignRescuer(id, assignedRescuer, rescueTeam, eta);
          break;
        }

        case 'priority': {
          const priority = window.prompt(
            'New priority (Critical / High / Medium / Low):',
            selectedCaseDetails.priority
          );
          if (!priority) return;
          updated = await updateRescuePriority(id, priority);
          break;
        }

        case 'status': {
          const status = window.prompt('New status:', selectedCaseDetails.status);
          if (!status) return;
          updated = await updateRescueStatus(id, status);
          break;
        }

        case 'notes': {
          const internalNotes = window.prompt('Internal dispatch notes:', selectedCaseDetails.internalNotes);
          if (internalNotes === null) return;
          updated = await updateRescueNotes(id, internalNotes);
          break;
        }

        case 'close':
          if (!window.confirm(`Close case ${id}? This sets its status to "Closed".`)) return;
          updated = await updateRescueStatus(id, 'Closed');
          break;

        case 'contact':
          if (selectedCaseDetails.anonymous === 'Yes') {
            alert('Reporter contact details are withheld for this anonymous report.');
          } else {
            window.location.href = `mailto:${selectedCaseDetails.email}`;
          }
          return;

        case 'map':
          alert('The location is already shown in the map panel on the right side of this modal.');
          return;

        default:
          alert(`"${activeAction.label}" isn't wired to the backend yet.`);
          return;
      }

      if (updated) {
        const updatedCase = updated;
        setCases((prev) => prev.map((c) => (c.id === updatedCase.id ? updatedCase : c)));
        setSelectedCaseDetails(updatedCase);
      }
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Action failed');
    }
  };

  const stageCounts = STAGES.reduce((acc, stage) => {
    acc[stage] = cases.filter((c) => c.stage === stage).length;
    return acc;
  }, {} as Record<RescueStage, number>);

  const activeTableCases = cases.filter((c) => c.stage === activeTableStage);

  return (
    <div className={styles.container}>
      <div className={styles.headerSection}>
        <ViewModeToggle viewMode={viewMode} onChange={setViewMode} />
      </div>

      {isLoading ? (
        <div className={styles.emptyState}>Loading rescue cases…</div>
      ) : error ? (
        <div className={styles.emptyState}>
          {error}{' '}
          <Button variant="admin-secondary" onClick={() => refetch()}>
            Retry
          </Button>
        </div>
      ) : viewMode === 'cards' ? (
        <div className={styles.sectionsArea}>
          {STAGES.map((stage) => {
            const stageCases = cases.filter((c) => c.stage === stage);
            const previewCases = stageCases.slice(0, PREVIEW_LIMIT);

            return (
              <section key={stage} className={styles.sectionWrapper}>
                <div className={styles.sectionHeader}>
                  <div className={styles.sectionTitleGroup}>
                    <h2 className={styles.sectionTitle}>{stage}</h2>
                    <span className={styles.sectionCount}>{stageCases.length} reports</span>
                  </div>

                  <Button
                    variant="admin-ghost"
                    onClick={() => setActiveStageModal(stage)}
                  >
                    See all reports
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                      <line x1="5" y1="12" x2="19" y2="12" />
                      <polyline points="12 5 19 12 19" />
                    </svg>
                  </Button>
                </div>

                <div className={styles.sectionBody}>
                  {previewCases.length === 0 ? (
                    <div className={styles.emptyState}>No reports in this stage yet</div>
                  ) : (
                    <div className={styles.rescueGrid}>
                      {previewCases.map((item) => (
                        <CaseCard key={item.id} item={item} onView={handleView} />
                      ))}
                    </div>
                  )}
                </div>
              </section>
            );
          })}
        </div>
      ) : (
        <div className={styles.tableArea}>
          <StageTabs
            stages={STAGES}
            counts={stageCounts}
            activeStage={activeTableStage}
            onChange={setActiveTableStage}
          />

          <div className={styles.tableScrollArea}>
            {activeTableCases.length === 0 ? (
              <div className={styles.emptyState}>No reports in this stage yet</div>
            ) : (
              <CaseTable items={activeTableCases} onView={handleView} />
            )}
          </div>
        </div>
      )}

      {activeStageModal && (
        <AllReportsModal
          stage={activeStageModal}
          items={cases.filter((c) => c.stage === activeStageModal)}
          onView={handleView}
          onClose={() => setActiveStageModal(null)}
        />
      )}

      {selectedCaseDetails && (
        <RescueDetailModal
          caseDetails={selectedCaseDetails}
          actions={WORKFLOW_ACTIONS}
          activeAction={activeAction}
          isDropdownOpen={isDropdownOpen}
          onToggleDropdown={() => setIsDropdownOpen(!isDropdownOpen)}
          onSelectAction={handleSelectAction}
          onExecuteAction={handleExecuteAction}
          onClose={() => setSelectedCaseDetails(null)}
        />
      )}
    </div>
  );
}
