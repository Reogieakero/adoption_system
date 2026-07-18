"use client";

import React, { useState } from "react";
import { Download } from "lucide-react";
import Button from '@/components/ui/button';
import DatePicker from '@/components/ui/date-picker';
import type { LogEntry } from '@/types';
import { MOCK_LOGS } from '@/lib/mock-data/logs';
import styles from "./page.module.css";
import LogSummaryCards from './components/LogSummaryCards';
import LogFilters from './components/LogFilters';
import LogTable from './components/LogTable';
import LogDetailDrawer from './components/LogDetailDrawer';

export default function ActivityLogsPage() {
  const [search, setSearch] = useState("");
  const [moduleFilter, setModuleFilter] = useState("All");
  const [statusFilter, setStatusFilter] = useState("All");
  const [auditDate, setAuditDate] = useState("2026-07-12");

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
      <div className={styles.headerContainer}>
        <div className={styles.headerActions}>
          <DatePicker value={auditDate} onChange={setAuditDate} />
          <Button variant="admin-secondary" onClick={() => alert("Exporting audit trails...")}>
            <Download size={14} /> Export Logs
          </Button>
        </div>
      </div>

      <LogSummaryCards />

      <div className={styles.cardShadcn}>
        <LogFilters
          search={search}
          onSearchChange={setSearch}
          moduleFilter={moduleFilter}
          onModuleFilterChange={setModuleFilter}
          statusFilter={statusFilter}
          onStatusFilterChange={setStatusFilter}
        />

        <LogTable
          logs={filteredLogs}
          onViewDetails={handleOpenDrawer}
        />
      </div>

      <LogDetailDrawer
        log={selectedLog}
        isOpen={isDrawerOpen}
        onClose={handleCloseDrawer}
      />
    </div>
  );
}
