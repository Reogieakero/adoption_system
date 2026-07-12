"use client";

import React, { useState, useRef, useEffect } from "react";
import {
  ListFilter,
  Search,
  Calendar as CalendarIcon,
  Download,
  Activity,
  CheckCircle2,
  XCircle,
  Clock,
  Eye,
  ChevronLeft,
  ChevronRight,
  User,
  Shield,
  FileText,
  Info,
  X,
  SlidersHorizontal,
  ChevronDown,
  Check
} from "lucide-react";
import styles from "./Logs.module.css";

// Interface Definitions
interface LogEntry {
  id: string;
  timestamp: string;
  user: string;
  role: string;
  module: "Animal" | "Adoption" | "Rescue" | "Reports" | "E-Learning" | "User" | "Settings" | "Authentication";
  activity: string;
  status: "Success" | "Failed";
  description: string;
}

// Custom Shadcn Dropdown/Select Primitive
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
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function clickOutside(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", clickOutside);
    return () => document.removeEventListener("mousedown", clickOutside);
  }, []);

  const selected = options.find(o => o.value === value);

  return (
    <div className={styles.selectWrapper} ref={dropdownRef}>
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

// CUSTOM SHADCN POPOVER CALENDAR COMPONENT
function ShadcnDatePicker({
  selectedDate,
  onDateChange
}: {
  selectedDate: Date;
  onDateChange: (date: Date) => void;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const calendarRef = useRef<HTMLDivElement>(null);
  
  // Static view navigation for mock demonstration (July 2026)
  const [currentMonth, setCurrentMonth] = useState(6); // July
  const [currentYear, setCurrentYear] = useState(2026);

  useEffect(() => {
    function clickOutside(e: MouseEvent) {
      if (calendarRef.current && !calendarRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", clickOutside);
    return () => document.removeEventListener("mousedown", clickOutside);
  }, []);

  // Format date display matching shadcn placeholder format
  const formatDateString = (date: Date) => {
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "2-digit",
      year: "numeric"
    });
  };

  // Generate exact grid numbers for July 2026 (Starts on a Wednesday)
  const totalDaysInJuly = 31;
  const paddingDaysBefore = 3; // Sun, Mon, Tue empty slots
  const blankDays = Array(paddingDaysBefore).fill(null);
  const dayNumbers = Array.from({ length: totalDaysInJuly }, (_, i) => i + 1);
  const combinedGrid = [...blankDays, ...dayNumbers];

  const handleDayClick = (day: number) => {
    const newDate = new Date(currentYear, currentMonth, day);
    onDateChange(newDate);
    setIsOpen(false);
  };

  return (
    <div className={styles.datePickerContainer} ref={calendarRef}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={`${styles.datePickerTrigger} ${isOpen ? styles.datePickerTriggerActive : ""}`}
      >
        <CalendarIcon size={14} className={styles.dateIconLeft} />
        <span>{formatDateString(selectedDate)}</span>
      </button>

      {isOpen && (
        <div className={styles.calendarPopoverShadcn}>
          {/* Calendar Header Control Grid */}
          <div className={styles.calendarHeader}>
            <button type="button" className={styles.calendarNavBtn}>
              <ChevronLeft size={14} />
            </button>
            <div className={styles.calendarMonthLabel}>July 2026</div>
            <button type="button" className={styles.calendarNavBtn}>
              <ChevronRight size={14} />
            </button>
          </div>

          {/* Calendar Weekday Row */}
          <div className={styles.calendarWeekdaysGrid}>
            <span>Su</span><span>Mo</span><span>Tu</span><span>We</span><span>Th</span><span>Fr</span><span>Sa</span>
          </div>

          {/* Calendar Day Grid Area */}
          <div className={styles.calendarDaysGrid}>
            {combinedGrid.map((day, idx) => {
              if (day === null) {
                return <div key={`blank-${idx}`} className={styles.calendarBlankCell} />;
              }
              const isSelected = selectedDate.getDate() === day && selectedDate.getMonth() === currentMonth;
              return (
                <button
                  type="button"
                  key={`day-${day}`}
                  onClick={() => handleDayClick(day)}
                  className={`${styles.calendarDayCell} ${isSelected ? styles.calendarDaySelected : ""}`}
                >
                  {day}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}

// Mock Audit Logs
const MOCK_LOGS: LogEntry[] = [
  {
    id: "log-8401",
    timestamp: "2026-07-12 09:14:22",
    user: "Sarah Jenkins",
    role: "Administrator",
    module: "Adoption",
    activity: "Approved adoption request",
    status: "Success",
    description: "Successfully processed and approved adoption pipeline case #ADP-9942 for Golden Retriever 'Max'."
  },
  {
    id: "log-8402",
    timestamp: "2026-07-12 08:55:10",
    user: "David Miller",
    role: "Rescue Coordinator",
    module: "Rescue",
    activity: "Assigned rescue operation",
    status: "Success",
    description: "Dispatched Emergency Response Team Alpha to regional sector coordinates for complex canine extraction."
  },
  {
    id: "log-8403",
    timestamp: "2026-07-12 08:32:15",
    user: "System Core",
    role: "Automated Worker",
    module: "Authentication",
    activity: "User logged in",
    status: "Success",
    description: "Secure session initiated via multi-factor authentication handshake from IP: 192.168.1.84"
  },
  {
    id: "log-8404",
    timestamp: "2026-07-12 07:12:01",
    user: "Elena Rostova",
    role: "Educator",
    module: "E-Learning",
    activity: "Published learning module",
    status: "Success",
    description: "Successfully deployed educational resource: 'Post-Adoption Acclimation & Behavioral Baseline Blueprint'."
  },
  {
    id: "log-8405",
    timestamp: "2026-07-11 23:45:19",
    user: "Alex Mercer",
    role: "Support Representative",
    module: "Reports",
    activity: "Resolved community report",
    status: "Success",
    description: "Marked hazard ticket #REP-4091 as verified and cleared following municipal intervention teams' confirmation."
  },
  {
    id: "log-8406",
    timestamp: "2026-07-11 18:22:40",
    user: "Marcus Vance",
    role: "Junior Admin",
    module: "Settings",
    activity: "Updated system settings",
    status: "Failed",
    description: "Attempted global overwrite of operational time-zone schemas without required multi-signature credentials."
  },
  {
    id: "log-8407",
    timestamp: "2026-07-11 14:10:05",
    user: "Sarah Jenkins",
    role: "Administrator",
    module: "Animal",
    activity: "Added a new animal",
    status: "Success",
    description: "Created master database record for feline stray ID: #ANI-0042 (Domestic Shorthair)."
  }
];

export default function ActivityLogsPage() {
  const [search, setSearch] = useState("");
  const [moduleFilter, setModuleFilter] = useState("All");
  const [statusFilter, setStatusFilter] = useState("All");
  const [auditDate, setAuditDate] = useState<Date>(new Date(2026, 6, 12)); // Defaults to July 12, 2026
  
  const [selectedLog, setSelectedLog] = useState<LogEntry | null>(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  const filteredLogs = MOCK_LOGS.filter((log) => {
    const matchesSearch =
      log.user.toLowerCase().includes(search.toLowerCase()) ||
      log.activity.toLowerCase().includes(search.toLowerCase()) ||
      log.id.toLowerCase().includes(search.toLowerCase());
    const matchesModule = moduleFilter === "All" || log.module === moduleFilter;
    const matchesStatus = statusFilter === "All" || log.status === statusFilter;
    return matchesSearch && matchesModule && matchesStatus;
  });

  const handleOpenDrawer = (log: LogEntry) => {
    setSelectedLog(log);
    setIsDrawerOpen(true);
  };

  const handleCloseDrawer = () => {
    setIsDrawerOpen(false);
    setTimeout(() => setSelectedLog(null), 300);
  };

  return (
    <div className={styles.adminContainer}>
      
      {/* PAGE HEADER */}
      <div className={styles.headerContainer}>
        <div className={styles.titleArea}>
          <h1>Activity Logs</h1>
          <p>Track important activities performed across the system.</p>
        </div>
        
        <div className={styles.headerActions}>
          {/* ADVANCED CALENDAR DROP DOWN VALUE COMPONENT */}
          <ShadcnDatePicker selectedDate={auditDate} onDateChange={setAuditDate} />
          
          <button type="button" className={styles.btnSecondary} onClick={() => alert("Exporting audit trails...")}>
            <Download size={14} /> Export Logs
          </button>
        </div>
      </div>

      {/* SUMMARY CARDS METRICS SYSTEM */}
      <div className={styles.summaryGrid}>
        <div className={styles.summaryCard}>
          <div className={styles.summaryCardHeader}>
            <p>Total Logs</p>
            <Activity size={16} color="#64748b" />
          </div>
          <div className={styles.summaryCardValue}>1,482</div>
          <p className={styles.summaryCardDesc}>Aggregated lifetime logs across storage modules</p>
        </div>
        
        <div className={styles.summaryCard}>
          <div className={styles.summaryCardHeader}>
            <p>Today's Activities</p>
            <Clock size={16} color="#0f172a" />
          </div>
          <div className={styles.summaryCardValue}>42</div>
          <p className={styles.summaryCardDesc}>Actions compiled within current runtime</p>
        </div>

        <div className={styles.summaryCard}>
          <div className={styles.summaryCardHeader}>
            <p>Successful Actions</p>
            <CheckCircle2 size={16} color="#10b981" />
          </div>
          <div className={styles.summaryCardValue} style={{ color: "#10b981" }}>1,475</div>
          <p className={styles.summaryCardDesc}>Transactional commits successfully resolved</p>
        </div>

        <div className={styles.summaryCard}>
          <div className={styles.summaryCardHeader}>
            <p>Failed Actions</p>
            <XCircle size={16} color="#ef4444" />
          </div>
          <div className={styles.summaryCardValue} style={{ color: "#ef4444" }}>7</div>
          <p className={styles.summaryCardDesc}>Operations triggering security or system blocks</p>
        </div>
      </div>

      {/* SEARCH AND FILTER HUD BAR */}
      <div className={styles.filterBar}>
        <div className={styles.searchWrapper}>
          <Search size={14} className={styles.searchIcon} />
          <input
            type="text"
            placeholder="Search by User, Activity, or Log ID..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className={styles.searchInput}
          />
        </div>
        
        <div className={styles.filterGroup}>
          <div className={styles.selectComponentContainer}>
            <SlidersHorizontal size={12} color="#94a3b8" />
            <ShadcnSelect
              value={moduleFilter}
              onChange={setModuleFilter}
              placeholder="All Modules"
              options={[
                { label: "All Modules", value: "All" },
                { label: "Animal", value: "Animal" },
                { label: "Adoption", value: "Adoption" },
                { label: "Rescue", value: "Rescue" },
                { label: "Reports", value: "Reports" },
                { label: "E-Learning", value: "E-Learning" },
                { label: "User", value: "User" },
                { label: "Settings", value: "Settings" },
                { label: "Authentication", value: "Authentication" }
              ]}
            />
          </div>

          <ShadcnSelect
            value={statusFilter}
            onChange={setStatusFilter}
            placeholder="All Statuses"
            options={[
              { label: "All Statuses", value: "All" },
              { label: "Success", value: "Success" },
              { label: "Failed", value: "Failed" }
            ]}
          />
        </div>
      </div>

      {/* ACTIVITY LOG CARD TABLE */}
      <div className={styles.cardShadcn}>
        {filteredLogs.length > 0 ? (
          <div className={styles.tableResponsiveContainer}>
            <table className={styles.tableShadcn}>
              <thead>
                <tr>
                  <th>Date & Time</th>
                  <th>User</th>
                  <th>Module</th>
                  <th>Activity</th>
                  <th>Status</th>
                  <th style={{ textAlign: "right" }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredLogs.map((log) => (
                  <tr key={log.id} className={styles.tableRowAnimation}>
                    <td className={styles.timestampCell}>{log.timestamp}</td>
                    <td>
                      <div className={styles.userProfileCell}>
                        <span className={styles.avatarMock}>{log.user.charAt(0)}</span>
                        <span>{log.user}</span>
                      </div>
                    </td>
                    <td>
                      <span className={styles.moduleInlineBadge}>{log.module}</span>
                    </td>
                    <td className={styles.activityText}>{log.activity}</td>
                    <td>
                      <span className={`${styles.badgeShadcn} ${log.status === "Success" ? styles.badgeSuccess : styles.badgeFailed}`}>
                        {log.status}
                      </span>
                    </td>
                    <td style={{ textAlign: "right" }}>
                      <button
                        type="button"
                        className={styles.btnRowAction}
                        onClick={() => handleOpenDrawer(log)}
                      >
                        <Eye size={12} /> View Details
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {/* INTEGRATED CLEAN PAGINATION BAR */}
            <div className={styles.paginationContainer}>
              <span className={styles.paginationText}>Showing 1-{filteredLogs.length} of {filteredLogs.length} entries</span>
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
          /* EMPTY STATE LAYOUT ELEMENT */
          <div className={styles.emptyStateContainer}>
            <div className={styles.emptyIconCircle}>
              <FileText size={24} color="#94a3b8" />
            </div>
            <h3>No activity logs found</h3>
            <p>System activities will appear here once users begin interacting with the platform.</p>
          </div>
        )}
      </div>

      {/* SHADCN SHEET DRAWER COMPONENTS */}
      <div className={`${styles.sheetOverlay} ${isDrawerOpen ? styles.sheetOverlayOpen : ""}`} onClick={handleCloseDrawer} />
      <div className={`${styles.sheetContent} ${isDrawerOpen ? styles.sheetContentOpen : ""}`}>
        {selectedLog && (
          <div className={styles.drawerInner}>
            <div className={styles.drawerHeader}>
              <div>
                <h2>Audit Trace Metrics</h2>
                <p>Granular structural logs for entry sequence</p>
              </div>
              <button type="button" onClick={handleCloseDrawer} className={styles.drawerCloseBtn}>
                <X size={16} />
              </button>
            </div>

            <div className={styles.drawerBody}>
              <div className={styles.drawerMetaSection}>
                <span className={styles.drawerMetaLabel}>Log Identifier</span>
                <span className={styles.drawerMetaValueId}>{selectedLog.id}</span>
              </div>

              <div className={styles.separator} />

              <div className={styles.metaRowGrid}>
                <div className={styles.metaColumn}>
                  <div className={styles.metaItemLabelFlex}>
                    <User size={13} color="#64748b" />
                    <span>Triggered By</span>
                  </div>
                  <span className={styles.metaItemValue}>{selectedLog.user}</span>
                </div>
                <div className={styles.metaColumn}>
                  <div className={styles.metaItemLabelFlex}>
                    <Shield size={13} color="#64748b" />
                    <span>User Role</span>
                  </div>
                  <span className={styles.metaItemValue}>{selectedLog.role}</span>
                </div>
              </div>

              <div className={styles.metaRowGrid}>
                <div className={styles.metaColumn}>
                  <div className={styles.metaItemLabelFlex}>
                    <FileText size={13} color="#64748b" />
                    <span>Target Module</span>
                  </div>
                  <span className={styles.moduleInlineBadge} style={{ width: "fit-content" }}>{selectedLog.module}</span>
                </div>
                <div className={styles.metaColumn}>
                  <div className={styles.metaItemLabelFlex}>
                    <Clock size={13} color="#64748b" />
                    <span>Execution Clock</span>
                  </div>
                  <span className={styles.metaItemValue} style={{ fontSize: "0.75rem" }}>{selectedLog.timestamp}</span>
                </div>
              </div>

              <div className={styles.separator} />

              <div className={styles.drawerFullDescriptionBlock}>
                <div className={styles.metaItemLabelFlex} style={{ marginBottom: "0.5rem" }}>
                  <Info size={13} color="#64748b" />
                  <span>Operation Summary</span>
                </div>
                <div className={styles.activitySummaryCallout}>{selectedLog.activity}</div>
              </div>

              <div className={styles.drawerFullDescriptionBlock}>
                <span className={styles.drawerMetaLabel} style={{ marginBottom: "0.5rem" }}>Payload / Event Context Description</span>
                <p className={styles.payloadParagraph}>{selectedLog.description}</p>
              </div>

              <div className={styles.separator} />

              <div className={styles.drawerFullDescriptionBlock}>
                <span className={styles.drawerMetaLabel} style={{ marginBottom: "0.5rem" }}>Transaction Status Integrity</span>
                <div className={`${styles.badgeShadcn} ${selectedLog.status === "Success" ? styles.badgeSuccess : styles.badgeFailed}`} style={{ width: "fit-content", padding: "0.35rem 0.75rem" }}>
                  {selectedLog.status.toUpperCase()}
                </div>
              </div>
            </div>

            <div className={styles.drawerFooter}>
              <button type="button" onClick={handleCloseDrawer} className={styles.btnSecondary} style={{ width: "100%" }}>
                Close Audit Inspection Panel
              </button>
            </div>
          </div>
        )}
      </div>

    </div>
  );
}