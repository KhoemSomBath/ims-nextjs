'use client'

import {TableWrapper} from "@/components/tables/TableWrapper";
import type {Role} from "@/types/Role";
import React from "react";
import type {ApiResponse} from "@/types/BaseRespond";
import type {TableColumn} from "@/types/table";

interface RolesPageProps {
    query: string,
    data: ApiResponse<Role[]>,
    handleDelete?: (id: string | number) => Promise<ApiResponse<void>>,
    addNewLink?: string,
}

export default function Roles({data, query, handleDelete, addNewLink}: RolesPageProps) {

    const roleColumns: TableColumn<Role>[] = [
        {
            key: "id",
            header: "ID",
            render: (_, index) => index + 1
        },
        {
            key: "name",
            header: "Name",
        },
        {
            key: "createdAt",
            header: "Created At",
        },
        {
            key: "updatedAt",
            header: "Updated At",
        }
    ]

    return (
        <div
            className="w-full rounded-2xl border border-gray-200 bg-white px-5 py-7 dark:border-gray-800 dark:bg-white/[0.03] xl:px-10 xl:py-12">
            <TableWrapper<Role>
                pageData={data}
                addNewLink={addNewLink}
                handleDeleteApi={handleDelete}
                query={query}
                columns={roleColumns}
                actionBasePath="/roles"
            />
        </div>
    );
}