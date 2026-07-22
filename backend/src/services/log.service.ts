import { logRepository } from '../repositories/log.repository';

export const logService = {
  async listLogs(params: {
    page: number;
    limit: number;
    search?: string;
    module?: string;
    dateFrom?: string;
    dateTo?: string;
  }) {
    const { rows, total } = await logRepository.findLogs(params);
    const logs = rows.map((r) => ({
      id: String(r.log_id),
      timestamp: r.created_at instanceof Date ? r.created_at.toISOString() : String(r.created_at),
      user: r.user_name ?? 'System',
      role: r.user_role ?? 'system',
      module: r.entity_type,
      activity: r.action,
      status: 'Success' as const,
      description: r.description ?? '',
    }));

    const summary = await logRepository.getSummary();
    const totalPages = Math.ceil(total / params.limit);

    return {
      logs,
      total,
      page: params.page,
      limit: params.limit,
      totalPages,
      summary,
    };
  },
};
