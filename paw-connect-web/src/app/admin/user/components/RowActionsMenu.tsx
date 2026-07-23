import React from "react";
import { ShieldAlert, Trash2 } from "lucide-react";
import styles from "./RowActionsMenu.module.css";
import type { UserEntry } from "../types";

export interface RowActionsMenuProps {
  user: UserEntry;
  onView: (user: UserEntry) => void;
  onToggleStatus: (id: string) => void;
  onDelete: (id: string) => void;
}

export default function RowActionsMenu({
  user,
  onView,
  onToggleStatus,
  onDelete,
}: RowActionsMenuProps) {
  const isSuspended = user.status === "suspended";

  return (
    <div className={styles.dropdownMenuShadcn}>
      <button type="button" className={styles.dropdownItem} onClick={() => onView(user)}>
        View Profile
      </button>
      <button
        type="button"
        className={`${styles.dropdownItem} ${isSuspended ? styles.actionActivate : styles.actionSuspend}`}
        onClick={() => onToggleStatus(user.id)}
      >
        <ShieldAlert size={13} /> {isSuspended ? "Activate User" : "Suspend User"}
      </button>
      <div className={styles.dropdownDivider} />
      <button
        type="button"
        className={`${styles.dropdownItem} ${styles.dropdownDanger}`}
        onClick={() => onDelete(user.id)}
      >
        <Trash2 size={13} /> Delete Record
      </button>
    </div>
  );
}

