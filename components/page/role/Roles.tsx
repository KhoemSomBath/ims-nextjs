'use client'

import type {Role} from "@/types/Role";
import React from "react";
import type {ApiResponse} from "@/types/BaseRespond";
import {ReactTableAction} from "@/types/table";
import {useConfirmModal} from "@/hooks/useConfirmModal";
import {useRouter} from "next/navigation";
import {Pencil, Trash2} from "lucide-react";
import {ColumnDef} from "@tanstack/react-table";
import {cn} from "@/lib/utils";
import {IconButton} from "@/components/ui/button/IconButton";
import {BaseDataTable} from "@/components/tables/BaseDataTable";
import {useTranslations} from "use-intl";
import useDateFormat from "@/hooks/useDateFormat";
import useLocalNumeric from "@/hooks/useLocalNumeric";

interface RolesPageProps {
    query: string,
    data: ApiResponse<Role[]>,
    handleDelete?: (id: string | number) => Promise<ApiResponse<void>>,
    addNewLink?: string,
}

export default function Roles({data, query, handleDelete}: RolesPageProps) {


    const {confirm, ConfirmModal} = useConfirmModal();
    const router = useRouter();
    const commonT = useTranslations('Common');
    const t = useTranslations('Roles');
    const {fullDateTime} = useDateFormat();
    const {toLocalNumeric} = useLocalNumeric();

    const userActions: ReactTableAction<Role>[] = [
        {
            name: 'Edit',
            icon: <Pencil className="h-4 w-4"/>,
            onClick: (role) => {
                router.push(`/roles/edit/${role.id}`);
            },
            variant: 'outline'
        },
        {
            name: 'Delete',
            icon: <Trash2 className="h-4 w-4"/>,
            onClick: (role) => {
                confirm(
                    async () => {
                        if (handleDelete) {
                            await handleDelete(role.id);
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

    const getRoleColumns = (actions?: ReactTableAction<Role>[]): ColumnDef<Role>[] => [
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
            accessorKey: 'createdAt',
            header: commonT('createdAt'),
            cell: ({row}) => fullDateTime(row.original.createdAt),
        },
        {
            accessorKey: 'updatedAt',
            header: commonT('updatedAt'),
            cell: ({row}) => fullDateTime(row.original.updatedAt),
        },
        ...(actions ? [{
            id: 'actions',
            header: commonT('action'),
            cell: ({row}: { row: { original: Role } }) => (
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
                addNewLink={'roles/new'}
                columns={getRoleColumns(userActions)}
            />
            <ConfirmModal/>
        </div>

    );
}