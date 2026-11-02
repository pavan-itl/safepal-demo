import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import type { ReactNode } from 'react';
import type { Token, Transaction } from '../types';
import {
  loadDemoState,
  saveDemoState,
  resetDemoState,
  computeTotalValue,
  makeSimulatedTransaction,
  type DemoState,
} from '../data/demoStore';

interface DemoDataContextValue {
  state: DemoState;
  totalValue: number;
  cashBalance: number;
  tokens: Token[];
  transactions: Transaction[];
  change24h: number;
  setCashBalance: (value: number) => void;
  addFunds: (amount: number) => void;
  deductFunds: (amount: number) => void;
  setChange24h: (value: number) => void;
  addToken: (token: Token) => void;
  updateToken: (id: string, patch: Partial<Token>) => void;
  deleteToken: (id: string) => void;
  addTransaction: (tx: Partial<Transaction> & { token: Token }) => void;
  updateTransaction: (id: string, patch: Partial<Transaction>) => void;
  deleteTransaction: (id: string) => void;
  resetDemoData: () => void;
}

const DemoDataContext = createContext<DemoDataContextValue | null>(null);

export function DemoDataProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<DemoState>(() => loadDemoState());

  useEffect(() => {
    saveDemoState(state);
  }, [state]);

  const setCashBalance = useCallback((value: number) => {
    setState((prev) => ({ ...prev, cashBalance: value }));
  }, []);

  const addFunds = useCallback((amount: number) => {
    setState((prev) => ({ ...prev, cashBalance: prev.cashBalance + amount }));
  }, []);

  const deductFunds = useCallback((amount: number) => {
    setState((prev) => ({ ...prev, cashBalance: Math.max(0, prev.cashBalance - amount) }));
  }, []);

  const setChange24h = useCallback((value: number) => {
    setState((prev) => ({ ...prev, change24h: value }));
  }, []);

  const addToken = useCallback((token: Token) => {
    setState((prev) => ({ ...prev, tokens: [...prev.tokens, token] }));
  }, []);

  const updateToken = useCallback((id: string, patch: Partial<Token>) => {
    setState((prev) => ({
      ...prev,
      tokens: prev.tokens.map((t) => (t.id === id ? { ...t, ...patch } : t)),
    }));
  }, []);

  const deleteToken = useCallback((id: string) => {
    setState((prev) => ({ ...prev, tokens: prev.tokens.filter((t) => t.id !== id) }));
  }, []);

  const addTransaction = useCallback((partial: Partial<Transaction> & { token: Token }) => {
    const tx = makeSimulatedTransaction(partial);
    setState((prev) => ({ ...prev, transactions: [tx, ...prev.transactions] }));
  }, []);

  const updateTransaction = useCallback((id: string, patch: Partial<Transaction>) => {
    setState((prev) => ({
      ...prev,
      transactions: prev.transactions.map((tx) => (tx.id === id ? { ...tx, ...patch } : tx)),
    }));
  }, []);

  const deleteTransaction = useCallback((id: string) => {
    setState((prev) => ({ ...prev, transactions: prev.transactions.filter((tx) => tx.id !== id) }));
  }, []);

  const resetDemoData = useCallback(() => {
    setState(resetDemoState());
  }, []);

  const value: DemoDataContextValue = {
    state,
    totalValue: computeTotalValue(state),
    cashBalance: state.cashBalance,
    tokens: state.tokens,
    transactions: state.transactions,
    change24h: state.change24h,
    setCashBalance,
    addFunds,
    deductFunds,
    setChange24h,
    addToken,
    updateToken,
    deleteToken,
    addTransaction,
    updateTransaction,
    deleteTransaction,
    resetDemoData,
  };

  return <DemoDataContext.Provider value={value}>{children}</DemoDataContext.Provider>;
}

export function useDemoData(): DemoDataContextValue {
  const ctx = useContext(DemoDataContext);
  if (!ctx) throw new Error('useDemoData must be used within DemoDataProvider');
  return ctx;
}
