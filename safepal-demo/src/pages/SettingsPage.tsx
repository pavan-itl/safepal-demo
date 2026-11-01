import { useState } from 'react';
import { Header } from '../components/Header';
import {
  SettingsSection,
  SettingsItem,
  Toggle,
  Select,
  DangerZoneItem,
  VersionInfo,
  WalletSelector,
} from '../components/SettingsComponents';
import { cn } from '../utils/helpers';
import { Card, Button, Input } from '../components/ui';

const demoWallets = [
  { id: '1', name: 'Main Wallet', address: '0x742d...b8D4', isActive: true },
  { id: '2', name: 'Trading Wallet', address: '0x9abc...def0', isActive: false },
  { id: '3', name: 'Savings Vault', address: '0xdef0...1234', isActive: false },
];

export function SettingsPage() {
  const [activeWalletId, setActiveWalletId] = useState('1');
  const [currency, setCurrency] = useState('USD');
  const [language, setLanguage] = useState('en');
  const [theme, setTheme] = useState<'light' | 'dark' | 'system'>('system');
  const [notifications, setNotifications] = useState(true);
  const [biometric, setBiometric] = useState(false);
  const [autoLock, setAutoLock] = useState(5);

  return (
    <div className="safe-page-full safe-area-bottom pb-24">
      <Header title="Settings" />

      <main className="safe-container px-4 pb-8">
        <SettingsSection title="Wallets">
          <WalletSelector
            wallets={demoWallets}
            activeWalletId={activeWalletId}
            onSelect={setActiveWalletId}
            onAddWallet={() => alert('Add wallet clicked')}
          />
        </SettingsSection>

        <SettingsSection title="Preferences">
          <SettingsItem
            label="Currency"
            description="Default currency for portfolio values"
          >
            <Select
              value={currency}
              onChange={(e) => setCurrency(e.target.value)}
              options={[
                { value: 'USD', label: 'USD ($)' },
                { value: 'EUR', label: 'EUR (€)' },
                { value: 'GBP', label: 'GBP (£)' },
                { value: 'JPY', label: 'JPY (¥)' },
                { value: 'CNY', label: 'CNY (¥)' },
              ]}
            />
          </SettingsItem>

          <SettingsItem
            label="Language"
            description="App language"
          >
            <Select
              value={language}
              onChange={(e) => setLanguage(e.target.value)}
              options={[
                { value: 'en', label: 'English' },
                { value: 'zh', label: '中文' },
                { value: 'ko', label: '한국어' },
                { value: 'ja', label: '日本語' },
                { value: 'es', label: 'Español' },
              ]}
            />
          </SettingsItem>

          <SettingsItem
            label="Theme"
            description="Choose your preferred theme"
          >
            <Select
              value={theme}
              onChange={(e) => setTheme(e.target.value as typeof theme)}
              options={[
                { value: 'light', label: 'Light' },
                { value: 'dark', label: 'Dark' },
                { value: 'system', label: 'System' },
              ]}
            />
          </SettingsItem>
        </SettingsSection>

        <SettingsSection title="Security">
          <SettingsItem
            label="Biometric Authentication"
            description="Use Face ID / Fingerprint to unlock"
          >
            <Toggle checked={biometric} onChange={setBiometric} />
          </SettingsItem>

          <SettingsItem
            label="Auto Lock"
            description="Automatically lock the app after inactivity"
          >
            <Select
              value={autoLock.toString()}
              onChange={(e) => setAutoLock(Number(e.target.value))}
              options={[
                { value: '1', label: '1 minute' },
                { value: '5', label: '5 minutes' },
                { value: '15', label: '15 minutes' },
                { value: '30', label: '30 minutes' },
                { value: '60', label: '1 hour' },
              ]}
            />
          </SettingsItem>

          <SettingsItem
            label="Change Password"
            description="Update your app password"
          >
            <Button variant="ghost" size="sm" onClick={() => alert('Change password')}>
              Change
            </Button>
          </SettingsItem>

          <SettingsItem
            label="Two-Factor Authentication"
            description="Add an extra layer of security"
          >
            <Button variant="ghost" size="sm" onClick={() => alert('Enable 2FA')}>
              Enable
            </Button>
          </SettingsItem>
        </SettingsSection>

        <SettingsSection title="Notifications">
          <SettingsItem
            label="Push Notifications"
            description="Receive transaction and price alerts"
          >
            <Toggle checked={notifications} onChange={setNotifications} />
          </SettingsItem>

          <SettingsItem
            label="Transaction Alerts"
            description="Get notified for incoming/outgoing transactions"
          >
            <Toggle checked={true} onChange={() => {}} />
          </SettingsItem>

          <SettingsItem
            label="Price Alerts"
            description="Get notified when tokens reach target prices"
          >
            <Toggle checked={false} onChange={() => {}} />
          </SettingsItem>
        </SettingsSection>

        <SettingsSection title="Networks & Nodes">
          <SettingsItem
            label="Custom RPC"
            description="Configure custom RPC endpoints"
          >
            <Button variant="ghost" size="sm" onClick={() => alert('Custom RPC')}>
              Manage
            </Button>
          </SettingsItem>

          <SettingsItem
            label="Network Management"
            description="Add or remove blockchain networks"
          >
            <Button variant="ghost" size="sm" onClick={() => alert('Network management')}>
              Manage
            </Button>
          </SettingsItem>
        </SettingsSection>

        <SettingsSection title="Advanced">
          <SettingsItem
            label="Gas Settings"
            description="Configure default gas price and limits"
          >
            <Button variant="ghost" size="sm" onClick={() => alert('Gas settings')}>
              Configure
            </Button>
          </SettingsItem>

          <SettingsItem
            label="Token Lists"
            description="Manage custom token lists"
          >
            <Button variant="ghost" size="sm" onClick={() => alert('Token lists')}>
              Manage
            </Button>
          </SettingsItem>

          <SettingsItem
            label="Developer Mode"
            description="Enable advanced debugging features"
          >
            <Toggle checked={false} onChange={() => {}} />
          </SettingsItem>
        </SettingsSection>

        <SettingsSection title="Danger Zone">
          <DangerZoneItem
            label="Clear Cache"
            description="Clear all cached data and temporary files"
            buttonText="Clear"
            variant="warning"
            onClick={() => alert('Cache cleared')}
          />
          <DangerZoneItem
            label="Reset App"
            description="Reset app to default settings (keeps wallets)"
            buttonText="Reset"
            onClick={() => alert('App reset')}
          />
          <DangerZoneItem
            label="Delete All Data"
            description="Permanently delete all wallets and data"
            buttonText="Delete"
            onClick={() => alert('Data deleted')}
          />
        </SettingsSection>

        <VersionInfo version="1.0.0" buildNumber="2024.11.01" />
      </main>
    </div>
  );
}