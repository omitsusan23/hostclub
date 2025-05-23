// src/context/AppContext.tsx
import React, { createContext, useContext, useReducer, ReactNode } from 'react';

type Role = 'owner' | 'operator' | 'cast';

export interface User {
  username: string;
  role: Role;
  /**
   * Flag used on the reservation page to determine whether the
   * user can reflect reservations onto tables.
   */
  canManageTables: boolean;
}

export interface Reservation {
  id: string;
  princess: string;
  requestedTable: string;
  time: string;
  budget: number;
}

export interface Table {
  id: string;
  tableNumber: string;
  princess: string;
  budget: number;
  time: string;
}

export type TableSetting = string;

interface AppState {
  currentUser: User | null;
  tables: Table[];
  tableSettings: TableSetting[];
  reservations: Reservation[];
}

type Action =
  | { type: 'SET_USER'; payload: User }
  | { type: 'LOGOUT' }
  | { type: 'ADD_TABLE'; payload: Table }
  | { type: 'DELETE_TABLE'; payload: string }
  | { type: 'ADD_TABLE_SETTING'; payload: string }
  | { type: 'REMOVE_TABLE_SETTING'; payload: string }
  | { type: 'ADD_RESERVATION'; payload: Reservation }
  | { type: 'DELETE_RESERVATION'; payload: string }
  | {
      type: 'ASSIGN_TABLE';
      payload: {
        id: string;
        requestedTable: string;
        princess: string;
        budget: number;
        time: string;
      };
    };

const initialState: AppState = {
  currentUser: {
    username: 'admin',
    role: 'owner', // 初期値。必要に応じて 'cast' などに変更
    canManageTables: true,
  },
  tables: [],
  tableSettings: [],
  reservations: [],
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
    case 'ADD_RESERVATION':
      return {
        ...state,
        reservations: [...state.reservations, action.payload],
      };
    case 'DELETE_RESERVATION':
      return {
        ...state,
        reservations: state.reservations.filter((r) => r.id !== action.payload),
      };
    case 'ASSIGN_TABLE':
      return {
        ...state,
        reservations: state.reservations.filter((r) => r.id !== action.payload.id),
        tables: [
          ...state.tables,
          {
            id: action.payload.id,
            tableNumber: action.payload.requestedTable,
            princess: action.payload.princess,
            budget: action.payload.budget,
            time: action.payload.time,
          },
        ],
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
