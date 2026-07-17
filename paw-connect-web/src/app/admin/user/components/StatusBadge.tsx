import React from "react";
import type { UserEntry } from "../types";
import { StatusBadge as BaseStatusBadge } from "@/components/ui/status-badge";

export interface StatusBadgeProps {
  status: UserEntry["status"];
  className?: string;
}

export default function StatusBadge({ status, className }: StatusBadgeProps) {
  return <BaseStatusBadge status={status} variant="user" className={className} />;
}
