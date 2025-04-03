import { HTMLAttributes } from 'react';

interface LoadingProps extends HTMLAttributes<HTMLDivElement> {
    size?: 'sm' | 'md' | 'lg' | 'xl';
    variant?: 'brand' | 'blue-light' | 'gray' | 'success' | 'error' | 'warning';
    fullScreen?: boolean;
    withText?: boolean;
    text?: string;
}

export function Loading({
                            size = 'md',
                            variant = 'brand',
                            fullScreen = false,
                            withText = true,
                            text = 'Loading...',
                            className = '',
                            ...props
                        }: LoadingProps) {
    // Size mappings
    const sizeClasses = {
        sm: 'h-4 w-4 border-2',
        md: 'h-6 w-6 border-3',
        lg: 'h-8 w-8 border-4',
        xl: 'h-12 w-12 border-[5px]',
    };

    // Variant color mappings
    const variantClasses = {
        brand: 'border-brand-100 border-t-brand-500 dark:border-brand-800 dark:border-t-brand-400',
        'blue-light': 'border-blue-light-100 border-t-blue-light-500 dark:border-blue-light-800 dark:border-t-blue-light-400',
        gray: 'border-gray-200 border-t-gray-600 dark:border-gray-600 dark:border-t-gray-300',
        success: 'border-success-100 border-t-success-500 dark:border-success-800 dark:border-t-success-400',
        error: 'border-error-100 border-t-error-500 dark:border-error-800 dark:border-t-error-400',
        warning: 'border-warning-100 border-t-warning-500 dark:border-warning-800 dark:border-t-warning-400',
    };

    // Text size mappings
    const textSizeClasses = {
        sm: 'text-theme-xs',
        md: 'text-theme-sm',
        lg: 'text-theme-sm',
        xl: 'text-theme-xl',
    };

    return (
        <div
            className={`flex flex-col items-center justify-center gap-3 ${
                fullScreen ? 'min-h-screen' : ''
            } ${className}`}
            {...props}
        >
            <div
                className={`animate-spin rounded-full ${sizeClasses[size]} ${variantClasses[variant]}`}
            />
            {withText && (
                <p className={`${textSizeClasses[size]} text-gray-600 dark:text-gray-300`}>
                    {text}
                </p>
            )}
        </div>
    );
}