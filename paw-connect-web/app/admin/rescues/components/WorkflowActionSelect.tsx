import React from 'react';
import styles from './WorkflowActionSelect.module.css';
import { WorkflowAction } from '../types';

interface WorkflowActionSelectProps {
  actions: WorkflowAction[];
  activeAction: WorkflowAction;
  isOpen: boolean;
  onToggle: () => void;
  onSelect: (action: WorkflowAction) => void;
}

export default function WorkflowActionSelect({
  actions,
  activeAction,
  isOpen,
  onToggle,
  onSelect
}: WorkflowActionSelectProps) {
  return (
    <div className={styles.customSelectContainer}>
      <button type="button" className={styles.customSelectTrigger} onClick={onToggle}>
        <span>{activeAction.label}</span>
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
          <polyline points="6 9 12 15 18 9"></polyline>
        </svg>
      </button>

      {isOpen && (
        <div className={styles.customSelectMenu}>
          {actions.map((action) => (
            <div
              key={action.id}
              className={`${styles.customSelectItem} ${activeAction.id === action.id ? styles.customSelectItemSelected : ''}`}
              onClick={() => onSelect(action)}
            >
              {action.label}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
