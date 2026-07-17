"use client";

import React from "react";
import EmptyState from '@/components/ui/empty-state';

interface EmptyStateProps {
  icon: React.ReactNode;
  title: string;
  description?: string;
  actionLabel?: string;
  onAction?: () => void;
}

export default function EmptyStateWrapper({ icon, title, description, actionLabel, onAction }: EmptyStateProps) {
  return (
    <EmptyState
      icon={icon}
      title={title}
      description={description}
      actionLabel={actionLabel}
      onAction={onAction}
    />
  );
}
