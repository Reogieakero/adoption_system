import React from "react";
import { MoreVertical, ChevronLeft, ChevronRight } from "lucide-react";
import styles from "./UserTable.module.css";
import RoleBadge from "../RoleBadge/RoleBadge";
import StatusBadge from "../StatusBadge/StatusBadge";
import RowActionsMenu from "../RowActionsMenu/RowActionsMenu";
import EmptyState from "../EmptyState/EmptyState";
import type { UserEntry } from "../../types";

export interface UserTableProps {
  users: UserEntry[];
  activeRowMenuId: string | null;
  onToggleRowMenu: (id: string | null) => void;
  onView: (user: UserEntry) => void;
  onEdit: (user: UserEntry) => void;
  onToggleStatus: (id: string) => void;
  onDelete: (id: string) => void;
}

export default function UserTable({
  users,
  activeRowMenuId,
  onToggleRowMenu,
  onView,
  onEdit,
  onToggleStatus,
  onDelete,
}: UserTableProps) {
  return (
    <div className={styles.cardShadcn}>
      {users.length > 0 ? (
        <div className={styles.tableResponsiveContainer}>
          <table className={styles.tableShadcn}>
            <thead>
              <tr>
                <th>User</th>
                <th>Email Address</th>
                <th>Role</th>
                <th>Contact Number</th>
                <th>Status</th>
                <th>Date Registered</th>
                <th>Last Login</th>
                <th style={{ textAlign: "right" }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user.id} className={styles.tableRowAnimation}>
                  <td>
                    <div className={styles.userProfileCell}>
                      <div className={styles.avatarMock}>{user.initials}</div>
                      <span className={styles.userNameText}>{user.name}</span>
                    </div>
                  </td>
                  <td className={styles.monoCellText}>{user.email}</td>
                  <td>
                    <RoleBadge role={user.role} />
                  </td>
                  <td className={styles.monoCellText}>{user.phone}</td>
                  <td>
                    <StatusBadge status={user.status} />
                  </td>
                  <td className={styles.monoCellText}>{user.dateRegistered}</td>
                  <td className={styles.monoCellText}>{user.lastLogin}</td>
                  <td style={{ textAlign: "right", position: "relative" }}>
                    <button
                      type="button"
                      className={styles.btnRowAction}
                      onClick={() => onToggleRowMenu(activeRowMenuId === user.id ? null : user.id)}
                    >
                      <MoreVertical size={14} />
                    </button>

                    {activeRowMenuId === user.id && (
                      <RowActionsMenu
                        user={user}
                        onView={onView}
                        onEdit={onEdit}
                        onToggleStatus={onToggleStatus}
                        onDelete={onDelete}
                      />
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* TABLE PAGINATION PANEL */}
          <div className={styles.paginationContainer}>
            <span className={styles.paginationText}>
              Showing 1-{users.length} of {users.length} total profiles
            </span>
            <div className={styles.paginationButtonGroup}>
              <button type="button" disabled className={styles.paginationBtn}>
                <ChevronLeft size={14} /> Prev
              </button>
              <button type="button" disabled className={styles.paginationBtn}>
                Next <ChevronRight size={14} />
              </button>
            </div>
          </div>
        </div>
      ) : (
        <EmptyState />
      )}
    </div>
  );
}
