import { cn } from '../utils/helpers';
import { Button, Card, CardContent } from './ui';

interface SettingsSectionProps {
  title: string;
  children: React.ReactNode;
  className?: string;
}

export function SettingsSection({ title, children, className }: SettingsSectionProps) {
  return (
    <Card className={cn('mb-4', className)}>
      <div className="px-6 py-3 border-b border-safepal-dark-100">
        <h3 className="text-sm font-semibold text-safepal-dark-900 uppercase tracking-wider">{title}</h3>
      </div>
      <CardContent className="pt-2 pb-2">{children}</CardContent>
    </Card>
  );
}

interface SettingsItemProps {
  label: string;
  description?: string;
  children: React.ReactNode;
  className?: string;
}

export function SettingsItem({ label, description, children, className }: SettingsItemProps) {
  return (
    <div className={cn('px-6 py-4 flex items-center justify-between border-b border-safepal-dark-100 last:border-0', className)}>
      <div className="flex-1">
        <p className="font-medium text-safepal-dark-900">{label}</p>
        {description && <p className="text-sm text-safepal-dark-500 mt-0.5">{description}</p>}
      </div>
      <div className="flex-shrink-0 ml-4">{children}</div>
    </div>
  );
}

interface ToggleProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  disabled?: boolean;
  className?: string;
}

export function Toggle({ checked, onChange, disabled = false, className }: ToggleProps) {
  return (
    <button
      onClick={() => !disabled && onChange(!checked)}
      disabled={disabled}
      role="switch"
      aria-checked={checked}
      className={cn(
        'relative w-11 h-6 rounded-full transition-colors duration-200',
        checked ? 'bg-safepal-blue-600' : 'bg-safepal-dark-300',
        disabled && 'opacity-50 cursor-not-allowed',
        className
      )}
      aria-label={checked ? 'Enabled' : 'Disabled'}
    >
      <span
        className={cn(
          'absolute top-0.5 w-5 h-5 rounded-full bg-white shadow-md transition-transform duration-200',
          checked ? 'translate-x-5' : 'translate-x-0.5'
        )}
        aria-hidden="true"
      />
    </button>
  );
}

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  options: Array<{ value: string; label: string }>;
  error?: string;
}

export function Select({ label, options, error, className, id, ...props }: SelectProps) {
  const selectId = id || label?.toLowerCase().replace(/\s+/g, '-');

  return (
    <div className="w-full">
      {label && (
        <label htmlFor={selectId} className="safe-label">
          {label}
        </label>
      )}
      <select
        id={selectId}
        className={cn('safe-input appearance-none bg-no-repeat bg-right pr-10', 'bg-[url("data:image/svg+xml,%3Csvg xmlns=%27http://www.w3.org/2000/svg%27 fill=%27none%27 viewBox=%270 0 24 24%27 stroke=%27%2364748B%27%3E%3Cpath stroke-linecap=%27round%27 stroke-linejoin=%27round%27 stroke-width=%272%27 d=%27M19 9l-7 7-7-7%27/%3E%3C/svg%3E")]', error && 'safe-input-error', className)}
        aria-invalid={error ? 'true' : 'false'}
        {...props}
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      {error && (
        <p className="mt-1.5 text-sm text-safepal-green-600" role="alert">
          {error}
        </p>
      )}
    </div>
  );
}

interface DangerZoneItemProps {
  label: string;
  description: string;
  buttonText: string;
  onClick: () => void;
  variant?: 'danger' | 'ghost' | 'outline' | 'primary' | 'secondary';
  className?: string;
}

export function DangerZoneItem({ label, description, buttonText, onClick, variant = 'danger', className }: DangerZoneItemProps) {
  return (
    <div className={cn('px-6 py-4 flex items-center justify-between border-b border-safepal-dark-100 last:border-0', className)}>
      <div className="flex-1">
        <p className="font-medium text-safepal-dark-900">{label}</p>
        <p className="text-sm text-safepal-dark-500 mt-0.5">{description}</p>
      </div>
      <Button variant={variant} size="sm" onClick={onClick}>
        {buttonText}
      </Button>
    </div>
  );
}

interface VersionInfoProps {
  version: string;
  buildNumber?: string;
  className?: string;
}

export function VersionInfo({ version, buildNumber, className }: VersionInfoProps) {
  return (
    <div className={cn('px-6 py-8 text-center border-t border-safepal-dark-100', className)}>
      <p className="text-sm text-safepal-dark-500">Version {version}</p>
      {buildNumber && <p className="text-xs text-safepal-dark-400 mt-1">Build {buildNumber}</p>}
      <p className="text-xs text-safepal-dark-400 mt-2">SafePal Demo Wallet</p>
    </div>
  );
}

interface WalletSelectorProps {
  wallets: Array<{ id: string; name: string; address: string; isActive: boolean }>;
  activeWalletId: string;
  onSelect: (walletId: string) => void;
  onAddWallet: () => void;
  className?: string;
}

export function WalletSelector({ wallets, onSelect, onAddWallet, className }: WalletSelectorProps) {
  return (
    <div className={cn('space-y-2', className)}>
      {wallets.map((wallet) => (
        <button
          key={wallet.id}
          onClick={() => onSelect(wallet.id)}
          className={cn(
            'w-full safe-card p-4 flex items-center justify-between',
            wallet.isActive ? 'border-safepal-blue-300 bg-safepal-blue-50' : 'hover:safe-card-elevated'
          )}
        >
          <div className="flex items-center gap-3">
            <div className={cn(
              'w-10 h-10 rounded-xl flex items-center justify-center text-white font-medium flex-shrink-0',
              wallet.isActive ? 'bg-safepal-blue-600' : 'bg-safepal-dark-300'
            )}>
              {wallet.name.charAt(0).toUpperCase()}
            </div>
            <div>
              <p className="font-medium text-safepal-dark-900">{wallet.name}</p>
              <p className="text-sm text-safepal-dark-500 font-mono">{wallet.address}</p>
            </div>
          </div>
          {wallet.isActive && (
            <svg className="w-5 h-5 text-safepal-blue-600" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
            </svg>
          )}
        </button>
      ))}
      <button
        onClick={onAddWallet}
        className="w-full safe-btn-outline justify-center"
      >
        <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
        </svg>
        Add Wallet
      </button>
    </div>
  );
}