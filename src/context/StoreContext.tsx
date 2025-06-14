import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
  useMemo,
} from 'react';
import { supabase } from '../lib/supabaseClient';
import { useAppContext } from './AppContext';

export interface StoreInfo {
  id: string;
  name: string;
  logo_url?: string;
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
  const session = state.session;

  const [stores, setStores] = useState<StoreInfo[]>([]);
  const [currentStoreId, setCurrentStoreId] = useState<string | undefined>(undefined);
  const [isEmployeeView, setIsEmployeeView] = useState<boolean>(false);

  useEffect(() => {
    const storeId = session?.user?.user_metadata?.store_id;

    if (!storeId) {
      console.log('⚠️ store_id 未取得のため Supabase 問い合わせスキップ');
      return;
    }

    const fetchStore = async () => {
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
  }, [session]); // ✅ sessionの変更時に再評価される

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
