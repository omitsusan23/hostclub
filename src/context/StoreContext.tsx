import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
  useMemo,
} from 'react';
import { supabase } from '../lib/supabase';
import { useAppContext } from './AppContext';

export interface StoreInfo {
  id: string;
  name: string;
  logo_url?: string; // オプションで追加
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

export const StoreProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  console.log('🟢 StoreProvider is mounted');

  const { state } = useAppContext();
  const storeId = state.session?.user?.user_metadata?.store_id;

  const [stores, setStores] = useState<StoreInfo[]>([]);
  const [currentStoreId, setCurrentStoreId] = useState<string | undefined>(storeId);
  const [isEmployeeView, setIsEmployeeView] = useState<boolean>(false);

  useEffect(() => {
    const fetchStore = async () => {
      if (!storeId) return;

      const { data, error } = await supabase
        .from('stores')
        .select('id, name, logo_url')
        .eq('id', storeId)
        .single();

      if (error) {
        console.error('❌ 店舗情報取得エラー:', error.message);
      } else if (data) {
        console.log('✅ Supabaseから取得した店舗データ:', data);
        setStores([data]);
        setCurrentStoreId(data.id);
        setIsEmployeeView(true);
      }
    };

    fetchStore();
  }, [storeId]);

  const currentStore = useMemo(
    () => stores.find((s) => s.id === currentStoreId),
    [stores, currentStoreId]
  );

  const setCurrentStoreById = (id: string) => setCurrentStoreId(id);

  return (
    <StoreContext.Provider
      value={{
        stores,
        currentStore,
        setCurrentStoreById,
        isEmployeeView,
      }}
    >
      {children}
    </StoreContext.Provider>
  );
};

export const useStore = () => useContext(StoreContext);
