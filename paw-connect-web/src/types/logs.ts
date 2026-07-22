export interface LogEntry {
  id: string;
  timestamp: string;
  user: string;
  role: string;
  module: string;
  activity: string;
  status: 'Success' | 'Failed';
  description: string;
}
