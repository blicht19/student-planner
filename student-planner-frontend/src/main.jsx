import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import App from './App.jsx';
import '@fontsource/roboto';
import { Toaster } from 'react-hot-toast';
import { ErrorBoundary } from './error-boundary.jsx';
import { ErrorFallback } from './components/index.js';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <ErrorBoundary fallback={<ErrorFallback />}>
      <Toaster position='top-right' reverseOrder={true} />
      <App />
    </ErrorBoundary>
  </StrictMode>,
);
