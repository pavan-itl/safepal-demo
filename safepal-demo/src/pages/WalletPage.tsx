import { useState } from 'react';
import { useDemoData } from '../context/DemoDataContext';
import { Header } from '../components/Header';
import { TokenList, PortfolioSummary } from '../components/TokenComponents';
import { cn } from '../utils/helpers';
import { Card, Button, Input } from '../components/ui';

export function WalletPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTab, setSelectedTab] = useState<'all' | 'tokens' | 'nfts' | 'defi'>('all');

  const { tokens, totalValue, change24h } = useDemoData();
  const filteredTokens = tokens.filter(
    (token) =>
      token.symbol.toLowerCase().includes(searchQuery.toLowerCase()) ||
      token.name.toLowerCase().includes(searchQuery.toLowerCase())
  );
  const changeValue24h = totalValue * (change24h / 100);

  return (
    <div className="safe-page-full safe-area-bottom pb-24">
      <Header
        title="Wallet"
        actions={
          <button className="p-2 rounded-xl text-safepal-dark-300 hover:bg-safepal-dark-700 active:bg-safepal-dark-600 transition-colors" aria-label="More options">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
            </svg>
          </button>
        }
      />

      <main className="safe-container px-4 pb-8">
        <PortfolioSummary
          totalValue={totalValue}
          change24h={change24h}
          changeValue24h={changeValue24h}
        />

        <div className="mt-4 flex items-center gap-2 overflow-x-auto pb-2 -mx-4 px-4" role="tablist" aria-label="Asset categories">
          {['all', 'tokens', 'nfts', 'defi'].map((tab) => (
            <button
              key={tab}
              onClick={() => setSelectedTab(tab as typeof selectedTab)}
              className={cn(
                'px-4 py-2 rounded-xl text-sm font-medium whitespace-nowrap transition-colors',
                selectedTab === tab
                  ? 'bg-safepal-dark-600 text-white'
                  : 'text-safepal-dark-300 hover:bg-safepal-dark-700'
              )}
              role="tab"
              aria-selected={selectedTab === tab}
              aria-controls={`${tab}-panel`}
              id={`${tab}-tab`}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          ))}
        </div>

        <div className="mt-4">
          <Input
            placeholder="Search assets..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="max-w-xs"
          />
        </div>

        <div className="mt-4" role="tabpanel" id={`${selectedTab}-panel`} aria-labelledby={`${selectedTab}-tab`}>
          {selectedTab === 'tokens' && (
            <TokenList
              tokens={filteredTokens}
              variant="default"
              onTokenClick={(token) => alert(`${token.symbol} details`)}
              showActions={true}
              emptyMessage="No tokens found"
            />
          )}

          {selectedTab === 'nfts' && (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <svg className="w-16 h-16 text-safepal-dark-600 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              <h3 className="text-lg font-medium text-safepal-dark-50 mb-1">No NFTs yet</h3>
              <p className="text-safepal-dark-400 mb-4">Your NFTs will appear here</p>
              <Button variant="outline" onClick={() => alert('Browse NFTs')}>
                Browse NFTs
              </Button>
            </div>
          )}

          {selectedTab === 'defi' && (
            <div className="space-y-4">
              <Card>
                <div className="p-4 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-xl bg-safepal-dark-900 flex items-center justify-center">
                      <svg className="w-6 h-6 text-safepal-dark-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                      </svg>
                    </div>
                    <div>
                      <h3 className="font-semibold text-safepal-dark-50">Staking</h3>
                      <p className="text-sm text-safepal-dark-400">Earn rewards on your assets</p>
                    </div>
                  </div>
                  <Button variant="primary" size="sm">Stake Now</Button>
                </div>
              </Card>

              <Card>
                <div className="p-4 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-xl bg-safepal-dark-900 flex items-center justify-center">
                      <svg className="w-6 h-6 text-safepal-dark-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
                      </svg>
                    </div>
                    <div>
                      <h3 className="font-semibold text-safepal-dark-50">Swap</h3>
                      <p className="text-sm text-safepal-dark-400">Exchange tokens instantly</p>
                    </div>
                  </div>
                  <Button variant="primary" size="sm">Swap</Button>
                </div>
              </Card>

              <Card>
                <div className="p-4 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-xl bg-safepal-dark-900 flex items-center justify-center">
                      <svg className="w-6 h-6 text-safepal-dark-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                      </svg>
                    </div>
                    <div>
                      <h3 className="font-semibold text-safepal-dark-50">DApps</h3>
                      <p className="text-sm text-safepal-dark-400">Explore decentralized apps</p>
                    </div>
                  </div>
                  <Button variant="outline" size="sm">Explore</Button>
                </div>
              </Card>
            </div>
          )}

          {selectedTab === 'all' && (
            <>
              <TokenList
                tokens={filteredTokens}
                variant="default"
                onTokenClick={(token) => alert(`${token.symbol} details`)}
                showActions={true}
                emptyMessage="No tokens found"
              />
            </>
          )}
        </div>
      </main>
    </div>
  );
}