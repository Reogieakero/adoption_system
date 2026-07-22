"use client";

import React, { useState, useEffect } from "react";
import { Download } from "lucide-react";
import Button from '@/components/ui/button';
import DatePicker from '@/components/ui/date-picker';
import type { LogEntry } from '@/types';
import { createServiceClient } from '@/lib/api-client';
import styles from "./page.module.css";
import LogSummaryCards from './components/LogSummaryCards';
import LogFilters from './components/LogFilters';
import LogTable from './components/LogTable';
import LogDetailDrawer from './components/LogDetailDrawer';

export default function ActivityLogsPage() {
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [moduleFilter, setModuleFilter] = useState("All");
  const [statusFilter, setStatusFilter] = useState("All");
  const [auditDate, setAuditDate] = useState("2026-07-12");

  const [selectedLog, setSelectedLog] = useState<LogEntry | null>(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  useEffect(() => {
    async function fetchLogs() {
      try {
        const { request } = createServiceClient('/api/admin/logs');
        const res = await request<{ success: boolean; logs: LogEntry[] }>('');
        setLogs(res.logs);
      } catch (err) {
        console.error('Failed to fetch logs:', err);
      } finally {
        setLoading(false);
      }
    }
    fetchLogs();
  }, []);

  const filteredLogs = logs.filter((log) => {
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

  if (loading) {
    return <div className={styles.adminContainer}>Loading logs...</div>;
  }

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
