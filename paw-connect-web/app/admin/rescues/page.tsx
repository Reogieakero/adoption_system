"use client";

import React, { useState } from 'react';
import styles from './page.module.css';
import { RescueCase, RescueStage, WorkflowAction } from './types';
import { INITIAL_DATA, WORKFLOW_ACTIONS } from './mockData';
import CaseCard from './components/CaseCard';
import CaseTable from './components/CaseTable';
import StageTabs from './components/StageTabs';
import ViewModeToggle, { ViewMode } from './components/ViewModeToggle';
import AllReportsModal from './components/AllReportsModal';
import RescueDetailModal from './components/RescueDetailModal';

const STAGES: RescueStage[] = ['New Reports', 'Verified Reports', 'Rescue Operations'];
const PREVIEW_LIMIT = 3;

export default function RescuesPage() {
  const [cases] = useState<RescueCase[]>(INITIAL_DATA);
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

  const handleExecuteAction = () => {
    if (selectedCaseDetails) {
      alert(`Executed workflow parameter node: "${activeAction.label}" for ${selectedCaseDetails.id}`);
    }
  };

  const stageCounts = STAGES.reduce((acc, stage) => {
    acc[stage] = cases.filter((c) => c.stage === stage).length;
    return acc;
  }, {} as Record<RescueStage, number>);

  const activeTableCases = cases.filter((c) => c.stage === activeTableStage);

  return (
    <div className={styles.container}>
      <header className={styles.headerSection}>
        <h1 className={styles.pageTitle}>Rescue Pipeline Registry</h1>
        <ViewModeToggle viewMode={viewMode} onChange={setViewMode} />
      </header>

      {viewMode === 'cards' ? (
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

                  <button
                    type="button"
                    className={styles.seeAllButton}
                    onClick={() => setActiveStageModal(stage)}
                  >
                    See all reports
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                      <line x1="5" y1="12" x2="19" y2="12" />
                      <polyline points="12 5 19 12 12 19" />
                    </svg>
                  </button>
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
