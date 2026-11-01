import { useState } from 'react';
import { demoWallet, demoTokens, demoTransactions } from '../data/demoData';
import { Header } from '../components/Header';
import { PortfolioSummary, QuickActions, TokenList } from '../components/TokenComponents';
import { TransactionList } from '../components/TransactionComponents';
import { cn, formatNumber } from '../utils/helpers';
import { Card, CardContent } from '../components/ui';

export function DashboardPage() {
  const [showBalance, setShowBalance] = useState(true);
  const totalValue = demoWallet.totalValue;
  const change24h = 3.45;
  const changeValue24h = totalValue * (change24h / 100);

  const topTokens = demoTokens.slice(0, 4);
  const recentTransactions = demoTransactions.slice(0, 3);

  return (
    <div className="safe-page-full safe-area-bottom pb-24">
      <Header
        title="Dashboard"
        actions={
          <button
            onClick={() => setShowBalance(!showBalance)}
            className="p-2 rounded-xl text-safepal-dark-600 hover:bg-safepal-dark-100 active:bg-safepal-dark-200 transition-colors"
            aria-label={showBalance ? 'Hide balance' : 'Show balance'}
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={showBalance ? 'M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21' : 'M15 12a3 3 0 11-6 0 3 3 0 016 0z M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z'} />
            </svg>
          </button>
        }
      />

      <main className="safe-container px-4 pb-8">
        <PortfolioSummary
          totalValue={showBalance ? totalValue : 0}
          change24h={showBalance ? change24h : 0}
          changeValue24h={showBalance ? changeValue24h : 0}
        />

        <QuickActions
          onSend={() => alert('Send clicked')}
          onReceive={() => alert('Receive clicked')}
          onSwap={() => alert('Swap clicked')}
          onBuy={() => alert('Buy clicked')}
          className="mt-6"
        />

        <div className="mt-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-safepal-dark-900">Your Assets</h2>
            <button className="text-sm text-safepal-blue-600 font-medium">View All</button>
          </div>
          <TokenList
            tokens={topTokens}
            variant="default"
            onTokenClick={(token) => alert(`${token.symbol} clicked`)}
            showActions={false}
          />
        </div>

        <div className="mt-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-safepal-dark-900">Recent Activity</h2>
            <button className="text-sm text-safepal-blue-600 font-medium">View All</button>
          </div>
          <TransactionList
            transactions={recentTransactions}
            onTransactionClick={(tx) => alert(`Transaction ${tx.id} clicked`)}
            emptyMessage="No recent transactions"
          />
        </div>

        <Card className="mt-6">
          <div className="px-6 py-4 border-b border-safepal-dark-100">
            <h3 className="text-lg font-semibold text-safepal-dark-900">Quick Stats</h3>
          </div>
          <CardContent className="grid grid-cols-2 gap-4 p-4">
            <div className="text-center p-4 rounded-xl bg-safepal-blue-50">
              <div className="text-2xl font-bold text-safepal-blue-600">{demoTokens.length}</div>
              <div className="text-sm text-safepal-blue-700">Tokens Held</div>
            </div>
            <div className="text-center p-4 rounded-xl bg-safepal-green-50">
              <div className="text-2xl font-bold text-safepal-green-600">{demoTransactions.filter(t => t.status === 'confirmed').length}</div>
              <div className="text-sm text-safepal-green-700">Completed Txns</div>
            </div>
            <div className="text-center p-4 rounded-xl bg-safepal-blue-50">
              <div className="text-2xl font-bold text-safepal-blue-600">{demoWallet.networks.length}</div>
              <div className="text-sm text-safepal-blue-700">Networks</div>
            </div>
            <div className="text-center p-4 rounded-xl bg-safepal-green-50">
              <div className="text-2xl font-bold text-safepal-green-600">$0.00</div>
              <div className="text-sm text-safepal-green-700">24h Fees</div>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}