import { createBdd } from 'playwright-bdd';
import { apiTest } from './apiFixture';

export const test = apiTest;
export const { Given, When, Then, Before, After } = createBdd(test);
