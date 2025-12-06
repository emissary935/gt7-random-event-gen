import React from 'react';
import ReactDOM from 'react-dom/client';
import { Analytics } from '@vercel/analytics/react'; // <--- Importante
import App from './App';
import './index.css'; // <--- Aggiungo anche il CSS se mancava

const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error("Could not find root element to mount to");
}

const root = ReactDOM.createRoot(rootElement);
root.render(
  <React.StrictMode>
    <App />
    <Analytics /> {/* <--- Importante */}
  </React.StrictMode>
);
