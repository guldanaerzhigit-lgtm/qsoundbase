import React from 'react';
import { createRoot } from 'react-dom/client';
import './styles.css';

const rootElement = document.getElementById('root');

function showStartupError(error) {
  const message = error?.stack || error?.message || String(error || 'Unknown startup error');
  rootElement.innerHTML = '';
  const panel = document.createElement('div');
  panel.style.cssText = 'margin:16px;padding:20px;border:2px solid #ff4d6d;border-radius:14px;background:#180d12;color:#fff;font:14px/1.5 system-ui;white-space:pre-wrap;overflow-wrap:anywhere';
  const title = document.createElement('h2');
  title.textContent = 'QSoundBase: ошибка React';
  title.style.color = '#ff8298';
  const details = document.createElement('pre');
  details.style.cssText = 'white-space:pre-wrap;overflow-wrap:anywhere;font:12px/1.5 monospace';
  details.textContent = message;
  panel.append(title, details);
  rootElement.appendChild(panel);
}

window.addEventListener('error', (event) => {
  if (event.error) showStartupError(event.error);
});
window.addEventListener('unhandledrejection', (event) => showStartupError(event.reason));

import('./App.jsx')
  .then(({ default: App }) => {
    createRoot(rootElement).render(
      React.createElement(
        React.StrictMode,
        null,
        React.createElement(App)
      )
    );
  })
  .catch(showStartupError);