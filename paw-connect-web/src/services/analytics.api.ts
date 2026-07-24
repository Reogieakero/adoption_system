import { createServiceClient } from '@/lib/api-client';

const { request } = createServiceClient('/api/admin/analytics');

export interface AnalyticsOverview {
  summaryCards: { label: string; value: string; change: number | null; seed?: number }[];
  adoptionTrend: { month: string; adoptions: number; applications: number }[];
  adoptionStatus: { name: string; value: number }[];
  topBreeds: { name: string; value: number }[];
  rescueByMonth: { month: string; cases: number }[];
  rescueStatus: { name: string; value: number }[];
  reportsByMonth: { month: string; reports: number }[];
  reportsByStatus: { name: string; value: number }[];
  breedDistribution: { name: string; value: number }[];
  dogsVsCats: { name: string; value: number }[];
  healthStatus: { name: string; value: number }[];
  vaccinationCoverage: number;
  rescueSuccessRate: number;
  dogVsCatAdoptions: { month: string; species: string; count: number }[];
  avgResponseMinutes: number;
  rescueCategories: { name: string; value: number }[];
  reportsByCategory: { name: string; value: number }[];
  activeBarangays: { name: string; value: number }[];
  sexDistribution: { name: string; value: number }[];
  petStatusDistribution: { name: string; value: number }[];
  ageDistribution: { name: string; value: number }[];
  shelterCapacity: { name: string; value: number }[];
  performanceMetrics: { label: string; value: string; change: number | null }[];
  recentAnalytics: { metric: string; current: string; previous: string; change: number | null; trend: string }[];
}

export async function fetchAnalyticsOverview(dateRange?: string, species?: string): Promise<AnalyticsOverview> {
  const params = new URLSearchParams();
  if (dateRange) params.set('dateRange', dateRange);
  if (species) params.set('species', species);
  const qs = params.toString();
  const data = await request<{ success: true; overview: AnalyticsOverview }>(`/overview${qs ? `?${qs}` : ''}`);
  return data.overview;
}
