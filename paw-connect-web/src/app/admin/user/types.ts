import type { AdminUserSummary } from "@/types";

// UserEntry now comes from the backend via AdminUserSummary
export type UserEntry = AdminUserSummary;

export type RoleFilterValue = "All" | UserEntry["role"];
export type StatusFilterValue = "All" | UserEntry["status"];


