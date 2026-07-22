export type ExportType = 'adoption_trends' | 'rescue_efficiency' | 'geographic_distribution';
export type ExportFormat = 'csv' | 'pdf';

export interface ReportExport {
  export_id: number;
  requested_by_admin_id: number;
  export_type: ExportType;
  format: ExportFormat;
  date_range_start: string;
  date_range_end: string;
  generated_at: string;
}

export interface CreateExportInput {
  requested_by_admin_id: number;
  export_type: ExportType;
  format: ExportFormat;
  date_range_start: string;
  date_range_end: string;
}
