export function toIsoDate(value: string | Date): string {
  if (value instanceof Date) {
    return value.toISOString().slice(0, 10);
  }
  return String(value).slice(0, 10);
}

export function toIsoDateTime(value: string | Date): string {
  if (value instanceof Date) {
    return value.toISOString();
  }
  return new Date(String(value).replace(' ', 'T')).toISOString();
}
