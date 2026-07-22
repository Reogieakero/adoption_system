import React, { useState } from 'react';
import Button from '@/components/ui/button';
import styles from './AllReportsModal.module.css';
import type { AnimalReport, RescueStage } from '@/types';
import CaseCard from './CaseCard';
import CaseTable from './CaseTable';
import ViewModeToggle, { ViewMode } from './ViewModeToggle';

interface AllReportsModalProps {
  stage: RescueStage;
  stageLabel?: string;
  items: AnimalReport[];
  onView: (item: AnimalReport) => void;
  onAction?: (item: AnimalReport, actionId: string) => void;
  onClose: () => void;
}

export default function AllReportsModal({ stage, stageLabel, items, onView, onAction, onClose }: AllReportsModalProps) {
  const [viewMode, setViewMode] = useState<ViewMode>('cards');

  return (
    <div className={styles.modalOverlay}> {/*[cite: 6] */}
      <div className={styles.modalContent}> {/*[cite: 6] */}
        <div className={styles.modalHeader}> {/*[cite: 6] */}
          <div>
            <h3 className={styles.modalTitle}>{stageLabel ?? stage}</h3> {/*[cite: 6] */}
            <span className={styles.modalSubtitle}>{items.length} total reports</span> {/*[cite: 6] */}
          </div>

          <div className={styles.headerControlsGroup}> {/*[cite: 6] */}
            <ViewModeToggle viewMode={viewMode} onChange={setViewMode} /> {/*[cite: 6] */}
            
            {/* Swapped text close button for an icon-centric X control */}
            <Button 
              variant="admin-ghost"
              square
              onClick={onClose}
              aria-label="Close Modal"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <line x1="18" y1="6" x2="6" y2="18"></line>
                <line x1="6" y1="6" x2="18" y2="18"></line>
              </svg>
            </Button>
          </div>
        </div>

        <div className={styles.modalBody}>
          {viewMode === 'cards' ? ( 
            <div className={styles.reportsGrid}>
              {items.map((item) => (
                <CaseCard key={item.report_id} item={item} onView={onView} onAction={onAction} /> 
              ))}
            </div>
          ) : (
            <CaseTable items={items} onView={onView} onAction={onAction} />
          )}
        </div>
      </div>
    </div>
  );
}
