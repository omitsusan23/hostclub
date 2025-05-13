// src/index.tsx
import React, { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { I18nextProvider } from 'react-i18next';
import i18n from './i18n';
import App from './App';
import { AppProvider } from './context/AppContext';
import './index.css';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    {/* i18n をアプリ全体に適用 */}
    <I18nextProvider i18n={i18n}>
      {/* グローバルな状態管理を提供 */}
      <AppProvider>
        <App />
      </AppProvider>
    </I18nextProvider>
  </StrictMode>,
);
