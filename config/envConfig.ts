import path from 'path';
import dotenv from 'dotenv';

const envName = process.env.ENV || 'dev';

const envFilePath = path.resolve(process.cwd(), `env/.env.${envName}`);

dotenv.config({
  path: envFilePath,
});

function requiredEnv(name: string): string {
  const value = process.env[name];

  if (!value) {
    throw new Error(`Missing required environment variable: ${name}`);
  }

  return value;
}

const baseURL = requiredEnv('BASE_URL').replace(/\/$/, '');

export const envConfig = {
  env: envName,
  baseURL,
  apiBaseURL: `${baseURL}/api`,
  adminUsername: requiredEnv('ADMIN_USERNAME'),
  adminPassword: requiredEnv('ADMIN_PASSWORD'),
};
