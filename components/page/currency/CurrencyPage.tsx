'use client'

import React from "react";
import type {ApiResponse} from "@/types/BaseRespond";
import {BaseDataTable} from "@/components/tables/BaseDataTable";
import {ReactTableAction} from "@/types/table";
import {Pencil, Trash2} from "lucide-react";
import {ColumnDef} from "@tanstack/react-table";
import {IconButton} from "@/components/ui/button/IconButton";
import {cn, DateFormats} from "@/lib/utils";
import {useConfirmModal} from "@/hooks/useConfirmModal";
import {useRouter} from "next/navigation";
import type {Currency} from "@/types/Currency";

interface RolesPageProps {
    query: string,
    data: ApiResponse<Currency[]>,
    handleDelete?: (id: string | number) => Promise<ApiResponse<void>>,
}

export default function CurrencyPage({data, handleDelete, query}: RolesPageProps) {

    const {confirm, ConfirmModal} = useConfirmModal();
    const router = useRouter();

    const actions: ReactTableAction<Currency>[] = [
        {
            name: 'Edit',
            icon: <Pencil className="h-4 w-4"/>,
            onClick: (item) => {
                router.push(`/currency/edit/${item.id}`);
            },
            variant: 'outline'
        },
        {
            name: 'Delete',
            icon: <Trash2 className="h-4 w-4"/>,
            onClick: (item) => {
                confirm(
                    async () => {
                        if (handleDelete) {
                            await handleDelete(item.id);
                        }
                    },
                    {
                        title: 'Confirm Deletion',
                        description: `Are you sure you want to delete this ${item.name} currency?`,
                        confirmText: 'Delete',
                        cancelText: 'Cancel',
                        isDestructive: true
                    }
                );
            },
            variant: 'destructive',
            className: 'hover:bg-red-50 dark:hover:bg-red-900/30'
        }
    ];

    const getColumns = (actions?: ReactTableAction<Currency>[]): ColumnDef<Currency>[] => [
        {
            accessorKey: 'id',
            header: 'No',
            cell: ({row}) => <span className="font-mono">#{row.original.id}</span>
        },
        {
            accessorKey: 'name',
            header: 'Name',
            cell: ({row}) => row.original.name
        },
        {
            accessorKey: 'code',
            header: 'Code',
            cell: ({row}) => row.original.code
        },
        {
            accessorKey: 'rate',
            header: 'Rate',
            cell: ({row}) => row.original.rate
        },
        {
            accessorKey: 'createdAt',
            header: 'Created At',
            cell: ({row}) => DateFormats.en(row.original.createdAt),
        },
        {
            accessorKey: 'updatedAt',
            header: 'Updated At',
            cell: ({row}) => DateFormats.en(row.original.createdAt),
        },
        ...(actions ? [{
            id: 'actions',
            header: 'Actions',
            cell: ({row}: { row: { original: Currency } }) => (
                <div className="flex space-x-1">
                    {actions.map((action) => (
                        <IconButton
                            key={action.name}
                            variant={action.variant || 'ghost'}
                            size="sm"
                            icon={action.icon}
                            onClick={(e) => {
                                e.stopPropagation();
                                action.onClick(row.original);
                            }}
                            aria-label={action.name}
                            className={cn(
                                action.className,
                                'hover:bg-gray-100 dark:hover:bg-gray-800'
                            )}
                        />
                    ))}
                </div>
            ),
            size: 50, // Fixed width for actions column
            enableSorting: false
        }] : [])
    ];

    return (
        <div
            className="w-full rounded-2xl border border-gray-200 bg-white px-5 py-7 dark:border-gray-800 dark:bg-white/[0.03] xl:px-10 xl:py-12">
            <BaseDataTable
                pageData={data}
                query={query}
                addNewLink={'currency/new'}
                columns={getColumns(actions)}
                isPagination={false}
            />
            <ConfirmModal/>
        </div>

    );
}