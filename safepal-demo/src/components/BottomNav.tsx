import { cn } from '../utils/helpers';
import { ReactNode } from 'react';

interface BottomNavItem {
  id: string;
  label: string;
  icon: ReactNode;
  badge?: number | string;
}

interface BottomNavProps {
  items: BottomNavItem[];
  activeItem: string;
  onChange: (itemId: string) => void;
  className?: string;
}

export function BottomNav({ items, activeItem, onChange, className }: BottomNavProps) {
  return (
    <nav
      className={cn('safe-bottom-nav flex items-center justify-around pb-safe-area-bottom', className)}
      role="navigation"
      aria-label="Main navigation"
    >
      {items.map((item) => (
        <button
          key={item.id}
          onClick={() => onChange(item.id)}
          className={cn(
            'safe-tab relative',
            activeItem === item.id && 'safe-tab-active'
          )}
          role="tab"
          aria-selected={activeItem === item.id}
          aria-controls={`${item.id}-panel`}
          id={`${item.id}-tab`}
        >
          <span className="safe-tab-icon flex items-center justify-center" aria-hidden="true">
            {item.icon}
            {item.badge && (
              <span
                className="absolute -top-1 -right-1 min-w-[18px] h-5 px-1.5 text-[10px] font-semibold text-white bg-safepal-green-500 rounded-full flex items-center justify-center"
                aria-label={`${item.badge} notifications`}
              >
                {item.badge > 99 ? '99+' : item.badge}
              </span>
            )}
          </span>
          <span className="safe-tab-label">{item.label}</span>
        </button>
      ))}
    </nav>
  );
}

interface FloatingActionButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  icon: ReactNode;
  label: string;
  position?: 'bottom-right' | 'bottom-center';
}

export function FloatingActionButton({ icon, label, position = 'bottom-right', className, children, ...props }: FloatingActionButtonProps) {
  return (
    <button
      className={cn(
        'fixed z-40 safe-btn-primary safe-btn-lg shadow-xl',
        'safe-area-bottom',
        position === 'bottom-right' ? 'bottom-24 right-4' : 'bottom-24 left-1/2 -translate-x-1/2',
        className
      )}
      aria-label={label}
      {...props}
    >
      <span className="w-5 h-5 mr-2" aria-hidden="true">{icon}</span>
      {children || label}
    </button>
  );
}