'use client'

import React from "react";
import type {ApiResponse} from "@/types/BaseRespond";
import type {User} from "@/types/User";
import {BaseDataTable} from "@/components/tables/BaseDataTable";
import {ReactTableAction} from "@/types/table";
import {Pencil, Trash2} from "lucide-react";
import {ColumnDef} from "@tanstack/react-table";
import {IconButton} from "@/components/ui/button/IconButton";
import {cn, DateFormats} from "@/lib/utils";
import {useConfirmModal} from "@/hooks/useConfirmModal";
import {useRouter} from "next/navigation";

interface RolesPageProps {
    query: string,
    data: ApiResponse<User[]>,
    handleDelete?: (id: string | number) => Promise<ApiResponse<void>>,
}

export default function Users({data, handleDelete, query}: RolesPageProps) {

    const {confirm, ConfirmModal} = useConfirmModal();
    const router = useRouter();

    const userActions: ReactTableAction<User>[] = [
        {
            name: 'Edit',
            icon: <Pencil className="h-4 w-4"/>,
            onClick: (user) => {
                router.push(`/users/edit/${user.id}`);
            },
            variant: 'outline'
        },
        {
            name: 'Delete',
            icon: <Trash2 className="h-4 w-4"/>,
            onClick: (user) => {
                confirm(
                    async () => {
                        if (handleDelete) {
                            await handleDelete(user.id);
                        }
                    },
                    {
                        title: 'Confirm Deletion',
                        description: `Are you sure you want to delete this ${user.name} user?`,
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

    const getUserColumns = (actions?: ReactTableAction<User>[]): ColumnDef<User>[] => [
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
            accessorKey: 'role',
            header: 'Role',
            cell: ({row}) => (
                <span
                    className="inline-flex items-center rounded-full bg-brand-50 px-2.5 py-0.5 text-xs font-medium text-brand-700 dark:bg-brand-400/10 dark:text-brand-400">
        {row.original.role.name}
      </span>
            )
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
            cell: ({row}: { row: { original: User } }) => (
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
                addNewLink={'users/new'}
                columns={getUserColumns(userActions)}
            />
            <ConfirmModal/>
        </div>

    );
}