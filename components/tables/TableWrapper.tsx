// components/TableClientWrapper.tsx
'use client';

import {useRouter} from 'next/navigation';
import {BaseTable, type TableProps} from "@/components/tables/BaseTable";
import {Pencil, Trash2} from 'lucide-react';
import {useConfirmModal} from "@/hooks/useConfirmModal";
import React from "react";
import type {ApiResponse} from "@/types/BaseRespond";

type Identifiable = {
    id: string | number;
};

interface TableWrapperProps<T extends Identifiable> extends TableProps<T> {
    actionBasePath?: string,
    type?: string,
    customActions?: Array<{
        name: string;
        icon: React.ReactNode;
        onClick: (row: T) => void;
        className?: string;
    }>,
    disableDefaultActions?: boolean,
    handleDeleteApi?: ((id: string | number) => Promise<ApiResponse<void>>) | undefined
}

export function TableWrapper<T extends Identifiable>({
                                                         actionBasePath = '',
                                                         type = '',
                                                         customActions = [],
                                                         disableDefaultActions = false,
                                                         handleDeleteApi,
                                                         ...props
                                                     }: TableWrapperProps<T>) {

    const router = useRouter();

    const {confirm, ConfirmModal} = useConfirmModal();

    const handleAction = (action: string, id: string | number) => {
        router.push(`${actionBasePath}/${action}/${id}`);
    };

    const handleDelete = (row: T) => {
        confirm(
            async () => {
                if (handleDeleteApi) {
                    await handleDeleteApi(row.id);
                }
            },
            {
                title: 'Confirm Deletion',
                description: `Are you sure you want to delete this ${type ? type : 'item'}?`,
                confirmText: 'Delete',
                cancelText: 'Cancel',
                isDestructive: true
            }
        );
    };

    // Action button configuration using your design system colors
    const defaultActions = disableDefaultActions ? [] : [
        {
            name: 'edit',
            icon: <Pencil className="w-5 h-5 text-warning-500"/>,
            onClick: (row: T) => handleAction('edit', row.id),
            className: 'p-2 rounded-md hover:bg-warning-100 dark:hover:bg-warning-900/30',
            ariaLabel: 'Edit item'
        },
        {
            name: 'delete',
            icon: <Trash2 className="w-5 h-5 text-error-500"/>,
            onClick: (row: T) => handleDelete(row),
            className: 'p-2 rounded-md hover:bg-error-100 dark:hover:bg-error-900/30',
            ariaLabel: 'Delete item'
        },
    ];

    return (
        <>

            <BaseTable
                {...props}
                actions={[...defaultActions, ...customActions]}
            />

            <ConfirmModal/>
        </>
    );
}