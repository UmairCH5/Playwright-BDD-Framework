import path from 'path';
import dotenv from 'dotenv';

const envName = process.env.ENV || 'dev';
dotenv.config({ path: path.resolve(process.cwd(), `env/.env.${envName}`) });

export const envConfig = {
  env: envName,
  baseURL: process.env.BASE_URL || 'https://automationintesting.online',
  adminUsername: process.env.ADMIN_USERNAME || 'admin',
  adminPassword: process.env.ADMIN_PASSWORD || 'password',
};
