// src/context/StoreContext.tsx
import React, { createContext, useContext, useState, useEffect, ReactNode, useMemo } from 'react';

export interface StoreInfo {
  id: string;
  name: string;
}

interface StoreContextValue {
  stores: StoreInfo[];
  currentStore?: StoreInfo;
  setCurrentStoreById: (id: string) => void;
  isEmployeeView: boolean;
}

const StoreContext = createContext<StoreContextValue>({
  stores: [],
  currentStore: undefined,
  setCurrentStoreById: () => {},
  isEmployeeView: false,
});

export const StoreProvider: React.FC<{children: ReactNode}> = ({ children }) => {
  const [stores, setStores] = useState<StoreInfo[]>([]);
  const [currentStoreId, setCurrentStoreId] = useState<string | undefined>(undefined);
  const [isEmployeeView, setIsEmployeeView] = useState<boolean>(false);

  useEffect(() => {
    (async () => {
      try {
        const res = await fetch('/api/stores');
        const data: StoreInfo[] = await res.json();
        setStores(data);
        if (data.length > 0) setCurrentStoreId(data[0].id);
        // TODO: user 情報から従業員ビューを判定
        setIsEmployeeView(true);
      } catch (err) {
        console.error('Failed to fetch stores', err);
      }
    })();
  }, []);

  const currentStore = useMemo(
    () => stores.find((s) => s.id === currentStoreId),
    [stores, currentStoreId]
  );

  const setCurrentStoreById = (id: string) => setCurrentStoreId(id);

  return (
    <StoreContext.Provider value={{ stores, currentStore, setCurrentStoreById, isEmployeeView }}>
      {children}
    </StoreContext.Provider>
  );
};

export const useStore = () => useContext(StoreContext);