'use client';

import { useCallback, useEffect, useState } from 'react';
import type { ElearningModule, CreateElearningModulePayload, UpdateElearningModulePayload } from '@/types';
import {
  createLearningModule,
  deleteLearningModule,
  fetchLearningModules,
  updateLearningModule,
} from '@/services/learning-modules.api';

interface UseLearningModulesResult {
  modules: ElearningModule[];
  isLoading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
  addModule: (payload: CreateElearningModulePayload, imageFile?: File | null) => Promise<ElearningModule>;
  editModule: (
    id: number,
    payload: UpdateElearningModulePayload,
    imageFile?: File | null
  ) => Promise<ElearningModule>;
  removeModule: (id: number) => Promise<void>;
}

export function useLearningModules(): UseLearningModulesResult {
  const [modules, setModules] = useState<ElearningModule[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const refetch = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await fetchLearningModules();
      setModules(data);
    } catch (err) {
      setModules([]);
      setError(err instanceof Error ? err.message : 'Failed to load learning modules');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    refetch();
  }, [refetch]);

  const addModule = useCallback(
    async (payload: CreateElearningModulePayload, imageFile: File | null = null) => {
      const created = await createLearningModule(payload, imageFile);
      setModules((prev) => [created, ...prev]);
      return created;
    },
    []
  );

  const editModule = useCallback(
    async (id: number, payload: UpdateElearningModulePayload, imageFile: File | null = null) => {
      const updated = await updateLearningModule(id, payload, imageFile);
      setModules((prev) => prev.map((m) => (m.module_id === id ? updated : m)));
      return updated;
    },
    []
  );

  const removeModule = useCallback(async (id: number) => {
    await deleteLearningModule(id);
    setModules((prev) => prev.filter((m) => m.module_id !== id));
  }, []);

  return { modules, isLoading, error, refetch, addModule, editModule, removeModule };
}
