import React from 'react';
import ShadcnSelect from '@/components/ui/shadcn-select';
import type { WorkflowAction } from '@/types';

interface WorkflowActionSelectProps {
  actions: WorkflowAction[];
  activeAction: WorkflowAction;
  onSelect: (action: WorkflowAction) => void;
}

export default function WorkflowActionSelect({
  actions,
  activeAction,
  onSelect
}: WorkflowActionSelectProps) {
  const options = actions.map((a) => ({ label: a.label, value: a.id }));

  return (
    <ShadcnSelect
      options={options}
      value={activeAction.id}
      onChange={(value) => {
        const action = actions.find((a) => a.id === value);
        if (action) onSelect(action);
      }}
      width={220}
    />
  );
}

