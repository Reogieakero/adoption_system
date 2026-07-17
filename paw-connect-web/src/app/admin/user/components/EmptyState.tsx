import React from "react";
import { Users } from "lucide-react";
import EmptyState from '@/components/ui/empty-state';

export interface EmptyStateProps {
  title?: string;
  description?: string;
}

export default function EmptyStateWrapper({
  title = "No users found",
  description = "Registered users will appear here once accounts are created.",
}: EmptyStateProps) {
  return (
    <EmptyState
      icon={<Users size={24} />}
      title={title}
      description={description}
    />
  );
}
