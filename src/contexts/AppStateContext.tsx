import React, { createContext, useContext, useState } from 'react';

// Create App State Context
export const AppStateContext = createContext<any>(null);

export const AppStateProvider = ({ children, state }: { children: React.ReactNode, state: any }) => {
  return (
    <AppStateContext.Provider value={state}>
      {children}
    </AppStateContext.Provider>
  );
};

export const useAppState = () => useContext(AppStateContext);
