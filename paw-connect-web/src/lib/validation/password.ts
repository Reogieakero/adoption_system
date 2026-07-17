export interface PasswordRule {
  test: (pw: string) => boolean;
  label: string;
}

export const PASSWORD_RULES: PasswordRule[] = [
  { test: (pw) => pw.length >= 8, label: 'At least 8 characters' },
  { test: (pw) => /[A-Z]/.test(pw), label: 'One uppercase letter' },
  { test: (pw) => /[0-9]/.test(pw), label: 'One number' },
  { test: (pw) => /[^A-Za-z0-9]/.test(pw), label: 'One symbol' },
];

export function getPasswordErrors(password: string): string[] {
  return PASSWORD_RULES.filter((rule) => !rule.test(password)).map((rule) => rule.label);
}

export function isPasswordValid(password: string): boolean {
  return PASSWORD_RULES.every((rule) => rule.test(password));
}
