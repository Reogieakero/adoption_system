import React from 'react';
import type { StatusType } from '../types';
import { StatusBadge as BaseStatusBadge } from '@/components/ui/status-badge';

interface StatusBadgeProps {
  status: StatusType;
}

export function StatusBadge({ status }: StatusBadgeProps) {
  return <BaseStatusBadge status={status} variant="adoption" />;
}
