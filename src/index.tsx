import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
// Inject application favicon dynamically
import faviconUrl from './assets/Xavigate_Favicon.svg';
import XavigateApp from './App';
import reportWebVitals from './reportWebVitals';
import { Amplify } from 'aws-amplify';
import { awsConfig } from './aws.exports';

// Initialize AWS Amplify Auth (direct sign-in)
Amplify.configure(awsConfig);

// Set favicon
(() => {
  try {
    const link: HTMLLinkElement | null = document.querySelector("link[rel*='icon']");
    const favicon: HTMLLinkElement = link || document.createElement('link');
    favicon.type = 'image/svg+xml';
    favicon.rel = 'icon';
    favicon.href = faviconUrl;
    if (!link) document.head.appendChild(favicon);
  } catch (e) {
    console.warn('Failed to set favicon', e);
  }
})();
// Render app
const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement);
root.render(
  <React.StrictMode>
    <XavigateApp />
  </React.StrictMode>,
);

reportWebVitals();
