import type { MarketData } from '../types';
import { cn, formatNumber } from '../utils/helpers';
import { Badge } from './ui';

interface MarketTokenProps {
  token: MarketData;
  onClick?: () => void;
  className?: string;
}

export function MarketToken({ token, onClick, className }: MarketTokenProps) {
  const isPositive = token.change24h >= 0;

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
      <div className="w-10 h-10 rounded-full bg-safepal-dark-950 flex items-center justify-center overflow-hidden flex-shrink-0">
        <img
          src={`https://assets.coingecko.com/coins/images/1/large/${token.symbol.toLowerCase()}.png`}
          alt=""
          className="w-full h-full object-cover"
          onError={(e) => {
            e.currentTarget.src = `https://assets.coingecko.com/coins/images/279/large/ethereum.png`;
          }}
        />
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <h4 className="font-semibold text-safepal-dark-50 truncate">{token.symbol}</h4>
          <span className="text-xs text-safepal-dark-400">{token.name}</span>
        </div>
        <div className="text-sm text-safepal-dark-400">
          ${formatNumber(token.price, { currency: true })} • 24h Vol: ${formatNumber(token.volume24h, { compact: true, currency: true })}
        </div>
      </div>
      <div className="text-right flex-shrink-0">
        <div className="font-semibold text-safepal-dark-50">${formatNumber(token.price, { currency: true })}</div>
        <Badge variant={isPositive ? 'green' : 'red'} className="text-xs">
          {isPositive ? '+' : ''}{token.change24h.toFixed(2)}%
        </Badge>
      </div>
      {onClick && (
        <svg className="w-5 h-5 text-safepal-dark-600 flex-shrink-0 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
      )}
    </div>
  );
}

interface MarketListProps {
  tokens: MarketData[];
  onTokenClick?: (token: MarketData) => void;
  searchQuery?: string;
  className?: string;
}

export function MarketList({ tokens, onTokenClick, searchQuery = '', className }: MarketListProps) {
  const filteredTokens = tokens.filter(
    (token) =>
      token.symbol.toLowerCase().includes(searchQuery.toLowerCase()) ||
      token.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (filteredTokens.length === 0) {
    return (
      <div className={cn('flex flex-col items-center justify-center py-12 text-center', className)}>
        <svg className="w-16 h-16 text-safepal-dark-600 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
        <p className="text-safepal-dark-400">No tokens found</p>
      </div>
    );
  }

  return (
    <div className={cn('space-y-3', className)} role="list">
      {filteredTokens.map((token) => (
        <MarketToken
          key={token.symbol}
          token={token}
          onClick={() => onTokenClick?.(token)}
        />
      ))}
    </div>
  );
}

interface MarketHeaderProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
}

export function MarketHeader({ searchQuery, onSearchChange }: MarketHeaderProps) {
  return (
    <div className="safe-container px-4 py-4">
      <div className="relative max-w-md">
        <svg
          className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-safepal-dark-500"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          aria-hidden="true"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
        <input
          type="search"
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Search markets..."
          className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-safepal-dark-800 text-safepal-dark-50 placeholder-safepal-dark-400 text-sm focus:outline-none focus:ring-2 focus:ring-safepal-dark-500 focus:bg-safepal-dark-800"
          aria-label="Search markets"
        />
      </div>
    </div>
  );
}

interface PriceChartProps {
  data: number[];
  color?: 'green' | 'red' | 'blue';
  className?: string;
}

export function PriceChart({ data, color = 'blue', className }: PriceChartProps) {
  const colorClasses = {
    green: 'bg-gradient-to-t from-safepal-dark-500 to-safepal-dark-400',
    red: 'bg-gradient-to-t from-safepal-dark-600 to-safepal-dark-400',
    blue: 'bg-gradient-to-t from-safepal-dark-500 to-safepal-dark-400',
  };

  const min = Math.min(...data);
  const max = Math.max(...data);
  const range = max - min || 1;

  return (
    <div className={cn('h-32 flex items-end justify-around p-4', className)} role="img" aria-label="Price chart">
      {data.map((value, i) => {
        const height = ((value - min) / range) * 100;
        return (
          <div
            key={i}
            className={cn('w-6 rounded-t transition-all duration-300', colorClasses[color])}
            style={{
              height: `${Math.max(height, 4)}%`,
            }}
          />
        );
      })}
    </div>
  );
}