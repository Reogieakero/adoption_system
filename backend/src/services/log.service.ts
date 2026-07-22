import { logRepository } from '../repositories/log.repository';

export const logService = {
  async listLogs() {
    const rows = await logRepository.findAllLogs();
    return rows.map((r) => ({
      id: String(r.log_id),
      timestamp: r.created_at instanceof Date ? r.created_at.toISOString() : String(r.created_at),
      user: r.user_name ?? 'System',
      role: r.user_role ?? 'system',
      module: r.entity_type,
      activity: r.action,
      status: 'Success' as const,
      description: r.description ?? '',
    }));
  },
};
