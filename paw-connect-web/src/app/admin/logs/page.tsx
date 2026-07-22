"use client";

import React, { useState, useEffect, useCallback } from "react";
import { Download } from "lucide-react";
import Button from '@/components/ui/button';
import type { LogEntry } from '@/types';
import { createServiceClient } from '@/lib/api-client';
import styles from "./page.module.css";
import LogSummaryCards from './components/LogSummaryCards';
import LogFilters from './components/LogFilters';
import LogTable from './components/LogTable';
import LogDetailDrawer from './components/LogDetailDrawer';

interface LogsResponse {
  success: boolean;
  logs: LogEntry[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
  summary: { total: number; today: number };
}

export default function ActivityLogsPage() {
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [moduleFilter, setModuleFilter] = useState("All");
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [summary, setSummary] = useState({ total: 0, today: 0 });

  const [selectedLog, setSelectedLog] = useState<LogEntry | null>(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  const fetchLogs = useCallback(async () => {
    try {
      setLoading(true);
      const { request } = createServiceClient('/api/admin/logs');
      const params = new URLSearchParams();
      params.set('page', String(page));
      if (search) params.set('search', search);
      if (moduleFilter !== 'All') params.set('module', moduleFilter);
      const res = await request<LogsResponse>(`?${params.toString()}`);
      setLogs(res.logs);
      setTotal(res.total);
      setTotalPages(res.totalPages);
      setSummary(res.summary);
    } catch (err) {
      console.error('Failed to fetch logs:', err);
    } finally {
      setLoading(false);
    }
  }, [page, search, moduleFilter]);

  useEffect(() => {
    fetchLogs();
  }, [fetchLogs]);

  const handleSearchChange = (value: string) => {
    setSearch(value);
    setPage(1);
  };

  const handleModuleFilterChange = (value: string) => {
    setModuleFilter(value);
    setPage(1);
  };

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
          <Button variant="admin-secondary" onClick={() => alert("Exporting audit trails...")}>
            <Download size={14} /> Export Logs
          </Button>
        </div>
      </div>

      <LogSummaryCards total={summary.total} today={summary.today} />

      <div className={styles.cardShadcn}>
        <LogFilters
          search={search}
          onSearchChange={handleSearchChange}
          moduleFilter={moduleFilter}
          onModuleFilterChange={handleModuleFilterChange}
        />

        <LogTable
          logs={logs}
          onViewDetails={handleOpenDrawer}
          page={page}
          totalPages={totalPages}
          total={total}
          onPageChange={setPage}
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
