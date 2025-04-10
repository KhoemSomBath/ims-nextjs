'use client'

import React from "react";
import type {ApiResponse} from "@/types/BaseRespond";
import {BaseDataTable} from "@/components/tables/BaseDataTable";
import {ReactTableAction} from "@/types/table";
import {Pencil, Trash2} from "lucide-react";
import {ColumnDef} from "@tanstack/react-table";
import {IconButton} from "@/components/ui/button/IconButton";
import {cn} from "@/lib/utils";
import {useConfirmModal} from "@/hooks/useConfirmModal";
import {useRouter} from "next/navigation";
import type {Currency} from "@/types/Currency";
import {useTranslations} from "use-intl";
import useDateFormat from "@/hooks/useDateFormat";
import useLocalNumeric from "@/hooks/useLocalNumeric";

interface RolesPageProps {
    query: string,
    data: ApiResponse<Currency[]>,
    handleDelete?: (id: string | number) => Promise<ApiResponse<void>>,
}

export default function CurrencyPage({data, handleDelete, query}: RolesPageProps) {

    const {confirm, ConfirmModal} = useConfirmModal();
    const router = useRouter();
    const commonT = useTranslations('Common');
    const t = useTranslations('Currencies');
    const {fullDateTime} = useDateFormat();
    const { toLocalNumeric } = useLocalNumeric();

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
                        title: t("confirm_delete"),
                        description: t('delete_description'),
                        confirmText: commonT('delete'),
                        cancelText: commonT('cancel'),
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
            header: commonT('no'),
            cell: ({row}) => toLocalNumeric(row.index + 1)
        },
        {
            accessorKey: 'name',
            header: t('columns.name'),
            cell: ({row}) => row.original.name
        },
        {
            accessorKey: 'code',
            header: t('columns.symbol'),
            cell: ({row}) => row.original.code
        },
        {
            accessorKey: 'rate',
            header: t('columns.rate'),
            cell: ({row}) => toLocalNumeric(row.original.rate)
        },
        {
            accessorKey: 'createdAt',
            header: commonT('createdAt'),
            cell: ({row}) => fullDateTime(row.original.createdAt),
        },
        {
            accessorKey: 'updatedAt',
            header: commonT('updatedAt'),
            cell: ({row}) => fullDateTime(row.original.createdAt),
        },
        ...(actions ? [{
            id: 'actions',
            header: commonT('action'),
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