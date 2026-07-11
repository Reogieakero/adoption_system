import 'dotenv/config';

function requireEnv(key: string): string {
  const value = process.env[key];
  if (!value) {
    throw new Error(`Missing required environment variable: ${key}`);
  }
  return value;
}

export const env = {
  port: Number(process.env.PORT) || 5000,
  clientOrigin: (process.env.CLIENT_ORIGIN || 'http://localhost:3000').split(','),
  db: {
    host: requireEnv('DB_HOST'),
    port: Number(process.env.DB_PORT) || 3306,
    user: requireEnv('DB_USER'),
    password: requireEnv('DB_PASSWORD'),
    database: requireEnv('DB_NAME'),
  },
  jwtSecret: requireEnv('JWT_SECRET'),
  adminEmail: process.env.ADMIN_EMAIL ?? '',
  adminPasswordHash: process.env.ADMIN_PASSWORD_HASH ?? '',
  emailUser: process.env.EMAIL_USER ?? '',
  emailAppPassword: process.env.EMAIL_APP_PASSWORD ?? '',
};
