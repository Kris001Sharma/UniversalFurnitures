import React from 'react';
import { useSystem } from './SystemContext';
import { useSales } from './SalesContext';
import { useInventory } from './InventoryContext';

export const useAppState = () => {
  const system = useSystem() || {};
  const sales = useSales() || {};
  const inventory = useInventory() || {};

  return {
    ...system,
    ...sales,
    ...inventory,
  };
};

// We don't need AppStateProvider anymore because we wrapped things in the specific providers in App.tsx
// But if someone imports it, we can return a dummy Fragment.
export const AppStateProvider = ({ children }: { children: React.ReactNode }) => {
  return <>{children}</>;
};
