'use client';

import { useCallback, useEffect, useState } from 'react';
import type { LearningModule, CreateLearningModulePayload, UpdateLearningModulePayload } from '@/types';
import {
  createLearningModule,
  deleteLearningModule,
  duplicateLearningModule,
  fetchLearningModules,
  updateLearningModule,
} from '@/services/learning-modules.api';

interface UseLearningModulesResult {
  modules: LearningModule[];
  isLoading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
  addModule: (payload: CreateLearningModulePayload, imageFile?: File | null) => Promise<LearningModule>;
  editModule: (
    id: string,
    payload: UpdateLearningModulePayload,
    imageFile?: File | null
  ) => Promise<LearningModule>;
  removeModule: (id: string) => Promise<void>;
  duplicateModule: (id: string) => Promise<LearningModule>;
}

export function useLearningModules(): UseLearningModulesResult {
  const [modules, setModules] = useState<LearningModule[]>([]);
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
    async (payload: CreateLearningModulePayload, imageFile: File | null = null) => {
      const created = await createLearningModule(payload, imageFile);
      setModules((prev) => [created, ...prev]);
      return created;
    },
    []
  );

  const editModule = useCallback(
    async (id: string, payload: UpdateLearningModulePayload, imageFile: File | null = null) => {
      const updated = await updateLearningModule(id, payload, imageFile);
      setModules((prev) => prev.map((m) => (m.id === id ? updated : m)));
      return updated;
    },
    []
  );

  const removeModule = useCallback(async (id: string) => {
    await deleteLearningModule(id);
    setModules((prev) => prev.filter((m) => m.id !== id));
  }, []);

  const duplicateModule = useCallback(async (id: string) => {
    const copy = await duplicateLearningModule(id);
    setModules((prev) => [copy, ...prev]);
    return copy;
  }, []);

  return { modules, isLoading, error, refetch, addModule, editModule, removeModule, duplicateModule };
}
