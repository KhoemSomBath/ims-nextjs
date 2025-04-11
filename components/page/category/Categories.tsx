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
import type {Category} from "@/types/Category";
import useDateFormat from "@/hooks/useDateFormat";
import useLocalNumeric from "@/hooks/useLocalNumeric";
import {useTranslations} from "next-intl";

interface RolesPageProps {
    query: string,
    data: ApiResponse<Category[]>,
    handleDelete?: (id: string | number) => Promise<ApiResponse<void>>,
}

export default function Categories({data, handleDelete, query}: RolesPageProps) {

    const {confirm, ConfirmModal} = useConfirmModal();
    const router = useRouter();
    const t = useTranslations('Common');
    const categoryT = useTranslations('Categories');
    const {fullDateTime} = useDateFormat();
    const {toLocalNumeric} = useLocalNumeric();

    const userActions: ReactTableAction<Category>[] = [
        {
            name: 'Edit',
            icon: <Pencil className="h-4 w-4"/>,
            onClick: (item) => {
                router.push(`/categories/edit/${item.id}`);
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
                        title: t('confirm_deletion'),
                        description: categoryT('delete_description'),
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

    const getUserColumns = (actions?: ReactTableAction<Category>[]): ColumnDef<Category>[] => [
        {
            accessorKey: 'id',
            header: t('no'),
            cell: ({row}) => toLocalNumeric(row.index + 1)
        },
        {
            accessorKey: 'name',
            header: categoryT('columns.name'),
            cell: ({row}) => row.original.name
        },
        {
            accessorKey: 'description',
            header: categoryT('columns.description'),
            cell: ({row}) => row.original.description
        },
        {
            accessorKey: 'createdAt',
            header: t('createdAt'),
            cell: ({row}) => fullDateTime(row.original.createdAt),
        },
        {
            accessorKey: 'updatedAt',
            header: t('updatedAt'),
            cell: ({row}) => fullDateTime(row.original.updatedAt),
        },
        ...(actions ? [{
            id: 'actions',
            header: t('action'),
            cell: ({row}: { row: { original: Category } }) => (
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
                addNewLink={'categories/new'}
                columns={getUserColumns(userActions)}
            />
            <ConfirmModal/>
        </div>

    );
}