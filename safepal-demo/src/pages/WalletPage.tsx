import { useState } from 'react';
import { useDemoData } from '../context/DemoDataContext';
import { cn, formatNumber } from '../utils/helpers';
import { Input, Button } from '../components/ui';
import {
  Hexagon,
  Bell,
  ScanLine,
  Copy,
  ChevronDown,
  Eye,
  EyeOff,
  ArrowUp,
  ArrowDown,
  CreditCard,
  Fuel,
  MoreVertical,
  Search,
  X,
} from 'lucide-react';

interface WalletPageProps {
  editable?: boolean;
}

export function WalletPage({ editable = true }: WalletPageProps) {
  const { tokens, totalValue, updateToken, setCashBalance } = useDemoData();
  const [searchQuery, setSearchQuery] = useState('');
  const [showBalance, setShowBalance] = useState(true);
  const [activeTab, setActiveTab] = useState<'coin' | 'earn' | 'nft'>('coin');
  const [editing, setEditing] = useState<{ label: string; value: number; onSave: (v: number) => void } | null>(null);
  const [editValue, setEditValue] = useState('');

  const filteredTokens = tokens.filter((token) =>
    token.symbol.toLowerCase().includes(searchQuery.toLowerCase()) ||
    token.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const btcToken = tokens.find((t) => t.symbol === 'BTC');

  const openEditor = (label: string, value: number, onSave: (v: number) => void) => {
    if (!editable) return;
    setEditing({ label, value, onSave });
    setEditValue(String(value));
  };

  const saveEdit = () => {
    const n = Number(editValue);
    if (!Number.isFinite(n) || n < 0) return;
    editing?.onSave(n);
    setEditing(null);
  };

  return (
    <div className="safe-page-full safe-area-bottom pb-24">
      <header className="safe-header safe-area-top">
        <div className="safe-container flex items-center justify-between px-4 py-3">
          <div className="flex items-center gap-3">
            <button className="w-10 h-10 rounded-full bg-safepal-dark-800 flex items-center justify-center" aria-label="Settings">
              <Hexagon className="w-5 h-5" />
            </button>
            <button className="w-10 h-10 rounded-full bg-safepal-dark-800 flex items-center justify-center" aria-label="Notifications">
              <Bell className="w-5 h-5" />
            </button>
          </div>
          <div className="flex items-center gap-2">
            <button className="flex items-center gap-1 px-3 py-2 rounded-xl bg-safepal-dark-800 text-safepal-dark-50 text-sm font-medium">
              Wallet01-S2J
              <ChevronDown className="w-4 h-4" />
            </button>
            <button className="w-10 h-10 rounded-full bg-safepal-dark-800 flex items-center justify-center" aria-label="Copy address">
              <Copy className="w-5 h-5" />
            </button>
          </div>
          <button className="w-10 h-10 rounded-full bg-safepal-dark-800 flex items-center justify-center" aria-label="Scan">
            <ScanLine className="w-5 h-5" />
          </button>
        </div>
      </header>

      <div className="safe-container px-4">
        <div className="flex items-center justify-around border-b border-safepal-dark-700 py-2">
          {(['coin', 'earn', 'nft'] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={cn(
                'px-4 py-2 text-sm font-semibold',
                activeTab === tab ? 'text-safepal-dark-50 border-b-2 border-safepal-dark-50' : 'text-safepal-dark-400'
              )}
            >
              {tab === 'coin' ? 'Coin' : tab === 'earn' ? 'Earn' : 'NFT'}
            </button>
          ))}
        </div>

        <div className="text-center py-6">
          <div className="flex items-center justify-center gap-2 text-safepal-dark-400 text-sm mb-2">
            <span>Balance</span>
            <button onClick={() => setShowBalance(!showBalance)} aria-label="Toggle balance">
              {showBalance ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
            </button>
          </div>
          <div
            className={cn('text-4xl font-bold text-safepal-dark-50', editable && 'cursor-pointer hover:underline')}
            onClick={() => openEditor('Total Portfolio Value', totalValue, (v) => {
              const tokenValue = tokens.reduce((s, t) => s + t.balance * t.price, 0);
              setCashBalance(v - tokenValue);
            })}
          >
            {showBalance ? formatNumber(totalValue, { currency: true }) : '••••'}
          </div>
          <button
            type="button"
            disabled={!editable}
            onClick={() => btcToken && openEditor('BTC Balance', btcToken.balance, (v) => updateToken(btcToken.id, { balance: v, value: v * btcToken.price }))}
            className={cn('text-safepal-dark-400 text-sm mt-1', editable && 'cursor-pointer hover:underline')}
          >
            {showBalance ? `${formatNumber(btcToken?.balance || 0, { decimals: 4 })} BTC` : ''}
          </button>
        </div>

        <div className="grid grid-cols-5 gap-2 sm:gap-3 mb-4" role="list">
          {[
            { id: 'send', label: 'Send', icon: <ArrowUp className="w-5 h-5" />, onClick: () => alert('Send clicked') },
            { id: 'receive', label: 'Receive', icon: <ArrowDown className="w-5 h-5" />, onClick: () => alert('Receive clicked') },
            { id: 'buy', label: 'Buy', icon: <CreditCard className="w-5 h-5" />, onClick: () => alert('Buy clicked') },
            { id: 'gas', label: 'Gas Station', icon: <Fuel className="w-5 h-5" />, onClick: () => alert('Gas Station (demo)') },
            { id: 'more', label: 'More', icon: <MoreVertical className="w-5 h-5" />, onClick: () => alert('More actions') },
          ].map((action) => (
            <button
              key={action.id}
              onClick={action.onClick}
              className="p-4 flex flex-col items-center gap-2 text-center rounded-xl border-0 shadow-none bg-transparent transition-all duration-200 hover:bg-safepal-dark-800/40 active:bg-safepal-dark-700/40"
              role="listitem"
              aria-label={action.label}
            >
              <div className="w-12 h-12 rounded-full bg-safepal-dark-800 flex items-center justify-center text-safepal-dark-400">
                {action.icon}
              </div>
              <span className="text-xs font-medium text-safepal-dark-50">{action.label}</span>
            </button>
          ))}
        </div>

        <div className="flex items-center gap-2 mb-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-safepal-dark-400" />
            <Input
              placeholder="Search"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
          <button className="px-3 py-2 rounded-xl bg-safepal-dark-800 text-safepal-dark-50 text-sm flex items-center gap-1">
            All
            <ChevronDown className="w-4 h-4" />
          </button>
          <button className="w-10 h-10 rounded-full bg-safepal-dark-800 flex items-center justify-center" aria-label="Options">
            <MoreVertical className="w-5 h-5" />
          </button>
        </div>

        <div className="space-y-2 pb-24">
          {filteredTokens.map((token) => {
            const isPositive = token.change24h >= 0;
            return (
              <div
                key={token.id}
                className="flex justify-between items-center p-3 mb-2 rounded-xl bg-safepal-dark-800 border border-safepal-dark-700"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <img src={token.icon} alt="" className="w-10 h-10 rounded-full object-cover" />
                  <div className="min-w-0">
                    <div className="font-medium text-safepal-dark-50">{token.symbol}</div>
                    <div className="text-xs text-safepal-dark-400">{token.network}</div>
                    <button
                      type="button"
                      disabled={!editable}
                      onClick={() => openEditor(`${token.symbol} Price`, token.price, (v) => updateToken(token.id, { price: v, value: token.balance * v }))}
                      className={cn('text-xs text-safepal-dark-400', editable && 'cursor-pointer hover:underline')}
                    >
                      ${token.price.toFixed(2)}
                    </button>
                    <div className={cn('text-xs', isPositive ? 'text-green-500' : 'text-red-500')}>
                      {isPositive ? '+' : ''}{token.change24h.toFixed(2)}%
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <button
                    type="button"
                    disabled={!editable}
                    onClick={() => openEditor(`${token.symbol} Quantity`, token.balance, (v) => updateToken(token.id, { balance: v, value: v * token.price }))}
                    className={cn('font-medium text-safepal-dark-50', editable && 'cursor-pointer hover:underline')}
                  >
                    {formatNumber(token.balance, { decimals: 4 })}
                  </button>
                  <button
                    type="button"
                    disabled={!editable}
                    onClick={() => openEditor(`${token.symbol} Value`, token.value, (v) => {
                      const price = token.price || 1;
                      updateToken(token.id, { value: v, balance: v / price });
                    })}
                    className={cn('text-xs text-safepal-dark-400 block', editable && 'cursor-pointer hover:underline')}
                  >
                    {formatNumber(token.value, { currency: true })}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {editing && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/50" onClick={() => setEditing(null)} />
          <div className="relative w-full max-w-sm bg-safepal-dark-800 rounded-2xl p-4 border border-safepal-dark-700">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-lg font-semibold text-safepal-dark-50">Edit {editing.label}</h3>
              <button onClick={() => setEditing(null)} className="p-2 rounded-xl text-safepal-dark-400 hover:bg-safepal-dark-700">
                <X className="w-4 h-4" />
              </button>
            </div>
            <Input
              label="Amount"
              type="number"
              value={editValue}
              onChange={(e: any) => setEditValue(e.target.value)}
            />
            <div className="flex gap-2 mt-4">
              <Button variant="primary" size="sm" onClick={saveEdit}>Save</Button>
              <Button variant="ghost" size="sm" onClick={() => setEditing(null)}>Cancel</Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
