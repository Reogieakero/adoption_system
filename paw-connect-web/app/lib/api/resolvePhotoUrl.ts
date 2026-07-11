import { API_BASE_URL } from '../config';

export function resolvePhotoUrl(photo: string | null | undefined): string {
  if (!photo) return '';
  if (photo.startsWith('http://') || photo.startsWith('https://') || photo.startsWith('blob:')) {
    return photo;
  }
  return `${API_BASE_URL}${photo}`;
}