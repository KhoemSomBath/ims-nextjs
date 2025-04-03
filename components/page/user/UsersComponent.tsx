'use client'

import {TableWrapper} from "@/components/tables/TableWrapper";
import React, {useMemo} from "react";
import type {ApiResponse} from "@/types/BaseRespond";
import type {TableColumn} from "@/types/table";
import type {User} from "@/types/User";

interface RolesPageProps {
    query: string,
    data: ApiResponse<User[]>,
    handleDelete?: (id: string | number) => Promise<ApiResponse<void>>,
    addNewLink?: string
}

export default function Users({data, handleDelete, addNewLink}: RolesPageProps) {

    const columns: TableColumn<User>[] = useMemo(() => [
        {
            key: "id",
            header: "No",
            render: (_, index) => index + 1
        },
        {
            key: "name",
            header: "Name",
        },
        {
            key: "createdAt",
            header: "Created At",
            render: (row) => new Date(row.createdAt).toLocaleString() //formatToKhmerDate(row.createdAt),
        },
        {
            key: "updatedAt",
            header: "Updated At",
            render: (row) => new Date(row.updatedAt).toLocaleString() //formatToKhmerDate(row.updatedAt),
        }
    ], []);

    return (
        <div
            className="w-full rounded-2xl border border-gray-200 bg-white px-5 py-7 dark:border-gray-800 dark:bg-white/[0.03] xl:px-10 xl:py-12">
            <TableWrapper<User>
                pageData={data}
                type={'User'}
                addNewLink={addNewLink}
                handleDeleteApi={handleDelete}
                columns={columns}
                actionBasePath="/users"
            />
        </div>
    );
}