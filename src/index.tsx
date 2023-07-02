import '../index.css';

import React from 'react';
import { createRoot } from 'react-dom/client';
import { App } from './components/App.tsx';
import { error } from './utils/utils.ts';

globalThis.window.addEventListener('load', () => {
  const root = document.getElementById('root');
  if (root === null) error('Unable to find root element');
  root.setAttribute(
    'class',
    `flex h-screen flex-col gap-2 dark:bg-black text-neutral-900 dark:text-neutral-200`
  );
  const reactRoot = createRoot(root);
  reactRoot.render(
    <React.StrictMode>
      <App />
    </React.StrictMode>
  );
});
