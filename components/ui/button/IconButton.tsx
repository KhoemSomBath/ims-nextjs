// components/ui/IconButton.tsx
'use client';

import { cn } from '@/lib/utils';
import { ComponentPropsWithoutRef, forwardRef } from 'react';

interface IconButtonProps extends ComponentPropsWithoutRef<'button'> {
    variant?: 'default' | 'outline' | 'ghost' | 'destructive';
    size?: 'sm' | 'md' | 'lg';
    icon: React.ReactNode;
}

export const IconButton = forwardRef<HTMLButtonElement, IconButtonProps>(
    ({ className, variant = 'default', size = 'sm', icon, ...props }, ref) => {
        return (
            <button
                ref={ref}
                className={cn(
                    'inline-flex items-center justify-center rounded-md transition-colors',
                    'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2',
                    'disabled:pointer-events-none disabled:opacity-50',
                    // Size variants
                    {
                        'h-8 w-8 p-1.5': size === 'sm',
                        'h-9 w-9 p-2': size === 'md',
                        'h-10 w-10 p-2.5': size === 'lg',
                    },
                    // Color variants
                    {
                        // Default
                        'bg-brand-500 text-white hover:bg-brand-600 dark:bg-brand-600 dark:hover:bg-brand-700':
                            variant === 'default',
                        // Outline
                        'border border-gray-200 bg-transparent text-gray-700 hover:bg-gray-50 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-800':
                            variant === 'outline',
                        // Ghost
                        'bg-transparent text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800':
                            variant === 'ghost',
                        // Destructive
                        'bg-error-500 text-white hover:bg-error-600 dark:bg-error-600 dark:hover:bg-error-700':
                            variant === 'destructive',
                    },
                    className
                )}
                {...props}
            >
        <span className={cn('flex items-center justify-center')}>
          {icon}
        </span>
            </button>
        );
    }
);

IconButton.displayName = 'IconButton';