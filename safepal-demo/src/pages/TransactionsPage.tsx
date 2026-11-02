import { useState } from 'react';
import { useDemoData } from '../context/DemoDataContext';
import { Header } from '../components/Header';
import { TransactionList, TransactionDetail } from '../components/TransactionComponents';
import { cn } from '../utils/helpers';
import { Input } from '../components/ui';
import type { Transaction } from '../types';

export function TransactionsPage() {
  const [selectedTx, setSelectedTx] = useState<Transaction | null>(null);
  const [filter, setFilter] = useState<'all' | 'send' | 'receive' | 'swap' | 'stake'>('all');
  const [searchQuery, setSearchQuery] = useState('');

  const { transactions } = useDemoData();
  const filteredTransactions = transactions.filter((tx) => {
    const matchesFilter = filter === 'all' || tx.type === filter;
    const matchesSearch =
      tx.token.symbol.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tx.hash.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tx.fromAddress.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tx.toAddress.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  return (
    <div className="safe-page-full safe-area-bottom pb-24">
      <Header title="Transactions" />

      <main className="safe-container px-4 pb-8">
        <div className="mb-4">
          <Input
            placeholder="Search transactions..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="max-w-xs"
          />
        </div>

        <div className="flex items-center gap-2 overflow-x-auto pb-2 -mx-4 px-4 mb-4" role="tablist" aria-label="Transaction filters">
          {['all', 'send', 'receive', 'swap', 'stake'].map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f as typeof filter)}
              className={cn(
                'px-4 py-2 rounded-xl text-sm font-medium whitespace-nowrap transition-colors',
                filter === f
                  ? 'bg-safepal-dark-600 text-white'
                  : 'text-safepal-dark-300 hover:bg-safepal-dark-700'
              )}
              role="tab"
              aria-selected={filter === f}
            >
              {f.charAt(0).toUpperCase() + f.slice(1)}
            </button>
          ))}
        </div>

        <TransactionList
          transactions={filteredTransactions}
          onTransactionClick={setSelectedTx}
          emptyMessage="No transactions found"
        />
      </main>

      {selectedTx && (
        <TransactionDetail transaction={selectedTx} onClose={() => setSelectedTx(null)} />
      )}
    </div>
  );
}