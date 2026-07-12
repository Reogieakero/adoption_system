"use client";

import React, { useState, useMemo, useRef, useEffect } from "react";
import { 
  Users, 
  UserCheck, 
  Clock, 
  UserX, 
  Search, 
  SlidersHorizontal, 
  MoreVertical, 
  Eye, 
  FileEdit, 
  ShieldAlert, 
  Trash2, 
  Plus, 
  ChevronLeft, 
  ChevronRight, 
  X,
  Check,
  ChevronDown,
  Info
} from "lucide-react";
import styles from "./User.module.css";

// TypeScript Interfaces for Users Blueprint
interface UserEntry {
  id: string;
  name: string;
  email: string;
  role: "Administrator" | "Citizen" | "Adopter" | "Rescuer";
  phone: string;
  status: "Active" | "Pending" | "Suspended";
  dateRegistered: string;
  lastLogin: string;
  avatarUrl?: string;
  initials: string;
  address: string;
  adoptionApps: number;
  rescueReports: number;
  animalsPosted: number;
  completedModules: number;
}

// Custom Shadcn Dropdown/Select Primitives to respect design directives
function ShadcnSelect({
  value,
  onChange,
  options,
  placeholder
}: {
  value: string;
  onChange: (val: string) => void;
  options: { label: string; value: string }[];
  placeholder: string;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function clickOutside(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", clickOutside);
    return () => document.removeEventListener("mousedown", clickOutside);
  }, []);

  const selected = options.find(o => o.value === value);

  return (
    <div className={styles.selectWrapper} ref={containerRef}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={styles.selectTrigger}
      >
        <span>{selected ? selected.label : placeholder}</span>
        <ChevronDown size={14} className={styles.selectArrow} />
      </button>

      {isOpen && (
        <div className={styles.selectContent}>
          {options.map((opt) => (
            <button
              type="button"
              key={opt.value}
              onClick={() => {
                onChange(opt.value);
                setIsOpen(false);
              }}
              className={`${styles.selectItem} ${value === opt.value ? styles.selectItemActive : ""}`}
            >
              <span className={styles.itemCheckWrapper}>
                {value === opt.value && <Check size={12} />}
              </span>
              <span>{opt.label}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

// Seed Database Mock matching premium system profiles
const INITIAL_USERS: UserEntry[] = [
  {
    id: "usr-9101",
    name: "Alexander Wright",
    email: "a.wright@rescue-core.org",
    role: "Administrator",
    phone: "+1 (555) 234-5678",
    status: "Active",
    dateRegistered: "2025-01-14",
    lastLogin: "2026-07-12 09:32",
    initials: "AW",
    address: "742 Evergreen Terrace, Sector 4, Metro City",
    adoptionApps: 0,
    rescueReports: 14,
    animalsPosted: 32,
    completedModules: 12
  },
  {
    id: "usr-9102",
    name: "Elena Rostova",
    email: "elena.rostova@gmail.com",
    role: "Rescuer",
    phone: "+1 (555) 876-5432",
    status: "Active",
    dateRegistered: "2025-03-22",
    lastLogin: "2026-07-12 08:15",
    initials: "ER",
    address: "102 Ocean View Drive, Apt 4B, Coastal District",
    adoptionApps: 1,
    rescueReports: 47,
    animalsPosted: 5,
    completedModules: 8
  },
  {
    id: "usr-9103",
    name: "Marcus Vance",
    email: "marcus.vance@outlook.com",
    role: "Adopter",
    phone: "+1 (555) 456-7890",
    status: "Pending",
    dateRegistered: "2026-07-11",
    lastLogin: "Never Verified",
    initials: "MV",
    address: "589 Pine Ridge Avenue, Woodland Hills",
    adoptionApps: 2,
    rescueReports: 0,
    animalsPosted: 0,
    completedModules: 1
  },
  {
    id: "usr-9104",
    name: "Sarah Jenkins",
    email: "s.jenkins@citizen-net.org",
    role: "Citizen",
    phone: "+1 (555) 789-0123",
    status: "Suspended",
    dateRegistered: "2024-11-05",
    lastLogin: "2026-06-20 14:22",
    initials: "SJ",
    address: "12 Valley Lane, River Junction",
    adoptionApps: 0,
    rescueReports: 2,
    animalsPosted: 0,
    completedModules: 0
  },
  {
    id: "usr-9105",
    name: "David Miller",
    email: "david.miller@rescue-core.org",
    role: "Rescuer",
    phone: "+1 (555) 345-6789",
    status: "Active",
    dateRegistered: "2025-06-18",
    lastLogin: "2026-07-11 19:40",
    initials: "DM",
    address: "333 Maple Boulevard, Industrial Heights",
    adoptionApps: 0,
    rescueReports: 89,
    animalsPosted: 12,
    completedModules: 10
  }
];

export default function UserManagementPage() {
  const [users, setUsers] = useState<UserEntry[]>(INITIAL_USERS);
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("All");
  const [statusFilter, setStatusFilter] = useState("All");

  // Row Dropdown Tracker State
  const [activeRowMenuId, setActiveRowMenuId] = useState<string | null>(null);
  
  // View Sheet State
  const [selectedUser, setSelectedUser] = useState<UserEntry | null>(null);
  const [isSheetOpen, setIsSheetOpen] = useState(false);

  // Filter Pipeline Engine
  const filteredUsers = useMemo(() => {
    return users.filter((u) => {
      const query = search.toLowerCase();
      const matchesSearch = u.name.toLowerCase().includes(query) || u.email.toLowerCase().includes(query);
      const matchesRole = roleFilter === "All" || u.role === roleFilter;
      const matchesStatus = statusFilter === "All" || u.status === statusFilter;
      return matchesSearch && matchesRole && matchesStatus;
    });
  }, [users, search, roleFilter, statusFilter]);

  // Operational Logic Actions
  const handleToggleStatus = (id: string) => {
    setUsers(users.map(u => {
      if (u.id === id) {
        const nextStatus = u.status === "Suspended" ? "Active" : "Suspended";
        return { ...u, status: nextStatus };
      }
      return u;
    }));
    setActiveRowMenuId(null);
  };

  const handleDeleteUser = (id: string) => {
    if (confirm("Are you sure you want to permanently purge this user record?")) {
      setUsers(users.filter(u => u.id !== id));
    }
    setActiveRowMenuId(null);
  };

  const handleOpenSheet = (user: UserEntry) => {
    setSelectedUser(user);
    setIsSheetOpen(true);
    setActiveRowMenuId(null);
  };

  const handleCloseSheet = () => {
    setIsSheetOpen(false);
    setTimeout(() => setSelectedUser(null), 250);
  };

  // Metrics Count System Computation
  const totalUsers = users.length;
  const activeCount = users.filter(u => u.status === "Active").length;
  const pendingCount = users.filter(u => u.status === "Pending").length;
  const suspendedCount = users.filter(u => u.status === "Suspended").length;

  return (
    <div className={styles.adminContainer}>
      
      {/* PAGE HEADER */}
      <div className={styles.headerContainer}>
        <div className={styles.titleArea}>
          <h1>User Management</h1>
          <p>Manage user accounts, roles, and account status across the platform.</p>
        </div>
        <button 
          className={styles.btnPrimary} 
          onClick={() => alert("Deployment pipeline for creating new unified user accounts triggers modal form.")}
        >
          <Plus size={16} /> Add User
        </button>
      </div>

      {/* SUMMARY CARDS HUD */}
      <div className={styles.summaryGrid}>
        <div className={styles.summaryCard}>
          <div className={styles.summaryCardHeader}>
            <p>Total Users</p>
            <Users size={16} color="#64748b" />
          </div>
          <div className={styles.summaryCardValue}>{totalUsers}</div>
          <p className={styles.summaryCardDesc}>Aggregated registered accounts</p>
        </div>

        <div className={styles.summaryCard}>
          <div className={styles.summaryCardHeader}>
            <p>Active Users</p>
            <UserCheck size={16} color="#10b981" />
          </div>
          <div className={styles.summaryCardValue} style={{ color: "#10b981" }}>{activeCount}</div>
          <p className={styles.summaryCardDesc}>Authenticated platform sessions</p>
        </div>

        <div className={styles.summaryCard}>
          <div className={styles.summaryCardHeader}>
            <p>Pending Verification</p>
            <Clock size={16} color="#f59e0b" />
          </div>
          <div className={styles.summaryCardValue} style={{ color: "#b45309" }}>{pendingCount}</div>
          <p className={styles.summaryCardDesc}>Awaiting validation response</p>
        </div>

        <div className={styles.summaryCard}>
          <div className={styles.summaryCardHeader}>
            <p>Suspended Users</p>
            <UserX size={16} color="#ef4444" />
          </div>
          <div className={styles.summaryCardValue} style={{ color: "#ef4444" }}>{suspendedCount}</div>
          <p className={styles.summaryCardDesc}>Locked out from interface panels</p>
        </div>
      </div>

      {/* SEARCH & FILTER BAR */}
      <div className={styles.filterBar}>
        <div className={styles.searchWrapper}>
          <Search size={14} className={styles.searchIcon} />
          <input
            type="text"
            placeholder="Search by Name or Email..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className={styles.searchInput}
          />
        </div>

        <div className={styles.filterGroup}>
          <div className={styles.selectComponentContainer}>
            <SlidersHorizontal size={12} color="#94a3b8" />
            <ShadcnSelect
              value={roleFilter}
              onChange={setRoleFilter}
              placeholder="All Roles"
              options={[
                { label: "All Roles", value: "All" },
                { label: "Administrator", value: "Administrator" },
                { label: "Citizen", value: "Citizen" },
                { label: "Adopter", value: "Adopter" },
                { label: "Rescuer", value: "Rescuer" }
              ]}
            />
          </div>

          <ShadcnSelect
            value={statusFilter}
            onChange={setStatusFilter}
            placeholder="All Statuses"
            options={[
              { label: "All Statuses", value: "All" },
              { label: "Active", value: "Active" },
              { label: "Pending", value: "Pending" },
              { label: "Suspended", value: "Suspended" }
            ]}
          />
        </div>
      </div>

      {/* USER DATA TABLE */}
      <div className={styles.cardShadcn}>
        {filteredUsers.length > 0 ? (
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
                {filteredUsers.map((user) => (
                  <tr key={user.id} className={styles.tableRowAnimation}>
                    <td>
                      <div className={styles.userProfileCell}>
                        <div className={styles.avatarMock}>{user.initials}</div>
                        <span className={styles.userNameText}>{user.name}</span>
                      </div>
                    </td>
                    <td className={styles.monoCellText}>{user.email}</td>
                    <td>
                      <span className={`${styles.badgeRole} ${
                        user.role === "Administrator" ? styles.roleAdmin :
                        user.role === "Rescuer" ? styles.roleRescuer :
                        user.role === "Adopter" ? styles.roleAdopter : styles.roleCitizen
                      }`}>
                        {user.role}
                      </span>
                    </td>
                    <td className={styles.monoCellText}>{user.phone}</td>
                    <td>
                      <span className={`${styles.badgeStatus} ${
                        user.status === "Active" ? styles.statusActive :
                        user.status === "Pending" ? styles.statusPending : styles.statusSuspended
                      }`}>
                        {user.status}
                      </span>
                    </td>
                    <td className={styles.monoCellText}>{user.dateRegistered}</td>
                    <td className={styles.monoCellText}>{user.lastLogin}</td>
                    <td style={{ textAlign: "right", position: "relative" }}>
                      <button
                        type="button"
                        className={styles.btnRowAction}
                        onClick={() => setActiveRowMenuId(activeRowMenuId === user.id ? null : user.id)}
                      >
                        <MoreVertical size={14} />
                      </button>

                      {/* Dropdown Options Popup */}
                      {activeRowMenuId === user.id && (
                        <div className={styles.dropdownMenuShadcn}>
                          <button 
                            type="button" 
                            className={styles.dropdownItem}
                            onClick={() => handleOpenSheet(user)}
                          >
                            <Eye size={13} /> View Profile
                          </button>
                          <button 
                            type="button" 
                            className={styles.dropdownItem}
                            onClick={() => alert(`Initiating edit pipeline for user metadata context: ${user.name}`)}
                          >
                            <FileEdit size={13} /> Edit Account
                          </button>
                          <button 
                            type="button" 
                            className={`${styles.dropdownItem} ${user.status === 'Suspended' ? styles.actionActivate : styles.actionSuspend}`}
                            onClick={() => handleToggleStatus(user.id)}
                          >
                            <ShieldAlert size={13} /> {user.status === "Suspended" ? "Activate User" : "Suspend User"}
                          </button>
                          <div className={styles.dropdownDivider} />
                          <button 
                            type="button" 
                            className={`${styles.dropdownItem} ${styles.dropdownDanger}`}
                            onClick={() => handleDeleteUser(user.id)}
                          >
                            <Trash2 size={13} /> Delete Record
                          </button>
                        </div>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {/* TABLE PAGINATION PANEL */}
            <div className={styles.paginationContainer}>
              <span className={styles.paginationText}>
                Showing 1-{filteredUsers.length} of {filteredUsers.length} total profiles
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
          /* PURE EMPTY STATE ACCORDING TO DESIGN BLUEPRINT */
          <div className={styles.emptyStateContainer}>
            <div className={styles.emptyIconCircle}>
              <Users size={24} color="#94a3b8" />
            </div>
            <h3>No users found</h3>
            <p>Registered users will appear here once accounts are created.</p>
          </div>
        )}
      </div>

      {/* SHADCN SLIDE-OUT RIGHT SHEET ACCORDING TO ARCHITECTURE DIRECTIVES */}
      <div className={`${styles.sheetOverlay} ${isSheetOpen ? styles.sheetOverlayOpen : ""}`} onClick={handleCloseSheet} />
      <div className={`${styles.sheetContent} ${isSheetOpen ? styles.sheetContentOpen : ""}`}>
        {selectedUser && (
          <div className={styles.drawerInner}>
            <div className={styles.drawerHeader}>
              <div>
                <h2>User Inspection Profile</h2>
                <p>System structural account activity trace metrics</p>
              </div>
              <button type="button" onClick={handleCloseSheet} className={styles.drawerCloseBtn}>
                <X size={16} />
              </button>
            </div>

            <div className={styles.drawerBody}>
              {/* Profile Card Header Block */}
              <div className={styles.drawerAvatarProfileBlock}>
                <div className={styles.drawerAvatarHuge}>{selectedUser.initials}</div>
                <div className={styles.drawerIdentityTextGroup}>
                  <h3>{selectedUser.name}</h3>
                  <span className={`${styles.badgeRole} ${
                    selectedUser.role === "Administrator" ? styles.roleAdmin :
                    selectedUser.role === "Rescuer" ? styles.roleRescuer :
                    selectedUser.role === "Adopter" ? styles.roleAdopter : styles.roleCitizen
                  }`} style={{ width: "fit-content" }}>
                    {selectedUser.role}
                  </span>
                </div>
              </div>

              <div className={styles.separator} />

              {/* Personal Information Module */}
              <div className={styles.drawerSectionTitleFlex}>
                <Info size={13} color="#64748b" />
                <span>Personal Information</span>
              </div>

              <div className={styles.metaDataGridStack}>
                <div className={styles.metaDataRowItem}>
                  <span className={styles.metaItemLabel}>Email Address</span>
                  <span className={styles.metaItemValueValue}>{selectedUser.email}</span>
                </div>
                <div className={styles.metaDataRowItem}>
                  <span className={styles.metaItemLabel}>Contact Number</span>
                  <span className={styles.metaItemValueValue}>{selectedUser.phone}</span>
                </div>
                <div className={styles.metaDataRowItem}>
                  <span className={styles.metaItemLabel}>Residential Address</span>
                  <span className={styles.metaItemValueValue}>{selectedUser.address}</span>
                </div>
                <div className={styles.metaDataRowItem}>
                  <span className={styles.metaItemLabel}>Account Status Integrity</span>
                  <span className={`${styles.badgeStatus} ${
                    selectedUser.status === "Active" ? styles.statusActive :
                    selectedUser.status === "Pending" ? styles.statusPending : styles.statusSuspended
                  }`} style={{ width: "fit-content" }}>
                    {selectedUser.status}
                  </span>
                </div>
                <div className={styles.metaDataRowItem}>
                  <span className={styles.metaItemLabel}>System Onboarding Date</span>
                  <span className={styles.metaItemValueValue}>{selectedUser.dateRegistered}</span>
                </div>
              </div>

              <div className={styles.separator} />

              {/* Account Activity Module */}
              <div className={styles.drawerSectionTitleFlex}>
                <SlidersHorizontal size={13} color="#64748b" />
                <span>Account Activity Metrics</span>
              </div>

              <div className={styles.metricsBoxRowGrid}>
                <div className={styles.activityMetricCellMini}>
                  <span className={styles.metricCellLabel}>Adoption Apps</span>
                  <span className={styles.metricCellNumber}>{selectedUser.adoptionApps}</span>
                </div>
                <div className={styles.activityMetricCellMini}>
                  <span className={styles.metricCellLabel}>Rescue Ops</span>
                  <span className={styles.metricCellNumber}>{selectedUser.rescueReports}</span>
                </div>
                <div className={styles.activityMetricCellMini}>
                  <span className={styles.metricCellLabel}>Animals Posted</span>
                  <span className={styles.metricCellNumber}>{selectedUser.animalsPosted}</span>
                </div>
                <div className={styles.activityMetricCellMini}>
                  <span className={styles.metricCellLabel}>Modules Passed</span>
                  <span className={styles.metricCellNumber}>{selectedUser.completedModules}</span>
                </div>
              </div>

              <div className={styles.metaDataGridStack} style={{ marginTop: "1rem" }}>
                <div className={styles.metaDataRowItem}>
                  <span className={styles.metaItemLabel}>Last Access Timestamp</span>
                  <span className={styles.metaItemValueValue}>{selectedUser.lastLogin}</span>
                </div>
              </div>

            </div>

            <div className={styles.drawerFooter}>
              <button type="button" onClick={handleCloseSheet} className={styles.btnSecondary} style={{ width: "100%" }}>
                Close Profile Inspection Panel
              </button>
            </div>
          </div>
        )}
      </div>

    </div>
  );
}