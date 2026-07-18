import React from 'react';
import type { AdoptionStatus as StatusType } from '@/types';
import { StatusBadge as BaseStatusBadge } from '@/components/ui/status-badge';

interface StatusBadgeProps {
  status: StatusType;
}

export function StatusBadge({ status }: StatusBadgeProps) {
  return <BaseStatusBadge status={status} variant="adoption" />;
}
