import React from 'react';
import EmptyState from '@/components/ui/empty-state';

interface EmptyStateProps {
  message?: string;
}

export default function EmptyStateWrapper({
  message = 'No animals match your search or filters. Try adjusting them to see more records.',
}: EmptyStateProps) {
  return <EmptyState message={message} />;
}
