import './index.css';

import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';

import App from './ui/App';

const rootElement = document.getElementsByTagName('main')[0];

rootElement &&
  createRoot(rootElement).render(
    <StrictMode>
      <App />
    </StrictMode>
  );

// @ts-expect-error esbuild will define IS_PRODUCTION
window.IS_PRODUCTION || new EventSource('/esbuild').addEventListener('change', () => location.reload());
