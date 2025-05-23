// src/pages/AdminTableSettings.test.tsx

// useNavigate をモック化して Router コンテキスト不要にする
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => jest.fn(),
}));

import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import AdminTableSettings from './AdminTableSettings';
import * as AppContext from '../context/AppContext';

describe('AdminTableSettings Component', () => {
  const dispatchMock = jest.fn();

  beforeEach(() => {
    dispatchMock.mockClear();
    jest.spyOn(AppContext, 'useAppContext').mockReturnValue({
      state: { tableSettings: [], tables: [], reservations: [], currentUser: null },
      dispatch: dispatchMock,
    });
  });

  it('renders input and add button', () => {
    render(<AdminTableSettings />);
    expect(screen.getByPlaceholderText('例: T4')).toBeInTheDocument();
    expect(screen.getByText('追加')).toBeInTheDocument();
  });

  it('dispatches ADD_TABLE_SETTING on add', () => {
    render(<AdminTableSettings />);
    fireEvent.change(screen.getByPlaceholderText('例: T4'), { target: { value: 'T8' } });
    fireEvent.click(screen.getByText('追加'));
    expect(dispatchMock).toHaveBeenCalledWith({ type: 'ADD_TABLE_SETTING', payload: 'T8' });
  });

  it('dispatches REMOVE_TABLE_SETTING on delete after confirm', () => {
    jest.spyOn(AppContext, 'useAppContext').mockReturnValue({
      state: { tableSettings: ['T3'], tables: [], reservations: [], currentUser: null },
      dispatch: dispatchMock,
    });
    window.confirm = jest.fn().mockReturnValue(true);

    render(<AdminTableSettings />);
    fireEvent.click(screen.getByLabelText('卓 T3 を削除'));
    expect(dispatchMock).toHaveBeenCalledWith({ type: 'REMOVE_TABLE_SETTING', payload: 'T3' });
  });
});
