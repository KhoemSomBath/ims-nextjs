import {getWithAuth, postWithAuth} from "@/lib/api-client";
import {revalidateTag} from "next/cache";
import RoleForm from "@/components/page/role/RoleForm";
import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import React from "react";
import type {ApiResponse} from "@/types/BaseRespond";
import type {Permission, Role} from "@/types/Role";

export default async function CreateRolesPage() {

    const permissions = await getWithAuth<ApiResponse<Permission[]>>(`/role/permissions`, {tags: ['permissions']});

    // Server action for create/update
    const saveRole = async (data: {
        name: string;
        permissionIds: number[]
    }): Promise<ApiResponse<Role>> => {
        'use server';

        const body: { name: string; version: number; permissions: { id: number }[] } = {
            name: data.name,
            version: 0,
            permissions: data.permissionIds.map((id) => {
                return {
                    id: id,
                }
            }),
        }

        const respond = await postWithAuth<ApiResponse<Role>, {
            name: string;
            version: number;
            permissions: { id: number }[]
        }>('/role', body);
        revalidateTag('role')
        return respond;
    };

    return (
        <div>
            <PageBreadcrumb pageTitle="Create Roles" />
            <div className="w-full rounded-2xl border border-gray-200 bg-white px-5 py-7 dark:border-gray-800 dark:bg-white/[0.03] xl:px-10 xl:py-12">

                <RoleForm
                    role={undefined}
                    allPermissions={permissions.data}
                    onSubmitAction={saveRole}
                />
            </div>
        </div>

    );
}