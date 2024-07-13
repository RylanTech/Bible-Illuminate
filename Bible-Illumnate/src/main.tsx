import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';
import { VerseProvider } from './contexts/verseContext';

const container = document.getElementById('root');
const root = createRoot(container!);
root.render(
  <React.StrictMode>
    <VerseProvider>
    <App />
    </VerseProvider>
  </React.StrictMode>
);