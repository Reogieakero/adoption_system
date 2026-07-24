"use client";

import React, { useState } from 'react';
import { FileText, ClipboardCheck, Send, Heart } from 'lucide-react';
import Button from '@/components/ui/button';
import { confirm, ConfirmDialog } from '@/components/ui/confirm-dialog';
import styles from './page.module.css';
import { AnimalReport, RescueStage, WorkflowAction } from '@/types';
import { useRescues } from '@/hooks/admin/use-rescues';
import { updateReportStatus } from '@/services/rescues.api';
import CaseCard from './components/CaseCard';
import CaseTable from './components/CaseTable';
import StageTabs from './components/StageTabs';
import ViewModeToggle, { ViewMode } from './components/ViewModeToggle';
import AllReportsModal from './components/AllReportsModal';
import RescueDetailModal from './components/RescueDetailModal';

const WORKFLOW_ACTIONS_BY_STATUS: Record<string, { id: string; label: string }[]> = {
  submitted: [{ id: 'verify', label: 'Verify Report' }],
  in_progress: [{ id: 'dispatch', label: 'Dispatch Team' }],
  dispatched: [{ id: 'rescue', label: 'Mark Rescued' }],
  resolved: [{ id: 'close', label: 'Close Case' }],
};

const STAGE_LABELS: Record<string, string> = {
  submitted: 'Recent Reports',
  in_progress: 'Verified Reports',
  dispatched: 'Dispatch Team',
  resolved: 'Rescue Operations'
};
const STAGE_ICONS: Record<string, React.ReactNode> = {
  submitted: <FileText size={16} />,
  in_progress: <ClipboardCheck size={16} />,
  dispatched: <Send size={16} />,
  resolved: <Heart size={16} />,
};
const STAGES: RescueStage[] = ['submitted', 'in_progress', 'dispatched', 'resolved'];
const PREVIEW_LIMIT = 6;

export default function RescuesPage() {
  const { cases, isLoading, error, refetch, setCases } = useRescues();
  const [viewMode, setViewMode] = useState<ViewMode>('cards');
  const [activeTableStage, setActiveTableStage] = useState<RescueStage>(STAGES[0]);
  const [selectedCaseDetails, setSelectedCaseDetails] = useState<AnimalReport | null>(null);
  const [activeStageModal, setActiveStageModal] = useState<RescueStage | null>(null);
  const getActionsForStatus = (status: string): WorkflowAction[] =>
    WORKFLOW_ACTIONS_BY_STATUS[status] ?? WORKFLOW_ACTIONS_BY_STATUS.submitted;

  const [activeActions, setActiveActions] = useState<WorkflowAction[]>(getActionsForStatus(STAGES[0]));
  const [activeAction, setActiveAction] = useState<WorkflowAction>(activeActions[0]);

  const handleView = (item: AnimalReport) => {
    setSelectedCaseDetails(item);
    const actions = getActionsForStatus(item.status);
    setActiveActions(actions);
    setActiveAction(actions[0]);
  };

  const handleSelectAction = (action: WorkflowAction) => {
    setActiveAction(action);
  };

  const executeAction = async (reportId: number, actionId: string, locationArea?: string) => {
    try {
      let updated: AnimalReport | null = null;

      switch (actionId) {
        case 'verify': {
          const confirmed = await confirm({
            title: 'Verify Report',
            message: `Verify rescue report #${reportId}? The report will move to Verified.`,
            confirmLabel: 'Verify',
            variant: 'admin-primary',
          });
          if (!confirmed) return null;
          updated = await updateReportStatus(reportId, 'in_progress');
          break;
        }

        case 'dispatch': {
          const confirmed = await confirm({
            title: 'Dispatch Team',
            message: `Dispatch rescue team to ${locationArea ?? 'the reported location'}?`,
            confirmLabel: 'Dispatch',
            variant: 'admin-primary',
          });
          if (!confirmed) return null;
          updated = await updateReportStatus(reportId, 'dispatched');
          break;
        }

        case 'rescue': {
          const confirmed = await confirm({
            title: 'Mark as Rescued',
            message: `Mark case #${reportId} as rescued? The animal will be moved to Rescue Operations.`,
            confirmLabel: 'Mark Rescued',
            variant: 'admin-primary',
          });
          if (!confirmed) return null;
          updated = await updateReportStatus(reportId, 'resolved');
          break;
        }

        case 'close': {
          const confirmed = await confirm({
            title: 'Close Case',
            message: `Are you sure you want to close case #${reportId}? This action cannot be undone.`,
            confirmLabel: 'Close Case',
            variant: 'admin-danger',
          });
          if (!confirmed) return null;
          updated = await updateReportStatus(reportId, 'resolved');
          break;
        }
      }

      if (updated) {
        setCases((prev) => prev.map((c) => (c.report_id === updated.report_id ? updated : c)));
        setSelectedCaseDetails((prev) => (prev?.report_id === updated.report_id ? updated : prev));
      }
      return updated;
    } catch (err) {
      await confirm({
        title: 'Action Failed',
        message: err instanceof Error ? err.message : 'Action failed',
        confirmLabel: 'OK',
      });
      return null;
    }
  };

  const handleExecuteAction = async () => {
    if (!selectedCaseDetails) return;
    const updated = await executeAction(selectedCaseDetails.report_id, activeAction.id, selectedCaseDetails.location_area ?? undefined);
    if (updated) setSelectedCaseDetails(null);
  };

  const handleCaseAction = (item: AnimalReport, actionId: string) => {
    executeAction(item.report_id, actionId, item.location_area ?? undefined);
  };

  const stageCounts = STAGES.reduce((acc, stage) => {
    acc[stage] = cases.filter((c) => c.status === stage).length;
    return acc;
  }, {} as Record<string, number>);

  const activeTableCases = cases.filter((c) => c.status === activeTableStage);

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
            const stageCases = cases.filter((c) => c.status === stage);
            const sorted = [...stageCases].sort((a, b) => new Date(b.submitted_at).getTime() - new Date(a.submitted_at).getTime());
            const previewCases = sorted.slice(0, PREVIEW_LIMIT);

            return (
              <section key={stage} className={styles.sectionWrapper}>
                <div className={styles.sectionHeader}>
                  <div className={styles.sectionTitleGroup}>
                    <span className={styles.sectionIcon}>{STAGE_ICONS[stage]}</span>
                    <h3 className={styles.sectionTitle}>{STAGE_LABELS[stage]}</h3>
                    <span className={styles.sectionCount}>({stageCases.length})</span>
                  </div>

                  <Button
                    variant="admin-ghost"
                    onClick={() => setActiveStageModal(stage)}
                  >
                    See all reports
                  </Button>
                </div>

                <div className={styles.sectionBody}>
                  {previewCases.length === 0 ? (
                    <div className={styles.emptyState}>No reports in this stage yet</div>
                  ) : (
                    <div className={styles.rescueGrid}>
                      {previewCases.map((item) => (
                        <CaseCard key={item.report_id} item={item} onView={handleView} onAction={handleCaseAction} />
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
            labels={STAGE_LABELS}
          />

          <div className={styles.tableScrollArea}>
            {activeTableCases.length === 0 ? (
              <div className={styles.emptyState}>No reports in this stage yet</div>
            ) : (
              <CaseTable items={activeTableCases} onView={handleView} onAction={handleCaseAction} />
            )}
          </div>
        </div>
      )}

      {activeStageModal && (
        <AllReportsModal
          stage={activeStageModal}
          stageLabel={STAGE_LABELS[activeStageModal]}
          items={cases.filter((c) => c.status === activeStageModal)}
          onView={handleView}
          onAction={handleCaseAction}
          onClose={() => setActiveStageModal(null)}
        />
      )}

      {selectedCaseDetails && (
        <RescueDetailModal
          caseDetails={selectedCaseDetails}
          actions={activeActions}
          activeAction={activeAction}
          onSelectAction={handleSelectAction}
          onExecuteAction={handleExecuteAction}
          onClose={() => setSelectedCaseDetails(null)}
        />
      )}

      <ConfirmDialog />
    </div>
  );
}
