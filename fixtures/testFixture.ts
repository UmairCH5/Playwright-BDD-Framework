import { createBdd } from 'playwright-bdd';
import { pageTest } from './pageFixture';

export const test = pageTest;
export const { Given, When, Then, Before, After } = createBdd(test);
