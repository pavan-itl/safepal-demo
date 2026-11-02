import type { Token, Transaction } from '../types';
import { demoTokens, demoWallet, demoTransactions } from './demoData';

export interface DemoState {
  cashBalance: number;
  tokens: Token[];
  transactions: Transaction[];
  change24h: number;
}

const STORAGE_KEY = 'safepal-demo-state-v1';

function cloneToken(t: Token): Token {
  return { ...t };
}

function cloneTransaction(tx: Transaction): Transaction {
  return { ...tx, token: { ...tx.token }, timestamp: new Date(tx.timestamp) };
}

export function createInitialDemoState(): DemoState {
  const tokens = demoTokens.map(cloneToken);
  const tokenValue = tokens.reduce((sum, t) => sum + (t.balance * t.price), 0);
  return {
    cashBalance: Math.max(0, demoWallet.totalValue - tokenValue),
    tokens,
    transactions: demoTransactions.map(cloneTransaction),
    change24h: 3.45,
  };
}

function normalizeState(raw: any): DemoState {
  const initial = createInitialDemoState();
  if (!raw || typeof raw !== 'object') return initial;
  const tokens = Array.isArray(raw.tokens) ? raw.tokens.map(cloneToken) : initial.tokens;
  const transactions = Array.isArray(raw.transactions)
    ? raw.transactions.map((tx: any) => ({
        ...tx,
        token: tx?.token ? cloneToken(tx.token) : tokens[0],
        timestamp: tx?.timestamp ? new Date(tx.timestamp) : new Date(),
      }))
    : initial.transactions;
  return {
    cashBalance: typeof raw.cashBalance === 'number' ? raw.cashBalance : initial.cashBalance,
    tokens,
    transactions,
    change24h: typeof raw.change24h === 'number' ? raw.change24h : initial.change24h,
  };
}

export function loadDemoState(): DemoState {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return createInitialDemoState();
    return normalizeState(JSON.parse(raw));
  } catch {
    return createInitialDemoState();
  }
}

export function saveDemoState(state: DemoState): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch {
    // ignore
  }
}

export function resetDemoState(): DemoState {
  const initial = createInitialDemoState();
  saveDemoState(initial);
  return initial;
}

export function computeTokenValue(token: Token): number {
  return token.balance * token.price;
}

export function computeTotalValue(state: DemoState): number {
  return state.cashBalance + state.tokens.reduce((sum, t) => sum + computeTokenValue(t), 0);
}

export function makeSimulatedTransaction(partial: Partial<Transaction> & { token: Token }): Transaction {
  const { token, id, ...rest } = partial;
  return {
    id: id || `sim-tx-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    type: rest.type || 'receive',
    status: rest.status || 'completed',
    token,
    amount: rest.amount ?? 0,
    value: rest.value ?? 0,
    fromAddress: rest.fromAddress || 'SIMULATED',
    toAddress: rest.toAddress || 'SIMULATED',
    hash: 'SIMULATED',
    network: rest.network || token.network || 'Demo',
    fee: rest.fee ?? 0,
    feeToken: rest.feeToken || token.symbol,
    timestamp: rest.timestamp || new Date(),
    blockNumber: undefined,
    ...rest,
  } as Transaction;
}
