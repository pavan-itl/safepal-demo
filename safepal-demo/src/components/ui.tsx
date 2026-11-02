import { cn } from '../utils/helpers';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger' | 'outline';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
  children: React.ReactNode;
}

export function Button({
  variant = 'primary',
  size = 'md',
  isLoading = false,
  className,
  disabled,
  children,
  ...props
}: ButtonProps) {
  const baseClasses = 'safe-btn';
  const variantClasses = {
    primary: 'safe-btn-primary',
    secondary: 'safe-btn-secondary',
    ghost: 'safe-btn-ghost',
    danger: 'safe-btn-danger',
    outline: 'safe-btn-outline',
  };
  const sizeClasses = {
    sm: 'px-3 py-2 text-sm',
    md: 'px-4 py-3 text-sm',
    lg: 'px-6 py-4 text-base',
  };

  return (
    <button
      className={cn(baseClasses, variantClasses[variant], sizeClasses[size], className)}
      disabled={disabled || isLoading}
      {...props}
    >
      {isLoading && (
        <svg className="animate-spin -ml-1 mr-2 h-4 w-4" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
        </svg>
      )}
      {children}
    </button>
  );
}

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
}

export function Input({ label, error, helperText, className, id, ...props }: InputProps) {
  const inputId = id || label?.toLowerCase().replace(/\s+/g, '-');

  return (
    <div className="w-full">
      {label && (
        <label htmlFor={inputId} className="safe-label">
          {label}
        </label>
      )}
      <input
        id={inputId}
        className={cn('safe-input', error && 'safe-input-error', className)}
        aria-invalid={error ? 'true' : 'false'}
        aria-describedby={error ? `${inputId}-error` : helperText ? `${inputId}-helper` : undefined}
        {...props}
      />
      {error && (
        <p id={`${inputId}-error`} className="mt-1.5 text-sm text-safepal-dark-400" role="alert">
          {error}
        </p>
      )}
      {helperText && !error && (
        <p id={`${inputId}-helper`} className="mt-1.5 text-sm text-safepal-dark-400">
          {helperText}
        </p>
      )}
    </div>
  );
}

interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: 'blue' | 'green' | 'gray' | 'red';
  children: React.ReactNode;
}

export function Badge({ variant = 'blue', className, children, ...props }: BadgeProps) {
  const variantClasses = {
    blue: 'safe-badge-blue',
    green: 'safe-badge-green',
    gray: 'safe-badge-gray',
    red: 'safe-badge-red',
  };

  return (
    <span className={cn('safe-badge', variantClasses[variant], className)} {...props}>
      {children}
    </span>
  );
}

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  elevated?: boolean;
  children: React.ReactNode;
}

export function Card({ elevated = false, className, children, ...props }: CardProps) {
  return (
    <div
      className={cn(
        elevated ? 'safe-card-elevated' : 'safe-card',
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}

export function CardHeader({ className, children, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={cn('px-6 py-4 border-b border-safepal-dark-700', className)} {...props}>
      {children}
    </div>
  );
}

export function CardContent({ className, children, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={cn('p-6', className)} {...props}>
      {children}
    </div>
  );
}

export function CardFooter({ className, children, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={cn('px-6 py-4 border-t border-safepal-dark-700 bg-transparent', className)} {...props}>
      {children}
    </div>
  );
}

interface AvatarProps extends React.HTMLAttributes<HTMLDivElement> {
  src?: string;
  alt?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  fallback?: string;
}

export function Avatar({ src, alt, size = 'md', fallback, className, ...props }: AvatarProps) {
  const sizeClasses = {
    sm: 'w-8 h-8 text-xs',
    md: 'w-10 h-10 text-sm',
    lg: 'w-12 h-12 text-base',
    xl: 'w-16 h-16 text-lg',
  };

  return (
    <div
      className={cn(
        'inline-flex items-center justify-center rounded-full bg-safepal-dark-800 text-safepal-dark-300 font-medium overflow-hidden',
        sizeClasses[size],
        className
      )}
      {...props}
    >
      {src ? (
        <img src={src} alt={alt || ''} className="w-full h-full object-cover" />
      ) : (
        fallback || alt?.charAt(0).toUpperCase() || '?'
      )}
    </div>
  );
}

interface SeparatorProps extends React.HTMLAttributes<HTMLDivElement> {
  orientation?: 'horizontal' | 'vertical';
}

export function Separator({ orientation = 'horizontal', className, ...props }: SeparatorProps) {
  return (
    <div
      className={cn(
        'bg-safepal-dark-700',
        orientation === 'horizontal' ? 'w-full h-px' : 'h-full w-px',
        className
      )}
      role="separator"
      {...props}
    />
  );
}

interface TabsProps {
  tabs: Array<{ id: string; label: string; icon?: React.ReactNode }>;
  activeTab: string;
  onChange: (tabId: string) => void;
  variant?: 'default' | 'bottom-nav';
  className?: string;
}

export function Tabs({ tabs, activeTab, onChange, variant = 'default', className }: TabsProps) {
  if (variant === 'bottom-nav') {
    return (
      <div
        className={cn('safe-bottom-nav flex items-center justify-around pb-safe-area-bottom', className)}
        role="tablist"
        aria-label="Main navigation"
      >
        {tabs.map((tab) => (
          <button
            key={tab.id}
            role="tab"
            aria-selected={activeTab === tab.id}
            aria-controls={`${tab.id}-panel`}
            id={`${tab.id}-tab`}
            onClick={() => onChange(tab.id)}
            className={cn(
              'safe-tab',
              activeTab === tab.id && 'safe-tab-active'
            )}
          >
            <span className="safe-tab-icon" aria-hidden="true">{tab.icon}</span>
            <span className="safe-tab-label">{tab.label}</span>
          </button>
        ))}
      </div>
    );
  }

  return (
    <div
      className={cn('flex border-b border-safepal-dark-700', className)}
      role="tablist"
      aria-label="Tabs"
    >
      {tabs.map((tab) => (
        <button
          key={tab.id}
          role="tab"
          aria-selected={activeTab === tab.id}
          aria-controls={`${tab.id}-panel`}
          id={`${tab.id}-tab`}
          onClick={() => onChange(tab.id)}
          className={cn(
            'safe-tab',
            activeTab === tab.id && 'safe-tab-active'
          )}
        >
          {tab.icon && <span className="safe-tab-icon" aria-hidden="true">{tab.icon}</span>}
          <span className="safe-tab-label">{tab.label}</span>
        </button>
      ))}
    </div>
  );
}

interface TabPanelProps extends React.HTMLAttributes<HTMLDivElement> {
  id: string;
  tabId: string;
  activeTab: string;
}

export function TabPanel({ id, tabId, activeTab, children, ...props }: TabPanelProps) {
  if (activeTab !== tabId) return null;

  return (
    <div
      id={`${tabId}-panel`}
      role="tabpanel"
      aria-labelledby={`${tabId}-tab`}
      {...props}
    >
      {children}
    </div>
  );
}