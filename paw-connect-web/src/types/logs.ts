export interface LogEntry {
  id: string;
  timestamp: string;
  user: string;
  role: string;
  module: 'Animal' | 'Adoption' | 'Rescue' | 'Reports' | 'E-Learning' | 'User' | 'Settings' | 'Authentication';
  activity: string;
  status: 'Success' | 'Failed';
  description: string;
}
