'use client'

import type {Role} from "@/types/Role";
import React from "react";
import type {ApiResponse} from "@/types/BaseRespond";
import {ReactTableAction} from "@/types/table";
import {useConfirmModal} from "@/hooks/useConfirmModal";
import {useRouter} from "next/navigation";
import {Pencil, Trash2} from "lucide-react";
import {ColumnDef} from "@tanstack/react-table";
import {cn, DateFormats} from "@/lib/utils";
import {IconButton} from "@/components/ui/button/IconButton";
import {BaseDataTable} from "@/components/tables/BaseDataTable";

interface RolesPageProps {
    query: string,
    data: ApiResponse<Role[]>,
    handleDelete?: (id: string | number) => Promise<ApiResponse<void>>,
    addNewLink?: string,
}

export default function Roles({data, query, handleDelete}: RolesPageProps) {


    const {confirm, ConfirmModal} = useConfirmModal();
    const router = useRouter();

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
                        title: 'Confirm Deletion',
                        description: `Are you sure you want to delete this ${role.name} role?`,
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

    const getRoleColumns = (actions?: ReactTableAction<Role>[]): ColumnDef<Role>[] => [
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