// src/hooks/useConfirmModal.ts
'use client';

import { useState } from 'react';
import { Modal } from '@/components/ui/modal';
import Button from '@/components/ui/button/Button';

interface ConfirmModalOptions {
    title?: string;
    description: string;
    confirmText?: string;
    cancelText?: string;
    variant?: 'primary' | 'outline';
    isDestructive?: boolean;
}

export function useConfirmModal() {

    const [isOpen, setIsOpen] = useState(false);
    const [options, setOptions] = useState<ConfirmModalOptions>({
        title: 'Confirm Action',
        description: 'Are you sure you want to perform this action?',
        confirmText: 'Confirm',
        cancelText: 'Cancel',
        variant: 'primary',
        isDestructive: false
    });
    const [onConfirm, setOnConfirm] = useState<() => Promise<void> | void>(() => {});

    const confirm = (
        action: () => Promise<void> | void,
        modalOptions?: Partial<ConfirmModalOptions>
    ) => {
        setOptions(prev => ({
            ...prev,
            ...modalOptions,
            variant: modalOptions?.isDestructive ? 'primary' : prev.variant
        }));
        setOnConfirm(() => action);
        setIsOpen(true);
    };

    const handleConfirm = async () => {
        try {
            await onConfirm();
        } finally {
            setIsOpen(false);
        }
    };

    const ConfirmModal = () => (
        <Modal
            isOpen={isOpen}
            onClose={() => setIsOpen(false)}
            className={`max-w-[600px] p-6 ${options.isDestructive ? 'border-l-4 border-error-500' : ''}`}
        >
            {options.title && (
                <h4 className="font-semibold text-gray-800 mb-4 text-title-sm dark:text-white/90">
                    {options.title}
                </h4>
            )}
            <p className="text-sm leading-6 text-gray-500 dark:text-gray-400">
                {options.description}
            </p>
            <div className="flex items-center justify-end w-full gap-3 mt-8">
                <Button
                    size="sm"
                    variant="outline"
                    onClick={() => setIsOpen(false)}
                >
                    {options.cancelText}
                </Button>
                <Button
                    size="sm"
                    variant={options.variant}
                    className={options.isDestructive ? 'bg-error-500 hover:bg-error-600' : ''}
                    onClick={handleConfirm}
                >
                    {options.confirmText}
                </Button>
            </div>
        </Modal>
    );

    return {
        confirm,
        ConfirmModal,
        isOpen,
        setIsOpen
    };
}