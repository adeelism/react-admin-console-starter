import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './theme/theme.css';
import './i18n';
import { App } from './App';
import { enableMocking } from './mocks/browser';

async function bootstrap(): Promise<void> {
  await enableMocking();
  const container = document.getElementById('root');
  if (!container) {
    throw new Error('Root element #root not found');
  }
  createRoot(container).render(
    <StrictMode>
      <App />
    </StrictMode>,
  );
}

void bootstrap();
