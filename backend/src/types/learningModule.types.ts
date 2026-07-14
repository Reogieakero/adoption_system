export type ModuleDifficulty = 'Beginner' | 'Intermediate' | 'Advanced';
export type ModuleStatus = 'Draft' | 'Published';

export interface LearningModule {
  id: string;
  title: string;
  description: string;
  category: string;
  difficulty: ModuleDifficulty;
  duration: string;
  status: ModuleStatus;
  objectives: string;
  content: string;
  videoUrl: string;
  pdfUrl: string;
  views: number;
  completionRate: string;
  image: string;
  dateAdded: string;
  lastUpdated: string;
}

export interface CreateLearningModuleInput {
  id: string;
  title: string;
  description: string;
  category: string;
  difficulty: ModuleDifficulty;
  duration: string;
  status: ModuleStatus;
  objectives?: string;
  content?: string;
  videoUrl?: string;
  pdfUrl?: string;
  views?: number;
  completionRate?: string;
  image?: string;
  dateAdded: string;
  lastUpdated: string;
}

export type UpdateLearningModuleInput = Partial<Omit<CreateLearningModuleInput, 'id'>>;