import { useState } from 'react';
import { demoMarketData } from '../data/demoData';
import { Header } from '../components/Header';
import { MarketList, MarketHeader } from '../components/MarketComponents';
import { cn, formatNumber } from '../utils/helpers';
import { Card, Badge } from '../components/ui';

export function MarketPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<'gainers' | 'losers' | 'volume' | 'marketcap'>('gainers');

  const sortedTokens = [...demoMarketData].sort((a, b) => {
    switch (sortBy) {
      case 'gainers':
        return b.change24h - a.change24h;
      case 'losers':
        return a.change24h - b.change24h;
      case 'volume':
        return b.volume24h - a.volume24h;
      case 'marketcap':
        return b.marketCap - a.marketCap;
      default:
        return 0;
    }
  });

  const topGainers = [...demoMarketData].sort((a, b) => b.change24h - a.change24h).slice(0, 3);
  const topLosers = [...demoMarketData].sort((a, b) => a.change24h - b.change24h).slice(0, 3);

  return (
    <div className="safe-page-full safe-area-bottom pb-24">
      <Header title="Markets" />

      <main className="safe-container px-4 pb-8">
        <MarketHeader
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
        />

        <div className="grid grid-cols-2 gap-3 mb-4">
          <Card className="p-4">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-medium text-safepal-dark-900">Top Gainers</h3>
              <Badge variant="green" className="text-xs">24h</Badge>
            </div>
            <div className="space-y-2">
              {topGainers.map((token) => (
                <div key={token.symbol} className="flex items-center justify-between py-2 border-b border-safepal-dark-100 last:border-0">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-safepal-green-50 flex items-center justify-center overflow-hidden">
                      <img
                        src={`https://assets.coingecko.com/coins/images/1/large/${token.symbol.toLowerCase()}.png`}
                        alt=""
                        className="w-full h-full object-cover"
                        onError={(e) => { e.currentTarget.src = `https://assets.coingecko.com/coins/images/279/large/ethereum.png`; }}
                      />
                    </div>
                    <div>
                      <p className="font-medium text-safepal-dark-900 text-sm">{token.symbol}</p>
                      <p className="text-xs text-safepal-dark-500">${formatNumber(token.price, { currency: true })}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-semibold text-safepal-green-600">+{token.change24h.toFixed(2)}%</p>
                    <p className="text-xs text-safepal-dark-500">${formatNumber(token.volume24h, { compact: true, currency: true })}</p>
                  </div>
                </div>
              ))}
            </div>
          </Card>

          <Card className="p-4">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-medium text-safepal-dark-900">Top Losers</h3>
              <Badge variant="green" className="text-xs">24h</Badge>
            </div>
            <div className="space-y-2">
              {topLosers.map((token) => (
                <div key={token.symbol} className="flex items-center justify-between py-2 border-b border-safepal-dark-100 last:border-0">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-safepal-green-50 flex items-center justify-center overflow-hidden">
                      <img
                        src={`https://assets.coingecko.com/coins/images/1/large/${token.symbol.toLowerCase()}.png`}
                        alt=""
                        className="w-full h-full object-cover"
                        onError={(e) => { e.currentTarget.src = `https://assets.coingecko.com/coins/images/279/large/ethereum.png`; }}
                      />
                    </div>
                    <div>
                      <p className="font-medium text-safepal-dark-900 text-sm">{token.symbol}</p>
                      <p className="text-xs text-safepal-dark-500">${formatNumber(token.price, { currency: true })}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-semibold text-safepal-green-600">{token.change24h.toFixed(2)}%</p>
                    <p className="text-xs text-safepal-dark-500">${formatNumber(token.volume24h, { compact: true, currency: true })}</p>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>

        <div className="flex items-center gap-2 overflow-x-auto pb-2 -mx-4 px-4 mb-4" role="tablist" aria-label="Sort options">
          {(['gainers', 'losers', 'volume', 'marketcap'] as const).map((sort) => (
            <button
              key={sort}
              onClick={() => setSortBy(sort)}
              className={cn(
                'px-4 py-2 rounded-xl text-sm font-medium whitespace-nowrap transition-colors',
                sortBy === sort
                  ? 'bg-safepal-blue-600 text-white'
                  : 'text-safepal-dark-600 hover:bg-safepal-dark-100'
              )}
              role="tab"
              aria-selected={sortBy === sort}
            >
              {sort.charAt(0).toUpperCase() + sort.slice(1)}
            </button>
          ))}
        </div>

        <MarketList
          tokens={sortedTokens.filter(
            (token) =>
              token.symbol.toLowerCase().includes(searchQuery.toLowerCase()) ||
              token.name.toLowerCase().includes(searchQuery.toLowerCase())
          )}
          onTokenClick={(token) => alert(`${token.symbol} details`)}
          searchQuery={searchQuery}
        />
      </main>
    </div>
  );
}