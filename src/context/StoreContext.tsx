// src/context/StoreContext.tsx
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

/** 店舗情報の型 */
interface StoreInfo {
  id: string;
  name: string;
  isEmployeeView: boolean; // 従業員画面かどうか
}

/** コンテキストのデフォルト値 */
const defaultStore: StoreInfo = {
  id: '',
  name: '',
  isEmployeeView: false,
};

// StoreContext の定義
const StoreContext = createContext<StoreInfo>(defaultStore);

// プロバイダーコンポーネント
export const StoreProvider: React.FC<{children: ReactNode}> = ({ children }) => {
  const [store, setStore] = useState<StoreInfo>(defaultStore);

  useEffect(() => {
    // TODO: API 呼び出しや localStorage から取得
    // example: ルベルの情報をセット
    setStore({ id: 'lebel', name: 'ルベル', isEmployeeView: true });
  }, []);

  return (
    <StoreContext.Provider value={store}>
      {children}
    </StoreContext.Provider>
  );
};

// カスタムフック
export const useStore = () => useContext(StoreContext);
