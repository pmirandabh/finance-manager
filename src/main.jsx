import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.jsx'
import './styles/form-fix.css'
import './styles/themes.css'
import './styles/animations.css'

import { Toaster } from 'react-hot-toast'
import { ThemeProvider } from './context/ThemeContext'

import ErrorBoundary from './components/ErrorBoundary'

import { LanguageProvider } from './context/LanguageContext'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <ThemeProvider>
      <LanguageProvider>
        <ErrorBoundary>
          <Toaster position="top-right" />
          <App />
        </ErrorBoundary>
      </LanguageProvider>
    </ThemeProvider>
  </StrictMode>,
)
