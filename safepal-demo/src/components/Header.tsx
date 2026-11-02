import { cn } from '../utils/helpers';

interface HeaderProps extends React.HTMLAttributes<HTMLHeadElement> {
  title?: string;
  showBack?: boolean;
  onBack?: () => void;
  actions?: React.ReactNode;
}

export function Header({ title, showBack = false, onBack, actions, className, children, ...props }: HeaderProps) {
  return (
    <header className={cn('safe-header safe-area-top', className)} {...props}>
      <div className="safe-container flex items-center justify-between h-16">
        <div className="flex items-center gap-3">
          {showBack && (
            <button
              onClick={onBack}
              className="p-2 rounded-xl text-safepal-dark-300 hover:bg-safepal-dark-700 active:bg-safepal-dark-600 transition-colors"
              aria-label="Go back"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
          )}
          {title && (
            <h1 className="text-xl font-semibold text-safepal-dark-50">{title}</h1>
          )}
        </div>
        <div className="flex items-center gap-2">
          {actions}
          {children}
        </div>
      </div>
    </header>
  );
}

interface HeaderActionProps extends React.HTMLAttributes<HTMLButtonElement> {
  icon: React.ReactNode;
  label: string;
  variant?: 'ghost' | 'primary';
}

export function HeaderAction({ icon, label, variant = 'ghost', className, onClick, ...props }: HeaderActionProps) {
  return (
    <button
      onClick={onClick}
      className={cn(
        'p-2 rounded-xl text-safepal-dark-300 hover:bg-safepal-dark-700 active:bg-safepal-dark-600 transition-colors',
        variant === 'primary' && 'bg-safepal-dark-600 text-white hover:bg-safepal-dark-700',
        className
      )}
      aria-label={label}
      {...props}
    >
      <span className="w-5 h-5" aria-hidden="true">{icon}</span>
    </button>
  );
}

interface SearchBarProps {
  placeholder?: string;
  value: string;
  onChange: (value: string) => void;
  onFocus?: () => void;
  className?: string;
}

export function SearchBar({ placeholder = 'Search tokens...', value, onChange, onFocus, className }: SearchBarProps) {
  return (
    <div className={cn('flex-1 max-w-md', className)}>
      <div className="relative">
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
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onFocus={onFocus}
          placeholder={placeholder}
          className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-safepal-dark-800 text-safepal-dark-50 placeholder-safepal-dark-400 text-sm focus:outline-none focus:ring-2 focus:ring-safepal-dark-500 focus:bg-safepal-dark-800"
          aria-label={placeholder}
        />
      </div>
    </div>
  );
}