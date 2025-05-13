// src/context/AppContext.tsx

import React, { createContext, useReducer, useContext, ReactNode, useEffect } from 'react';

// ─── 型定義 ────────────────────────────────────────
export type User = {
  id: number;
  username: string;
  role: 'admin' | 'cast';
  canManageTables?: boolean;
};

export type Reservation = {
  id: number;
  princess: string;
  requestedTable: string;
  budget: number;
};

export type Table = {
  id: number;
  tableNumber: string;
  princess: string;
  budget: number;
  time: string;
};

export type Invite = {
  id: string;
  token: string;
  createdAt: string;
};

export type Cast = {
  id: number;
  name: string;
  status: 'active' | 'paused';
};

export type LayoutMode = 'list' | 'map';
export type TableSetting = string;

export interface State {
  currentUser: User | null;
  reservations: Reservation[];
  tables: Table[];
  invites: Invite[];
  casts: Cast[];
  tableSettings: TableSetting[];
  layoutMode: LayoutMode;
}

export type Action =
  | { type: 'SET_USER'; payload: User | null }
  | { type: 'ADD_RESERVATION'; payload: Reservation }
  | { type: 'DELETE_RESERVATION'; payload: number }
  | { type: 'ASSIGN_TABLE'; payload: Reservation }
  | { type: 'DELETE_TABLE'; payload: number }
  | { type: 'ADD_INVITE'; payload: Invite }
  | { type: 'REVOKE_INVITE'; payload: string }
  | { type: 'ADD_CAST'; payload: Cast }
  | { type: 'TOGGLE_CAST_STATUS'; payload: number }
  | { type: 'DELETE_CAST'; payload: number }
  | { type: 'ADD_TABLE_SETTING'; payload: TableSetting }
  | { type: 'REMOVE_TABLE_SETTING'; payload: TableSetting }
  | { type: 'SET_LAYOUT_MODE'; payload: LayoutMode };

// ─── 安全に JSON.parse ─────────────────────────────────
const safeParse = <T,>(key: string, fallback: T): T => {
  const item = localStorage.getItem(key);
  try {
    return item ? JSON.parse(item) : fallback;
  } catch {
    return fallback;
  }
};

// ─── 初期 State ───────────────────────────────────────
const initialState: State = {
  currentUser: safeParse<User | null>('user', null),
  reservations: safeParse<Reservation[]>('reservations', []),
  tables: safeParse<Table[]>('tables', []),
  invites: safeParse<Invite[]>('invites', []),
  casts: safeParse<Cast[]>('casts', []),
  tableSettings: safeParse<TableSetting[]>('tableSettings', []),
  layoutMode: ['list', 'map'].includes(localStorage.getItem('layoutMode') || '')
    ? (localStorage.getItem('layoutMode') as LayoutMode)
    : 'list',
};

// ─── Reducer ─────────────────────────────────────────
function reducer(state: State, action: Action): State {
  switch (action.type) {
    case 'SET_USER':
      return { ...state, currentUser: action.payload };
    case 'ADD_RESERVATION':
      return { ...state, reservations: [action.payload, ...state.reservations] };
    case 'DELETE_RESERVATION':
      return {
        ...state,
        reservations: state.reservations.filter((r) => r.id !== action.payload),
      };
    case 'ASSIGN_TABLE':
      const newTable = {
        id: Date.now(),
        tableNumber: action.payload.requestedTable,
        princess: action.payload.princess,
        budget: action.payload.budget,
        time: new Date().toLocaleTimeString(),
      } as Table;
      return { ...state, tables: [newTable, ...state.tables] };
    case 'DELETE_TABLE':
      return { ...state, tables: state.tables.filter((t) => t.id !== action.payload) };
    case 'ADD_INVITE':
      return { ...state, invites: [action.payload, ...state.invites] };
    case 'REVOKE_INVITE':
      return { ...state, invites: state.invites.filter((inv) => inv.id !== action.payload) };
    case 'ADD_CAST':
      return { ...state, casts: [action.payload, ...state.casts] };
    case 'TOGGLE_CAST_STATUS':
      return {
        ...state,
        casts: state.casts.map((c) =>
          c.id === action.payload ? { ...c, status: c.status === 'active' ? 'paused' : 'active' } : c
        ),
      };
    case 'DELETE_CAST':
      return { ...state, casts: state.casts.filter((c) => c.id !== action.payload) };
    case 'ADD_TABLE_SETTING':
      return { ...state, tableSettings: [action.payload, ...state.tableSettings] };
    case 'REMOVE_TABLE_SETTING':
      return {
        ...state,
        tableSettings: state.tableSettings.filter((t) => t !== action.payload),
      };
    case 'SET_LAYOUT_MODE':
      return { ...state, layoutMode: action.payload };
    default:
      return state;
  }
}

// ─── Context 作成 ──────────────────────────────────
const AppContext = createContext<{ state: State; dispatch: React.Dispatch<Action> } | undefined>(undefined);

export function AppProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(reducer, initialState);

  // State→localStorage 永続化
  useEffect(() => {
    localStorage.setItem('user', JSON.stringify(state.currentUser));
    localStorage.setItem('reservations', JSON.stringify(state.reservations));
    localStorage.setItem('tables', JSON.stringify(state.tables));
    localStorage.setItem('invites', JSON.stringify(state.invites));
    localStorage.setItem('casts', JSON.stringify(state.casts));
    localStorage.setItem('tableSettings', JSON.stringify(state.tableSettings));
    localStorage.setItem('layoutMode', state.layoutMode);
  }, [state]);

  return <AppContext.Provider value={{ state, dispatch }}>{children}</AppContext.Provider>;
}

export function useAppContext() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useAppContext must be used within AppProvider');
  return ctx;
}
