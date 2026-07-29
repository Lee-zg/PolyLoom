import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { App } from './App';
import '@polyloom/react/button/style.css';
import './page.css';

const rootElement = document.querySelector('#root');

if (!rootElement) {
  throw new Error('缺少 React 挂载节点 #root');
}

createRoot(rootElement).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
