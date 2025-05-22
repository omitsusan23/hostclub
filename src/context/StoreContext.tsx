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
    // TODO: API から契約店舗一覧を取得
    const fetched: StoreInfo[] = [
      { id: 'lebel', name: 'ルベル' },
      { id: 'second-store', name: '店舗B' },
      // ...100店舗以上追加
    ];
    setStores(fetched);
    if (fetched.length > 0) setCurrentStoreId(fetched[0].id);
    // TODO: 従業員ビュー判定も API 等で
    setIsEmployeeView(true);
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