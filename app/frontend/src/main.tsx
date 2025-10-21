import React from 'react';
import ReactDOM from 'react-dom/client';

import { NodeProvider } from './contexts/node-context';
import { ThemeProvider } from './providers/theme-provider';
import { LanguageProvider } from './contexts/language-context';
import App from './App';

import './index.css';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <ThemeProvider>
      <LanguageProvider>
        <NodeProvider>
          <App />
        </NodeProvider>
      </LanguageProvider>
    </ThemeProvider>
  </React.StrictMode>
);
