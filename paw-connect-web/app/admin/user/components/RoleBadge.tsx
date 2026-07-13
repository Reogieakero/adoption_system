import React from "react";
import styles from "./RoleBadge.module.css";
import type { UserEntry } from "../types";

export interface RoleBadgeProps {
  role: UserEntry["role"];
  className?: string;
}

const ROLE_STYLE_MAP: Record<string, string> = {
  Administrator: "roleAdmin",
  Rescuer: "roleRescuer",
  Adopter: "roleAdopter",
  Citizen: "roleCitizen",
};

export default function RoleBadge({ role, className }: RoleBadgeProps) {
  const roleClass = styles[ROLE_STYLE_MAP[role] ?? "roleCitizen"];

  return (
    <span className={`${styles.badgeRole} ${roleClass} ${className ?? ""}`}>
      {role}
    </span>
  );
}
