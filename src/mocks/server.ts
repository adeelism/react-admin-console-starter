import { setupServer } from 'msw/node';
import { allHandlers } from './registry';

/** MSW server used by the test suite; all module handlers are registered. */
export const server = setupServer(...allHandlers());
