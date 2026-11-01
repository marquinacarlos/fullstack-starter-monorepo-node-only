import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { DemoApp } from '@repo/demo';
import { createApi } from '@repo/lib';
import './styles.css';

const api = createApi(import.meta.env.VITE_API_URL);

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<DemoApp api={api} />} />
      </Routes>
    </BrowserRouter>
  </StrictMode>,
);
