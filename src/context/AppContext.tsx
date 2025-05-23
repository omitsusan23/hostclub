// src/context/AppContext.tsx
import React, { createContext, useContext, useReducer, ReactNode } from 'react';

type Role = 'owner' | 'operator' | 'cast';

export interface User {
  username: string;
  role: Role;
}

export interface Table {
  id: string;
  tableNumber: string;
  princess: string;
  budget: number;
  time: string;
}

interface AppState {
  currentUser: User | null;
  tables: Table[];
  tableSettings: string[];
}

type Action =
  | { type: 'SET_USER'; payload: User }
  | { type: 'LOGOUT' }
  | { type: 'ADD_TABLE'; payload: Table }
  | { type: 'DELETE_TABLE'; payload: string }
  | { type: 'ADD_TABLE_SETTING'; payload: string }
  | { type: 'REMOVE_TABLE_SETTING'; payload: string };

const initialState: AppState = {
  currentUser: {
    username: 'admin',
    role: 'owner', // 初期値。必要に応じて 'cast' などに変更
  },
  tables: [],
  tableSettings: [],
};

const AppContext = createContext<{
  state: AppState;
  dispatch: React.Dispatch<Action>;
}>({
  state: initialState,
  dispatch: () => null,
});

const reducer = (state: AppState, action: Action): AppState => {
  switch (action.type) {
    case 'SET_USER':
      return { ...state, currentUser: action.payload };
    case 'LOGOUT':
      return { ...state, currentUser: null };
    case 'ADD_TABLE':
      return { ...state, tables: [...state.tables, action.payload] };
    case 'DELETE_TABLE':
      return {
        ...state,
        tables: state.tables.filter((t) => t.id !== action.payload),
      };
    case 'ADD_TABLE_SETTING':
      return {
        ...state,
        tableSettings: [...state.tableSettings, action.payload],
      };
    case 'REMOVE_TABLE_SETTING':
      return {
        ...state,
        tableSettings: state.tableSettings.filter((t) => t !== action.payload),
      };
    default:
      return state;
  }
};

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(reducer, initialState);
  return (
    <AppContext.Provider value={{ state, dispatch }}>
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => useContext(AppContext);
