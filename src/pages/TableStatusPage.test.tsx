// src/pages/TableStatusPage.test.tsx
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import TableStatusPage from './TableStatusPage';
import * as AppContext from '../context/AppContext';

describe('TableStatusPage Component', () => {
  const dispatchMock = jest.fn();
  const sampleTables = [
    { id: 1, tableNumber: 'T1', princess: 'Airi', budget: 5000, time: '10:00' },
  ];

  beforeEach(() => {
    dispatchMock.mockClear();
    jest.spyOn(AppContext, 'useAppContext').mockReturnValue({
      state: { tables: sampleTables, tableSettings: [], reservations: [], invites: [], casts: [], currentUser: null, layoutMode: 'list' },
      dispatch: dispatchMock,
    });
  });

  it('renders table info', () => {
    render(<TableStatusPage />);
    expect(screen.getByText('卓番号:')).toBeInTheDocument();
    expect(screen.getByText('T1')).toBeInTheDocument();
    expect(screen.getByText('Airi')).toBeInTheDocument();
  });

  it('dispatches DELETE_TABLE on delete after confirm', () => {
    window.confirm = jest.fn().mockReturnValue(true);
    render(<TableStatusPage />);
    fireEvent.click(screen.getByLabelText('卓 T1 を削除'));
    expect(dispatchMock).toHaveBeenCalledWith({ type: 'DELETE_TABLE', payload: 1 });
  });
});
