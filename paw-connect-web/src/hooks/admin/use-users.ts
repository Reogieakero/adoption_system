'use client';

import { useCallback, useEffect, useState } from 'react';
import type { AdminUserSummary } from '@/services/users.api';
import { fetchUsers } from '@/services/users.api';

interface UseUsersResult {
  users: AdminUserSummary[];
  isLoading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
  setUsers: React.Dispatch<React.SetStateAction<AdminUserSummary[]>>;
}

export function useUsers(): UseUsersResult {
  const [users, setUsers] = useState<AdminUserSummary[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const refetch = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await fetchUsers();
      setUsers(data);
    } catch (err) {
      setUsers([]);
      setError(err instanceof Error ? err.message : 'Failed to load users');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    refetch();
  }, [refetch]);

  return { users, isLoading, error, refetch, setUsers };
}

