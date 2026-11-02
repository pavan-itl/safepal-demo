import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDemoData } from '../context/DemoDataContext';
import { cn } from '../utils/helpers';
import { Card, CardContent, Button, Input, Badge } from '../components/ui';
import { Select } from '../components/SettingsComponents';
import type { Token, Transaction } from '../types';

type Tab = 'balance' | 'assets' | 'transactions';

const TODAY = new Date().toISOString().slice(0, 10);

export function DemoManagerPage() {
  const navigate = useNavigate();
  const {
    tokens,
    transactions,
    cashBalance,
    totalValue,
    change24h,
    addFunds,
    deductFunds,
    setCashBalance,
    setChange24h,
    addToken,
    updateToken,
    deleteToken,
    addTransaction,
    updateTransaction,
    deleteTransaction,
    resetDemoData,
  } = useDemoData();

  const [tab, setTab] = useState<Tab>('balance');
  const [message, setMessage] = useState('');

  // Balance form
  const [amount, setAmount] = useState('');
  const [balanceInput, setBalanceInput] = useState('');
  const [changeInput, setChangeInput] = useState(String(change24h));

  // Asset form
  const [editingTokenId, setEditingTokenId] = useState<string | null>(null);
  const [assetForm, setAssetForm] = useState({
    symbol: '',
    name: '',
    balance: '',
    price: '',
    icon: '',
    network: 'Ethereum',
    isVerified: true,
  });

  // Transaction form
  const [editingTxId, setEditingTxId] = useState<string | null>(null);
  const [txForm, setTxForm] = useState({
    type: 'receive',
    tokenSymbol: tokens[0]?.symbol || '',
    amount: '',
    value: '',
    status: 'completed',
    date: TODAY,
    time: '12:00',
    fromAddress: 'SIMULATED',
    toAddress: 'SIMULATED',
    fee: '0',
    feeToken: '',
    network: 'Demo',
  });

  const notify = (text: string) => {
    setMessage(text);
    setTimeout(() => setMessage(''), 3000);
  };

  const resetAssetForm = () => {
    setEditingTokenId(null);
    setAssetForm({ symbol: '', name: '', balance: '', price: '', icon: '', network: 'Ethereum', isVerified: true });
  };

  const startEditToken = (t: Token) => {
    setEditingTokenId(t.id);
    setAssetForm({
      symbol: t.symbol,
      name: t.name,
      balance: String(t.balance),
      price: String(t.price),
      icon: t.icon,
      network: t.network || 'Ethereum',
      isVerified: !!t.isVerified,
    });
  };

  const submitAsset = () => {
    const balance = Number(assetForm.balance);
    const price = Number(assetForm.price);
    if (!assetForm.symbol.trim() || !assetForm.name.trim()) {
      notify('Symbol and name are required');
      return;
    }
    if (!Number.isFinite(balance) || balance < 0 || !Number.isFinite(price) || price < 0) {
      notify('Balance and price must be valid numbers');
      return;
    }
    const token: Token = {
      id: editingTokenId || `token-${Date.now()}`,
      symbol: assetForm.symbol.trim().toUpperCase(),
      name: assetForm.name.trim(),
      icon: assetForm.icon.trim() || 'https://assets.coingecko.com/coins/images/279/large/ethereum.png',
      balance,
      price,
      change24h: 0,
      value: balance * price,
      network: assetForm.network,
      decimals: 8,
      isNative: false,
      isVerified: assetForm.isVerified,
    };
    if (editingTokenId) {
      updateToken(editingTokenId, token);
      notify('Asset updated (SIMULATED)');
    } else {
      addToken(token);
      notify('Asset added (SIMULATED)');
    }
    resetAssetForm();
  };

  const removeToken = (id: string) => {
    if (!window.confirm('Delete this demo asset?')) return;
    deleteToken(id);
    notify('Asset deleted (SIMULATED)');
  };

  const resetTxForm = () => {
    setEditingTxId(null);
    setTxForm({
      type: 'receive',
      tokenSymbol: tokens[0]?.symbol || '',
      amount: '',
      value: '',
      status: 'completed',
    date: TODAY,
      time: '12:00',
      fromAddress: 'SIMULATED',
      toAddress: 'SIMULATED',
      fee: '0',
      feeToken: tokens[0]?.symbol || '',
      network: 'Demo',
    });
  };

  const startEditTx = (tx: Transaction) => {
    setEditingTxId(tx.id);
    const d = new Date(tx.timestamp);
    setTxForm({
      type: tx.type,
      tokenSymbol: tx.token.symbol,
      amount: String(tx.amount),
      value: String(tx.value),
      status: tx.status,
      date: d.toISOString().slice(0, 10),
      time: d.toTimeString().slice(0, 5),
      fromAddress: tx.fromAddress,
      toAddress: tx.toAddress,
      fee: String(tx.fee),
      feeToken: tx.feeToken,
      network: tx.network,
    });
  };

  const submitTx = () => {
    const token = tokens.find((t) => t.symbol === txForm.tokenSymbol);
    if (!token) {
      notify('Select a valid token');
      return;
    }
    const amount = Number(txForm.amount);
    const value = Number(txForm.value);
    const fee = Number(txForm.fee);
    if (!Number.isFinite(amount) || amount < 0 || !Number.isFinite(value) || value < 0) {
      notify('Amount and value must be valid numbers');
      return;
    }
    const timestamp = new Date(`${txForm.date}T${txForm.time}`);
    const partial: Partial<Transaction> & { token: Token } = {
      id: editingTxId || undefined,
      type: txForm.type as Transaction['type'],
      status: txForm.status as Transaction['status'],
      token,
      amount,
      value,
      fromAddress: txForm.fromAddress,
      toAddress: txForm.toAddress,
      fee: Number.isFinite(fee) ? fee : 0,
      feeToken: txForm.feeToken || token.symbol,
      network: txForm.network,
      timestamp,
    };
    if (editingTxId) {
      updateTransaction(editingTxId, partial);
      notify('Transaction updated (SIMULATED)');
    } else {
      addTransaction(partial);
      notify('Transaction added (SIMULATED)');
    }
    resetTxForm();
  };

  const removeTx = (id: string) => {
    if (!window.confirm('Delete this simulated transaction?')) return;
    deleteTransaction(id);
    notify('Transaction deleted (SIMULATED)');
  };

  return (
    <div className="safe-page-full safe-area-bottom pb-40">
      <div className="safe-container px-4 py-4">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-2xl font-bold text-safepal-dark-50">Demo Wallet Manager</h1>
          <Button variant="ghost" size="sm" onClick={() => navigate('/')}>Back</Button>
        </div>
        <p className="text-sm text-safepal-dark-400 mb-4">
          All values here are SIMULATED/DEMO only. No real funds or blockchain transactions.
        </p>
        {message && (
          <div className="mb-4 p-3 rounded-xl bg-safepal-dark-900 text-safepal-dark-300 text-sm">{message}</div>
        )}

        <div className="flex gap-2 mb-4" role="tablist">
          {(['balance', 'assets', 'transactions'] as Tab[]).map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={cn(
                'px-4 py-2 rounded-xl text-sm font-medium transition-colors',
                tab === t ? 'bg-safepal-dark-600 text-white' : 'text-safepal-dark-300 hover:bg-safepal-dark-700'
              )}
            >
              {t.charAt(0).toUpperCase() + t.slice(1)}
            </button>
          ))}
        </div>

        {tab === 'balance' && (
          <div className="space-y-4">
            <Card>
              <CardContent className="p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-safepal-dark-400">Cash Balance</span>
                  <span className="font-semibold text-safepal-dark-50">${cashBalance.toFixed(2)}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-safepal-dark-400">Token Value</span>
                  <span className="font-semibold text-safepal-dark-50">${(totalValue - cashBalance).toFixed(2)}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-safepal-dark-400">Total Portfolio</span>
                  <span className="font-bold text-safepal-dark-400">${totalValue.toFixed(2)}</span>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4 space-y-3">
                <Input label="Amount" type="number" value={amount} onChange={(e: any) => setAmount(e.target.value)} placeholder="0.00" />
                <div className="flex gap-2">
                  <Button variant="primary" size="sm" onClick={() => { const n = Number(amount); if (Number.isFinite(n) && n > 0) { addFunds(n); setAmount(''); notify('Funds added (SIMULATED)'); } else notify('Enter a valid amount'); }}>Add Funds</Button>
                  <Button variant="danger" size="sm" onClick={() => { const n = Number(amount); if (Number.isFinite(n) && n > 0) { deductFunds(n); setAmount(''); notify('Funds deducted (SIMULATED)'); } else notify('Enter a valid amount'); }}>Deduct Funds</Button>
                </div>
                <Input label="Set Custom Balance" type="number" value={balanceInput} onChange={(e: any) => setBalanceInput(e.target.value)} placeholder="0.00" />
                <Button variant="secondary" size="sm" onClick={() => { const n = Number(balanceInput); if (Number.isFinite(n) && n >= 0) { setCashBalance(n); setBalanceInput(''); notify('Balance set (SIMULATED)'); } else notify('Enter a valid balance'); }}>Set Balance</Button>
                <Input label="24h Change %" type="number" value={changeInput} onChange={(e: any) => setChangeInput(e.target.value)} placeholder="3.45" />
                <Button variant="secondary" size="sm" onClick={() => { const n = Number(changeInput); if (Number.isFinite(n)) { setChange24h(n); notify('Change updated'); } else notify('Enter a valid number'); }}>Update Change</Button>
              </CardContent>
            </Card>

            <Button variant="danger" size="sm" className="mb-20" onClick={() => { if (window.confirm('Reset all demo data to defaults?')) { resetDemoData(); notify('Demo data reset'); } }}>Reset Demo Data</Button>
          </div>
        )}

        {tab === 'assets' && (
          <div className="space-y-4">
            <Card>
              <CardContent className="p-4 space-y-3">
                <h3 className="font-semibold text-safepal-dark-50">{editingTokenId ? 'Edit Asset' : 'Add Asset'} (SIMULATED)</h3>
                <Input label="Symbol" value={assetForm.symbol} onChange={(e: any) => setAssetForm({ ...assetForm, symbol: e.target.value })} />
                <Input label="Name" value={assetForm.name} onChange={(e: any) => setAssetForm({ ...assetForm, name: e.target.value })} />
                <Input label="Balance" type="number" value={assetForm.balance} onChange={(e: any) => setAssetForm({ ...assetForm, balance: e.target.value })} />
                <Input label="Price" type="number" value={assetForm.price} onChange={(e: any) => setAssetForm({ ...assetForm, price: e.target.value })} />
                <Input label="Icon URL" value={assetForm.icon} onChange={(e: any) => setAssetForm({ ...assetForm, icon: e.target.value })} />
                <Select label="Network" value={assetForm.network} onChange={(e: any) => setAssetForm({ ...assetForm, network: e.target.value })} options={[{ value: 'Ethereum', label: 'Ethereum' }, { value: 'BSC', label: 'BSC' }, { value: 'Solana', label: 'Solana' }, { value: 'Bitcoin', label: 'Bitcoin' }]} />
                <div className="flex gap-2">
                  <Button variant="primary" size="sm" onClick={submitAsset}>{editingTokenId ? 'Save' : 'Add'}</Button>
                  {editingTokenId && <Button variant="ghost" size="sm" onClick={resetAssetForm}>Cancel</Button>}
                </div>
              </CardContent>
            </Card>

            <div className="space-y-2">
              {tokens.map((t) => (
                <Card key={t.id}>
                  <CardContent className="p-3 flex items-center justify-between gap-3">
                    <div className="flex items-center gap-3 min-w-0">
                      <img src={t.icon} alt="" className="w-8 h-8 rounded-full object-cover" />
                      <div className="min-w-0">
                        <div className="font-medium text-safepal-dark-50">{t.symbol} <span className="text-xs text-safepal-dark-400">{t.name}</span></div>
                        <div className="text-xs text-safepal-dark-400">{t.balance} @ ${t.price}</div>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button variant="ghost" size="sm" onClick={() => startEditToken(t)}>Edit</Button>
                      <Button variant="danger" size="sm" onClick={() => removeToken(t.id)}>Delete</Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}

        {tab === 'transactions' && (
          <div className="space-y-4">
            <Card>
              <CardContent className="p-4 space-y-3">
                <h3 className="font-semibold text-safepal-dark-50">{editingTxId ? 'Edit Transaction' : 'Add Transaction'} (SIMULATED)</h3>
                <Select label="Type" value={txForm.type} onChange={(e: any) => setTxForm({ ...txForm, type: e.target.value })} options={[{ value: 'send', label: 'Send' }, { value: 'receive', label: 'Receive' }, { value: 'swap', label: 'Swap' }, { value: 'stake', label: 'Deposit/Stake' }, { value: 'unstake', label: 'Withdrawal' }, { value: 'claim', label: 'Claim' }]} />
                <Select label="Token" value={txForm.tokenSymbol} onChange={(e: any) => setTxForm({ ...txForm, tokenSymbol: e.target.value })} options={tokens.map((t) => ({ value: t.symbol, label: t.symbol }))} />
                <Input label="Amount" type="number" value={txForm.amount} onChange={(e: any) => setTxForm({ ...txForm, amount: e.target.value })} />
                <Input label="Value" type="number" value={txForm.value} onChange={(e: any) => setTxForm({ ...txForm, value: e.target.value })} />
                <Select label="Status" value={txForm.status} onChange={(e: any) => setTxForm({ ...txForm, status: e.target.value })} options={[{ value: 'pending', label: 'Pending' }, { value: 'confirmed', label: 'Completed' }, { value: 'failed', label: 'Failed' }]} />
                <Input label="Date" type="date" value={txForm.date} onChange={(e: any) => setTxForm({ ...txForm, date: e.target.value })} />
                <Input label="Time" type="time" value={txForm.time} onChange={(e: any) => setTxForm({ ...txForm, time: e.target.value })} />
                <Input label="From" value={txForm.fromAddress} onChange={(e: any) => setTxForm({ ...txForm, fromAddress: e.target.value })} />
                <Input label="To" value={txForm.toAddress} onChange={(e: any) => setTxForm({ ...txForm, toAddress: e.target.value })} />
                <Input label="Fee" type="number" value={txForm.fee} onChange={(e: any) => setTxForm({ ...txForm, fee: e.target.value })} />
                <Input label="Fee Token" value={txForm.feeToken} onChange={(e: any) => setTxForm({ ...txForm, feeToken: e.target.value })} />
                <Input label="Network" value={txForm.network} onChange={(e: any) => setTxForm({ ...txForm, network: e.target.value })} />
                <div className="flex gap-2">
                  <Button variant="primary" size="sm" onClick={submitTx}>{editingTxId ? 'Save' : 'Add'}</Button>
                  {editingTxId && <Button variant="ghost" size="sm" onClick={resetTxForm}>Cancel</Button>}
                </div>
              </CardContent>
            </Card>

            <div className="space-y-2">
              {transactions.map((tx) => (
                <Card key={tx.id}>
                  <CardContent className="p-3 flex items-center justify-between gap-3">
                    <div className="min-w-0">
                      <div className="font-medium text-safepal-dark-50">{tx.token.symbol} <Badge variant={tx.status === 'confirmed' ? 'green' : tx.status === 'pending' ? 'blue' : 'red'} className="text-xs ml-2">{tx.status}</Badge></div>
                      <div className="text-xs text-safepal-dark-400">{tx.type} • {tx.amount} • ${tx.value}</div>
                    </div>
                    <div className="flex gap-2">
                      <Button variant="ghost" size="sm" onClick={() => startEditTx(tx)}>Edit</Button>
                      <Button variant="danger" size="sm" onClick={() => removeTx(tx.id)}>Delete</Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
