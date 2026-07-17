import React from "react";
import { MoreVertical, ChevronLeft, ChevronRight } from "lucide-react";
import Button from "@/components/ui/button";
import SearchBar from '@/components/ui/search-bar';
import styles from "./UserTable.module.css";
import ShadcnSelect from '@/components/ui/shadcn-select';
import RoleBadge from "./RoleBadge";
import StatusBadge from "./StatusBadge";
import RowActionsMenu from "./RowActionsMenu";
import EmptyState from "./EmptyState";
import type { UserEntry, RoleFilterValue, StatusFilterValue } from "../types";

const ROLE_OPTIONS = [
  { label: "All Roles", value: "All" },
  { label: "Citizen", value: "Citizen" },
  { label: "Adopter", value: "Adopter" },
  { label: "Rescuer", value: "Rescuer" },
];

const STATUS_OPTIONS = [
  { label: "All", value: "All" },
  { label: "Active", value: "Active" },
  { label: "Pending", value: "Pending" },
  { label: "Suspended", value: "Suspended" },
];

export interface UserTableProps {
  users: UserEntry[];
  activeRowMenuId: string | null;
  onToggleRowMenu: (id: string | null) => void;
  onView: (user: UserEntry) => void;
  onEdit: (user: UserEntry) => void;
  onToggleStatus: (id: string) => void;
  onDelete: (id: string) => void;
  search: string;
  onSearchChange: (value: string) => void;
  roleFilter: RoleFilterValue;
  onRoleFilterChange: (value: string) => void;
  statusFilter: StatusFilterValue;
  onStatusFilterChange: (value: string) => void;
}

export default function UserTable({
  users,
  activeRowMenuId,
  onToggleRowMenu,
  onView,
  onEdit,
  onToggleStatus,
  onDelete,
  search,
  onSearchChange,
  roleFilter,
  onRoleFilterChange,
  statusFilter,
  onStatusFilterChange,
}: UserTableProps) {
  return (
    <div className={styles.cardShadcn}>
      <div className={styles.tableFilters}>
        <div className={styles.searchWrapper}>
          <SearchBar
            value={search}
            onChange={onSearchChange}
            placeholder="Search by Name or Email..."
          />
        </div>
        <div className={styles.filterGroup}>
          <ShadcnSelect
            value={roleFilter}
            onChange={onRoleFilterChange}
            placeholder="All Roles"
            options={ROLE_OPTIONS}
          />
          <ShadcnSelect
            value={statusFilter}
            onChange={onStatusFilterChange}
            placeholder="All Statuses"
            options={STATUS_OPTIONS}
          />
        </div>
      </div>

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
                <th className={styles.thRight}>Actions</th>
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
                  <td className={styles.tdRight}>
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
              <Button variant="admin-secondary" disabled>
                <ChevronLeft size={14} /> Prev
              </Button>
              <Button variant="admin-secondary" disabled>
                Next <ChevronRight size={14} />
              </Button>
            </div>
          </div>
        </div>
      ) : (
        <EmptyState />
      )}
    </div>
  );
}

