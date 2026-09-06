import { setupWorker } from 'msw/browser';
import { enabledModulesFromEnv, handlersForModules } from './registry';

/** Starts the MSW worker for the modules enabled by env, or no-ops if none. */
export async function enableMocking(): Promise<void> {
  const modules = enabledModulesFromEnv(import.meta.env);
  if (modules.length === 0) {
    return;
  }
  const worker = setupWorker(...handlersForModules(modules));
  await worker.start({ onUnhandledRequest: 'bypass' });
}
