'use client';

import { createContext, useContext } from 'react';

const ApiContext = createContext(null);

export const ApiProvider = ApiContext.Provider;

export function useApi() {
  const api = useContext(ApiContext);
  if (!api) throw new Error('useApi must be used inside <DemoApp api={...}>');
  return api;
}
