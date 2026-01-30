import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { useRegisterSW } from 'virtual:pwa-register/react';

// Register Service Worker
const IntervalSW = () => {
  useRegisterSW({
    onRegistered(r) {
      r && setInterval(() => {
        r.update();
      }, 60 * 60 * 1000); // Check for updates every hour
    }
  });
  return null;
}

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <IntervalSW />
    <App />
  </React.StrictMode>
);