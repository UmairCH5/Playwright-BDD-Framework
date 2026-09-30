import { envConfig } from './envConfig';
import { CONSTANTS } from './constants';

export const testConfig = {
  baseURL: envConfig.baseURL,
  timeout: CONSTANTS.DEFAULT_TIMEOUT_MS,
  expectTimeout: CONSTANTS.EXPECT_TIMEOUT_MS,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 2 : undefined,
};
