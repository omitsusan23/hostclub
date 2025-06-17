import React, { createContext, useContext, useReducer, ReactNode, useEffect } from 'react'
import { supabase } from '../lib/supabaseClient'

type Role = 'owner' | 'operator' | 'cast' | 'admin'

export interface User {
  username: string
  role: Role
  canManageTables: boolean
}

export interface Reservation {
  id: string
  princess: string
  requestedTable: string
  time: string
  budget: number
  help?: string[]
  note?: string
}

export interface Table {
  id: string
  tableNumber: string
  princess: string
  budget: number
  time: string
}

export type TableSetting = string

interface AppState {
  currentUser: User | null
  session: any | null
  isStoreRegistered: boolean | null
  tables: Table[]
  tableSettings: TableSetting[]
  reservations: Reservation[]
}

type Action =
  | { type: 'SET_USER'; payload: User | null }
  | { type: 'SET_SESSION'; payload: any }
  | { type: 'SET_STORE_REGISTERED'; payload: boolean }
  | { type: 'LOGOUT' }
  | { type: 'ADD_TABLE'; payload: Table }
  | { type: 'DELETE_TABLE'; payload: string }
  | { type: 'ADD_TABLE_SETTING'; payload: string }
  | { type: 'REMOVE_TABLE_SETTING'; payload: string }
  | { type: 'ADD_RESERVATION'; payload: Reservation }
  | { type: 'DELETE_RESERVATION'; payload: string }
  | {
      type: 'ASSIGN_TABLE'
      payload: {
        id: string
        requestedTable: string
        princess: string
        budget: number
        time: string
      }
    }

const initialState: AppState = {
  currentUser: null,
  session: null,
  isStoreRegistered: null,
  tables: [],
  tableSettings: [],
  reservations: [],
}

const AppContext = createContext<{
  state: AppState
  dispatch: React.Dispatch<Action>
}>({
  state: initialState,
  dispatch: () => null,
})

const reducer = (state: AppState, action: Action): AppState => {
  switch (action.type) {
    case 'SET_USER':
      return { ...state, currentUser: action.payload }
    case 'SET_SESSION':
      return { ...state, session: action.payload }
    case 'SET_STORE_REGISTERED':
      return { ...state, isStoreRegistered: action.payload }
    case 'LOGOUT':
      return { ...state, currentUser: null, session: null }
    case 'ADD_TABLE':
      return { ...state, tables: [...state.tables, action.payload] }
    case 'DELETE_TABLE':
      return {
        ...state,
        tables: state.tables.filter((t) => t.id !== action.payload),
      }
    case 'ADD_TABLE_SETTING':
      return {
        ...state,
        tableSettings: [...state.tableSettings, action.payload],
      }
    case 'REMOVE_TABLE_SETTING':
      return {
        ...state,
        tableSettings: state.tableSettings.filter((t) => t !== action.payload),
      }
    case 'ADD_RESERVATION':
      return {
        ...state,
        reservations: [...state.reservations, action.payload],
      }
    case 'DELETE_RESERVATION':
      return {
        ...state,
        reservations: state.reservations.filter((r) => r.id !== action.payload),
      }
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
      }
    default:
      return state
  }
}

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(reducer, initialState)

  useEffect(() => {
    const initSession = async () => {
      const { data } = await supabase.auth.getSession()
      dispatch({ type: 'SET_SESSION', payload: data.session })

      if (data.session?.user) {
        const meta = data.session.user.user_metadata
        dispatch({
          type: 'SET_USER',
          payload: {
            username: data.session.user.email ?? '',
            role: meta.role,
            canManageTables: meta.role !== 'cast',
          },
        })
      }
    }

    initSession()

    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      dispatch({ type: 'SET_SESSION', payload: session })

      if (session?.user) {
        const meta = session.user.user_metadata
        dispatch({
          type: 'SET_USER',
          payload: {
            username: session.user.email ?? '',
            role: meta.role,
            canManageTables: meta.role !== 'cast',
          },
        })
      } else {
        dispatch({ type: 'SET_USER', payload: null })
      }
    })

    return () => {
      listener.subscription.unsubscribe()
    }
  }, [])

  useEffect(() => {
    const checkStoreRegistered = async () => {
      const subdomain = window.location.hostname.split('.')[0]

      try {
        const response = await fetch(`/api/is-store-registered?subdomain=${subdomain}`)
        const data = await response.json()
        dispatch({ type: 'SET_STORE_REGISTERED', payload: data.exists })
      } catch (error) {
        console.error('サブドメイン確認エラー:', error)
        dispatch({ type: 'SET_STORE_REGISTERED', payload: false })
      }
    }

    if (state.session !== undefined) {
      checkStoreRegistered()
    }
  }, [state.session])

  return <AppContext.Provider value={{ state, dispatch }}>{children}</AppContext.Provider>
}

export const useAppContext = () => useContext(AppContext)