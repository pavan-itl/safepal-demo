import type { Transaction } from '../types';
import { cn, formatNumber, formatDate, formatDateTime, formatAddress } from '../utils/helpers';
import { Badge } from './ui';

interface TransactionItemProps {
  transaction: Transaction;
  onClick?: () => void;
  className?: string;
}

export function TransactionItem({ transaction, onClick, className }: TransactionItemProps) {
  const isPositive = transaction.type === 'receive';
  const typeColors = {
    send: 'bg-safepal-dark-900 text-safepal-dark-300',
    receive: 'bg-safepal-dark-900 text-safepal-dark-300',
    swap: 'bg-safepal-dark-900 text-safepal-dark-300',
    stake: 'bg-safepal-dark-900 text-safepal-dark-300',
    unstake: 'bg-safepal-dark-900 text-safepal-dark-300',
    claim: 'bg-safepal-dark-900 text-safepal-dark-300',
  };

  const typeIcons = {
    send: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
      </svg>
    ),
    receive: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 5l-9 2 9 18 9-18-9-2zm0 0v8" />
      </svg>
    ),
    swap: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
      </svg>
    ),
    stake: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
      </svg>
    ),
    unstake: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
      </svg>
    ),
    claim: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
      </svg>
    ),
  };

  return (
    <div
      className={cn(
        'safe-card p-4 flex items-center gap-4 transition-all duration-200',
        'hover:safe-card-elevated',
        onClick && 'cursor-pointer',
        className
      )}
      onClick={onClick}
      role={onClick ? 'button' : undefined}
      tabIndex={onClick ? 0 : undefined}
      onKeyDown={onClick ? (e) => e.key === 'Enter' && onClick() : undefined}
    >
      <div className={cn(
        'w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0',
        typeColors[transaction.type]
      )} aria-hidden="true">
        {typeIcons[transaction.type]}
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-2 flex-1 min-w-0">
            <h4 className="font-medium text-safepal-dark-50 truncate">{transaction.token.symbol}</h4>
            <Badge variant="gray" className="text-xs">{transaction.type.charAt(0).toUpperCase() + transaction.type.slice(1)}</Badge>
          </div>
          <div className="text-right flex-shrink-0">
            <div className={cn('font-semibold', isPositive ? 'text-safepal-dark-400' : 'text-safepal-dark-50')}>
              {isPositive ? '+' : '-'}{formatNumber(transaction.value, { currency: true })}
            </div>
            <div className="text-xs text-safepal-dark-400">{formatDate(transaction.timestamp)}</div>
          </div>
        </div>
        <div className="mt-1 flex items-center gap-2 flex-wrap">
          <Badge variant={transaction.status === 'confirmed' ? 'green' : transaction.status === 'pending' ? 'blue' : 'red'} className="text-xs">
            {transaction.status.charAt(0).toUpperCase() + transaction.status.slice(1)}
          </Badge>
          <span className="text-xs text-safepal-dark-500">
            {transaction.network}
          </span>
          <span className="text-xs text-safepal-dark-500">
            Fee: {formatNumber(transaction.fee, { decimals: 6 })} {transaction.feeToken}
          </span>
        </div>
      </div>
      {onClick && (
        <svg className="w-5 h-5 text-safepal-dark-600 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
      )}
    </div>
  );
}

interface TransactionDetailProps {
  transaction: Transaction;
  onClose: () => void;
}

export function TransactionDetail({ transaction, onClose }: TransactionDetailProps) {
  const isPositive = transaction.type === 'receive';
  const typeColors = {
    send: 'bg-safepal-dark-900 text-safepal-dark-300',
    receive: 'bg-safepal-dark-900 text-safepal-dark-300',
    swap: 'bg-safepal-dark-900 text-safepal-dark-300',
    stake: 'bg-safepal-dark-900 text-safepal-dark-300',
    unstake: 'bg-safepal-dark-900 text-safepal-dark-300',
    claim: 'bg-safepal-dark-900 text-safepal-dark-300',
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4" role="dialog" aria-modal="true" aria-labelledby="tx-detail-title">
      <div className="absolute inset-0 bg-safepal-dark-950/50" onClick={onClose} aria-hidden="true" />
      <div className="relative w-full max-w-md bg-safepal-dark-800 rounded-t-2xl sm:rounded-2xl safe-area-bottom max-h-[90vh] overflow-y-auto">
        <div className="p-4 border-b border-safepal-dark-700 flex items-center justify-between sticky top-0 bg-safepal-dark-800 rounded-t-2xl sm:rounded-2xl">
          <h2 id="tx-detail-title" className="text-lg font-semibold text-safepal-dark-50">Transaction Details</h2>
          <button onClick={onClose} className="p-2 rounded-xl text-safepal-dark-400 hover:bg-safepal-dark-700" aria-label="Close">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        <div className="p-4 space-y-4">
          <div className="flex items-center justify-between">
            <div className={cn('flex items-center gap-3 p-4 rounded-xl', typeColors[transaction.type])}>
              <span className="text-2xl" aria-hidden="true">{transaction.token.symbol}</span>
            </div>
            <div className="text-right">
              <div className={cn('text-2xl font-bold', isPositive ? 'text-safepal-dark-400' : 'text-safepal-dark-50')}>
                {isPositive ? '+' : '-'}{formatNumber(transaction.value, { currency: true })}
              </div>
              <div className="text-sm text-safepal-dark-400">{formatDateTime(transaction.timestamp)}</div>
            </div>
          </div>

          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 rounded-xl bg-safepal-dark-950">
              <span className="text-safepal-dark-400">Status</span>
              <Badge variant={transaction.status === 'confirmed' ? 'green' : transaction.status === 'pending' ? 'blue' : 'red'}>
                {transaction.status.charAt(0).toUpperCase() + transaction.status.slice(1)}
              </Badge>
            </div>

            <div className="flex items-center justify-between p-3 rounded-xl bg-safepal-dark-950">
              <span className="text-safepal-dark-400">Type</span>
              <span className="font-medium text-safepal-dark-50">{transaction.type.charAt(0).toUpperCase() + transaction.type.slice(1)}</span>
            </div>

            <div className="flex items-center justify-between p-3 rounded-xl bg-safepal-dark-950">
              <span className="text-safepal-dark-400">Network</span>
              <span className="font-medium text-safepal-dark-50">{transaction.network}</span>
            </div>

            <div className="flex items-center justify-between p-3 rounded-xl bg-safepal-dark-950">
              <span className="text-safepal-dark-400">Amount</span>
              <span className="font-medium text-safepal-dark-50">{formatNumber(transaction.amount, { decimals: 6 })} {transaction.token.symbol}</span>
            </div>

            <div className="flex items-center justify-between p-3 rounded-xl bg-safepal-dark-950">
              <span className="text-safepal-dark-400">Value</span>
              <span className="font-medium text-safepal-dark-50">{formatNumber(transaction.value, { currency: true })}</span>
            </div>

            <div className="flex items-center justify-between p-3 rounded-xl bg-safepal-dark-950">
              <span className="text-safepal-dark-400">Fee</span>
              <span className="font-medium text-safepal-dark-50">{formatNumber(transaction.fee, { decimals: 6 })} {transaction.feeToken}</span>
            </div>

            <div className="flex items-center justify-between p-3 rounded-xl bg-safepal-dark-950">
              <span className="text-safepal-dark-400">From</span>
              <span className="font-mono text-sm text-safepal-dark-50 truncate max-w-[150px]">{formatAddress(transaction.fromAddress)}</span>
            </div>

            <div className="flex items-center justify-between p-3 rounded-xl bg-safepal-dark-950">
              <span className="text-safepal-dark-400">To</span>
              <span className="font-mono text-sm text-safepal-dark-50 truncate max-w-[150px]">{formatAddress(transaction.toAddress)}</span>
            </div>

            <div className="flex items-center justify-between p-3 rounded-xl bg-safepal-dark-950">
              <span className="text-safepal-dark-400">Tx Hash</span>
              <span className="font-mono text-sm text-safepal-dark-50 truncate max-w-[150px]">{formatAddress(transaction.hash, 10)}</span>
            </div>

            {transaction.blockNumber && (
              <div className="flex items-center justify-between p-3 rounded-xl bg-safepal-dark-950">
                <span className="text-safepal-dark-400">Block</span>
                <span className="font-medium text-safepal-dark-50">#{transaction.blockNumber.toLocaleString()}</span>
              </div>
            )}
          </div>

          <div className="pt-4 border-t border-safepal-dark-700">
            <button
              onClick={onClose}
              className="w-full safe-btn-primary"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

interface TransactionListProps {
  transactions: Transaction[];
  onTransactionClick?: (transaction: Transaction) => void;
  emptyMessage?: string;
  className?: string;
}

export function TransactionList({ transactions, onTransactionClick, emptyMessage = 'No transactions yet', className }: TransactionListProps) {
  if (transactions.length === 0) {
    return (
      <div className={cn('flex flex-col items-center justify-center py-12 text-center', className)}>
        <svg className="w-16 h-16 text-safepal-dark-600 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
        <p className="text-safepal-dark-400">{emptyMessage}</p>
      </div>
    );
  }

  return (
    <div className={cn('space-y-3', className)} role="list">
      {transactions.map((tx) => (
        <TransactionItem
          key={tx.id}
          transaction={tx}
          onClick={() => onTransactionClick?.(tx)}
        />
      ))}
    </div>
  );
}