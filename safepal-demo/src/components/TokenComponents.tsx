import type { Token } from '../types';
import { cn, formatNumber, formatAddress } from '../utils/helpers';
import { Card, Button } from './ui';

interface TokenCardProps {
  token: Token;
  variant?: 'default' | 'compact' | 'detailed';
  onClick?: () => void;
  showActions?: boolean;
  className?: string;
}

export function TokenCard({ token, variant = 'default', onClick, showActions = false, className }: TokenCardProps) {
  const value = token.balance * token.price;
  const isPositive = token.change24h >= 0;

  if (variant === 'compact') {
    return (
      <div
        className={cn('flex items-center gap-3 p-3 rounded-xl bg-safepal-dark-800 border border-safepal-dark-700', className)}
        onClick={onClick}
        role={onClick ? 'button' : undefined}
        tabIndex={onClick ? 0 : undefined}
        onKeyDown={onClick ? (e) => e.key === 'Enter' && onClick() : undefined}
      >
        <div className="w-10 h-10 rounded-full bg-safepal-dark-950 flex items-center justify-center overflow-hidden flex-shrink-0">
          <img src={token.icon} alt="" className="w-full h-full object-cover" />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <span className="font-medium text-safepal-dark-50 truncate">{token.symbol}</span>
            {token.isVerified && (
              <svg className="w-4 h-4 text-safepal-blue-400 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
                <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 12.586l-1.293-1.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
            )}
          </div>
          <span className="text-sm text-safepal-dark-400 truncate">{token.name}</span>
        </div>
        <div className="text-right">
          <div className="font-medium text-safepal-dark-50">{formatNumber(value, { currency: true, compact: true })}</div>
          <span className={cn('text-xs font-medium', isPositive ? 'text-safepal-green-400' : 'text-safepal-red-400')}>
            {isPositive ? '+' : ''}{token.change24h.toFixed(2)}%
          </span>
        </div>
      </div>
    );
  }

  if (variant === 'detailed') {
    return (
      <Card className={cn('p-4', className)}>
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-center gap-3 flex-1 min-w-0">
            <div className="w-12 h-12 rounded-xl bg-safepal-dark-950 flex items-center justify-center overflow-hidden flex-shrink-0">
              <img src={token.icon} alt="" className="w-full h-full object-cover" />
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <h3 className="font-semibold text-safepal-dark-50 truncate">{token.symbol}</h3>
                {token.isVerified && (
                  <svg className="w-4 h-4 text-safepal-blue-400 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
                    <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 12.586l-1.293-1.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                )}
              </div>
              <p className="text-sm text-safepal-dark-400 truncate">{token.name}</p>
              <p className="text-xs text-safepal-dark-500">{token.network} • {formatAddress(token.contractAddress || '')}</p>
            </div>
          </div>
          <div className="text-right flex-shrink-0">
            <div className="text-lg font-semibold text-safepal-dark-50">{formatNumber(value, { currency: true })}</div>
            <div className="text-sm text-safepal-dark-400">{formatNumber(token.balance, { decimals: 4 })} {token.symbol}</div>
            <span className={cn('inline-block mt-1 text-xs font-medium px-2 py-0.5 rounded-full', isPositive ? 'bg-safepal-green-900 text-safepal-green-300' : 'bg-safepal-red-900 text-safepal-red-300')}>
              {isPositive ? '+' : ''}{token.change24h.toFixed(2)}%
            </span>
          </div>
        </div>
        {showActions && (
          <div className="mt-4 flex items-center gap-2">
            <Button variant="outline" size="sm">Send</Button>
            <Button variant="outline" size="sm">Receive</Button>
            <Button variant="primary" size="sm">Swap</Button>
          </div>
        )}
      </Card>
    );
  }

  return (
    <Card className={cn('p-4', className)} onClick={onClick} role={onClick ? 'button' : undefined} tabIndex={onClick ? 0 : undefined} onKeyDown={onClick ? (e) => e.key === 'Enter' && onClick() : undefined}>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-safepal-dark-950 flex items-center justify-center overflow-hidden">
            <img src={token.icon} alt="" className="w-full h-full object-cover" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-semibold text-safepal-dark-50">{token.symbol}</h3>
              {token.isVerified && (
                <svg className="w-4 h-4 text-safepal-blue-400" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
                  <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 12.586l-1.293-1.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
              )}
            </div>
            <p className="text-sm text-safepal-dark-400">{token.name}</p>
          </div>
        </div>
        <div className="text-right">
          <div className="font-semibold text-safepal-dark-50">{formatNumber(value, { currency: true })}</div>
          <div className="text-sm text-safepal-dark-400">{formatNumber(token.balance, { decimals: 4 })} {token.symbol}</div>
        </div>
      </div>
      <div className="mt-3 flex items-center justify-between">
        <span className={cn('text-sm font-medium', isPositive ? 'text-safepal-green-400' : 'text-safepal-red-400')}>
          {isPositive ? '+' : ''}{token.change24h.toFixed(2)}% (24h)
        </span>
        {showActions && (
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="sm">Send</Button>
            <Button variant="ghost" size="sm">Receive</Button>
          </div>
        )}
      </div>
    </Card>
  );
}

interface TokenListProps {
  tokens: Token[];
  variant?: 'default' | 'compact' | 'detailed';
  onTokenClick?: (token: Token) => void;
  showActions?: boolean;
  emptyMessage?: string;
  className?: string;
}

export function TokenList({ tokens, variant = 'default', onTokenClick, showActions = false, emptyMessage = 'No tokens found', className }: TokenListProps) {
  if (tokens.length === 0) {
    return (
      <div className={cn('flex flex-col items-center justify-center py-12 text-center', className)}>
        <svg className="w-16 h-16 text-safepal-dark-600 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
        </svg>
        <p className="text-safepal-dark-400">{emptyMessage}</p>
      </div>
    );
  }

  return (
    <div className={cn('space-y-3', className)} role="list">
      {tokens.map((token) => (
        <TokenCard
          key={token.id}
          token={token}
          variant={variant}
          onClick={() => onTokenClick?.(token)}
          showActions={showActions}
        />
      ))}
    </div>
  );
}

interface PortfolioSummaryProps {
  totalValue: number;
  change24h: number;
  changeValue24h: number;
  className?: string;
}

export function PortfolioSummary({ totalValue, change24h, changeValue24h, className }: PortfolioSummaryProps) {
  const isPositive = change24h >= 0;

  return (
    <Card elevated className={cn('p-6', className)}>
      <div className="flex items-start justify-between">
        <div>
          <p className="text-safepal-dark-400 text-sm mb-2">Total Portfolio Value</p>
          <div className="text-3xl font-bold text-safepal-dark-50">${formatNumber(totalValue, { currency: true })}</div>
        </div>
        <div className="text-right">
            <div className={cn('text-lg font-semibold', isPositive ? 'text-safepal-green-400' : 'text-safepal-red-400')}>
              {isPositive ? '+' : ''}{change24h.toFixed(2)}%
            </div>
            <div className={cn('text-sm', isPositive ? 'text-safepal-green-400' : 'text-safepal-red-400')}>
              {isPositive ? '+' : ''}${formatNumber(Math.abs(changeValue24h), { currency: true })}
            </div>
        </div>
      </div>
      <div className="mt-6 h-32 bg-gradient-to-r from-safepal-blue-500/10 to-safepal-blue-600/10 rounded-xl flex items-end justify-around p-4" role="img" aria-label="Portfolio value chart over 24 hours">
        {[0.3, 0.45, 0.35, 0.6, 0.5, 0.7, 0.65, 0.8, 0.75, 0.9, 0.85, 1].map((height, i) => (
          <div
            key={i}
            className="w-6 bg-gradient-to-t from-safepal-blue-500 to-safepal-blue-400 rounded-t transition-all duration-300"
            style={{ height: `${height * 100}%` }}
          />
        ))}
      </div>
    </Card>
  );
}

interface QuickActionsProps {
  onSend?: () => void;
  onReceive?: () => void;
  onSwap?: () => void;
  onBuy?: () => void;
  className?: string;
}

export function QuickActions({ onSend, onReceive, onSwap, onBuy, className }: QuickActionsProps) {
  const actions = [
    { id: 'send', label: 'Send', icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
      </svg>
    ), onClick: onSend },
    { id: 'receive', label: 'Receive', icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 5l-9 2 9 18 9-18-9-2zm0 0v8" />
      </svg>
    ), onClick: onReceive },
    { id: 'swap', label: 'Swap', icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
      </svg>
    ), onClick: onSwap },
    { id: 'buy', label: 'Buy', icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
      </svg>
    ), onClick: onBuy },
  ];

  return (
    <div className={cn('grid grid-cols-4 gap-3', className)} role="list">
      {actions.map((action) => (
        <button
          key={action.id}
          onClick={action.onClick}
          className={cn(
            'safe-card p-4 flex flex-col items-center gap-2 text-center',
            'hover:safe-card-elevated transition-all duration-200'
          )}
          role="listitem"
          aria-label={action.label}
        >
          <div className="w-12 h-12 rounded-xl bg-safepal-blue-900 flex items-center justify-center text-safepal-blue-400">
            {action.icon}
          </div>
          <span className="text-sm font-medium text-safepal-dark-50">{action.label}</span>
        </button>
      ))}
    </div>
  );
}