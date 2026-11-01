import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { HashRouter, Route, Routes } from 'react-router-dom';
import { DemoApp } from '@repo/demo';
import { createApi } from '@repo/lib';
import './styles.css';

const api = createApi(import.meta.env.VITE_API_URL);

// HashRouter: a packaged app loads file://, where BrowserRouter paths do not work.
createRoot(document.getElementById('root')).render(
  <StrictMode>
    <HashRouter>
      <Routes>
        <Route path="/" element={<DemoApp api={api} />} />
      </Routes>
    </HashRouter>
  </StrictMode>,
);
