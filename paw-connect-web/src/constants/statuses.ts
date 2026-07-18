import type { SelectOption } from '@/types/common';

export const ADOPTION_STATUSES = ['Pending', 'Under Review', 'Approved', 'Rejected', 'Adopted'] as const;

export const ADOPTION_STATUS_OPTIONS: SelectOption[] = [
  { label: 'All Statuses', value: 'All' },
  ...ADOPTION_STATUSES.map((s) => ({ label: s, value: s })),
];

export const SPECIES_OPTIONS: SelectOption[] = [
  { label: 'All species', value: 'All species' },
  { label: 'Dog', value: 'Dog' },
  { label: 'Cat', value: 'Cat' },
];

export const ANIMAL_ADOPTION_STATUSES = ['All', 'Available', 'Pending', 'Adopted', 'Unavailable'] as const;

export const RESCUE_STAGES = ['New Reports', 'Verified Reports', 'Rescue Operations'] as const;

export const HEALTH_STATUSES = ['Healthy', 'Under Treatment', 'Recovering', 'Critical'] as const;

export const VACCINATION_STATUSES = ['Vaccinated', 'Not Fully Vaccinated', 'Due', 'Not Vaccinated'] as const;

export const MODULE_DIFFICULTIES = ['Beginner', 'Intermediate', 'Advanced'] as const;

export const MODULE_STATUSES = ['Draft', 'Published'] as const;

export const USER_ROLES = ['Administrator', 'Rescuer', 'Adopter', 'Citizen'] as const;

export const USER_STATUSES = ['Active', 'Pending', 'Suspended'] as const;

export const NOTIFICATION_TYPES = [
  'adoption_application',
  'rescue_case',
  'message',
  'health_alert',
  'user_registration',
  'system',
] as const;

export const LEARNING_CATEGORIES = [
  'Responsible Pet Ownership',
  'Dog Behavior',
  'Cat Behavior',
  'Basic Dog Training',
  'Basic Cat Training',
  'Pet Health Care',
  'Vaccination Awareness',
  'Animal Welfare Laws',
  'Adoption Preparation',
  'Post-Adoption Care',
] as const;

export const LOG_MODULES = [
  'Animal',
  'Adoption',
  'Rescue',
  'Reports',
  'E-Learning',
  'User',
  'Settings',
  'Authentication',
] as const;
