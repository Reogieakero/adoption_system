const STATUS_OVERRIDES: Record<string, string> = {
  pet_unavailable: 'Adopted',
};

export function formatStatus(status: string): string {
  if (STATUS_OVERRIDES[status]) return STATUS_OVERRIDES[status];
  return status
    .split('_')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}
