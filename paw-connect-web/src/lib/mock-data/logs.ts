import type { LogEntry } from '@/types';

export const MOCK_LOGS: LogEntry[] = [
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
