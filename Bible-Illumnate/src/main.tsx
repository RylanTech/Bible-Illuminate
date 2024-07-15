import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';
import { VerseProvider } from './contexts/verseContext';
import { GeminiProvider } from './contexts/geminiContext';

const container = document.getElementById('root');
const root = createRoot(container!);
root.render(
  <React.StrictMode>
    <GeminiProvider>
      <VerseProvider>
        <App />
      </VerseProvider>
    </GeminiProvider>
  </React.StrictMode>
);