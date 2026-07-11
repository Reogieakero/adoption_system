import crypto from 'crypto';

export const CODE_TTL_MINUTES = 10;

export function generateVerificationCode(): string {
  return crypto.randomInt(0, 1_000_000).toString().padStart(6, '0');
}

export function getExpiryDate(): Date {
  return new Date(Date.now() + CODE_TTL_MINUTES * 60 * 1000);
}
