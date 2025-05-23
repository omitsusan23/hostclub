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
    const hostname = window.location.hostname;
    const subdomain =
      hostname === 'localhost' || hostname === '127.0.0.1'
        ? 'lebel'
        : hostname.split('.')[0];

    (async () => {
      try {
        const res = await fetch(`/api/stores/subdomain/${subdomain}`);
        const store: StoreInfo = await res.json();
        setStores([store]);
        setCurrentStoreId(store.id);
        setIsEmployeeView(true); // 仮フラグ、将来はユーザー情報に基づく切り替え予定
      } catch (err) {
        console.error('Failed to fetch store by subdomain', err);
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