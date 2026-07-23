"use client";

import React, { useState, useMemo } from "react";
import styles from "./page.module.css";
import { useUsers } from "@/hooks/admin/use-users";
import { deleteUser, updateUserStatus } from "@/services/users.api";
import type { AdminUserSummary, UserRole, UserStatus } from "@/types";

type RoleFilterValue = "All" | UserRole;
type StatusFilterValue = "All" | UserStatus;

import SummaryCards from "./components/SummaryCards";
import UserTable from "./components/UserTable";
import UserDetailsDrawer from "./components/UserDetailsDrawer";
import EmptyState from "./components/EmptyState";

export default function UserManagementPage() {
  const { users, isLoading, error, setUsers } = useUsers();
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState<RoleFilterValue>("All");
  const [statusFilter, setStatusFilter] = useState<StatusFilterValue>("All");

  // Row Dropdown Tracker State
  const [activeRowMenuId, setActiveRowMenuId] = useState<string | null>(null);

  // View Sheet State
  const [selectedUser, setSelectedUser] = useState<AdminUserSummary | null>(null);
  const [isSheetOpen, setIsSheetOpen] = useState(false);

  // Filter Pipeline Engine
  const filteredUsers = useMemo(() => {
    return users.filter((u) => {
      const query = search.toLowerCase();
      const matchesSearch =
        u.name.toLowerCase().includes(query) || u.email.toLowerCase().includes(query);
      const matchesRole = roleFilter === "All" || u.role === roleFilter;
      const matchesStatus = statusFilter === "All" || u.status === statusFilter;
      return matchesSearch && matchesRole && matchesStatus;
    });
  }, [users, search, roleFilter, statusFilter]);

  // Operational Logic Actions
  const handleToggleStatus = async (id: string) => {
    setActiveRowMenuId(null);
    const target = users.find((u) => u.id === id);
    if (!target) return;
    const nextStatus = target.status === "suspended" ? "active" : "suspended";

    // optimistic update
    setUsers(users.map((u) => (u.id === id ? { ...u, status: nextStatus } : u)));

    try {
      const updated = await updateUserStatus(id, nextStatus);
      setUsers((prev) => prev.map((u) => (u.id === id ? updated : u)));
    } catch (err) {
      // revert on failure
      setUsers((prev) => prev.map((u) => (u.id === id ? target : u)));
      alert(err instanceof Error ? err.message : "Failed to update user status");
    }
  };

  const handleDeleteUser = async (id: string) => {
    setActiveRowMenuId(null);
    if (!confirm("Are you sure you want to permanently purge this user record?")) return;

    const previous = users;
    setUsers(users.filter((u) => u.id !== id));

    try {
      await deleteUser(id);
    } catch (err) {
      setUsers(previous);
      alert(err instanceof Error ? err.message : "Failed to delete user");
    }
  };

  const handleOpenSheet = (user: AdminUserSummary) => {
    setSelectedUser(user);
    setIsSheetOpen(true);
    setActiveRowMenuId(null);
  };

  const handleCloseSheet = () => {
    setIsSheetOpen(false);
    setTimeout(() => setSelectedUser(null), 250);
  };

  const handleAddUser = () => {
    alert("Deployment pipeline for creating new unified user accounts triggers modal form.");
  };

  // Metrics Count System Computation
  const totalUsers = users.length;
  const activeCount = users.filter((u) => u.status === "active").length;
  const pendingCount = users.filter((u) => u.status === "pending_verification").length;
  const suspendedCount = users.filter((u) => u.status === "suspended").length;

  if (isLoading) {
    return (
      <div className={styles.adminContainer}>
        <div>
          <p>Loading users...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={styles.adminContainer}>
        <EmptyState title="Couldn't load users" description={error} />
      </div>
    );
  }

  return (
    <div className={styles.adminContainer}>
      <SummaryCards
        totalUsers={totalUsers}
        activeCount={activeCount}
        pendingCount={pendingCount}
        suspendedCount={suspendedCount}
      />

      <UserTable
        users={filteredUsers}
        activeRowMenuId={activeRowMenuId}
        onToggleRowMenu={setActiveRowMenuId}
        onView={handleOpenSheet}
        onToggleStatus={handleToggleStatus}
        onDelete={handleDeleteUser}
        search={search}
        onSearchChange={setSearch}
        roleFilter={roleFilter}
        onRoleFilterChange={(v) => setRoleFilter(v as RoleFilterValue)}
        statusFilter={statusFilter}
        onStatusFilterChange={(v) => setStatusFilter(v as StatusFilterValue)}
      />

      <UserDetailsDrawer user={selectedUser} isOpen={isSheetOpen} onClose={handleCloseSheet} />
    </div>
  );
}



