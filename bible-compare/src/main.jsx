import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import 'bootstrap/dist/css/bootstrap.min.css'
import { VerseProvider } from './contexts/verseContext.jsx'
import { GeminiProvider } from './contexts/geminiContext.jsx'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <GeminiProvider>
    <VerseProvider>
      <App />
    </VerseProvider>
    </GeminiProvider>
  </React.StrictMode>,
)
