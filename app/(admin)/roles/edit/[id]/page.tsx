// app/roles/[id]/page.tsx
import {getWithAuth, putWithAuth} from "@/lib/api-client";
import {revalidateTag} from "next/cache";
import RoleForm from "@/components/page/role/RoleForm";
import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import React from "react";
import type {Permission, Role} from "@/types/Role";
import {type ApiResponse, initApiResponse} from "@/types/BaseRespond";

type RolePageProps = Promise<{ id: string }>


export default async function EditRolePage(props: { params: RolePageProps }) {
    const params = await props.params;
    const isEdit = !!params.id;
    let role: Role | null = null;

    if (isEdit) {
        const data = await getWithAuth<ApiResponse<Role>>(`/role/${params.id}`, {tags: ['role']});
        role = data.data;
    }

    const permissions = await getWithAuth<ApiResponse<Permission[]>>(`/role/permissions`, {tags: ['permissions']});


    // Server action for create/update
    const saveRole = async (data: {
        name: string;
        permissionIds: number[]
    }): Promise<ApiResponse<Role | null>> => {
        'use server';

        if (role) {
            role.name = data.name;
            role.permissions = data.permissionIds.map((id) => {
                return {
                    id: id,
                    name: '',
                    module: '',
                }
            });

            const respond = await putWithAuth<ApiResponse<Role>, Role>(`/role/${params.id}`, role);
            revalidateTag('role');
            return respond;
        }

        return initApiResponse<Role>(null, 'Role not found');
    };

    return (
        <div>
            <PageBreadcrumb
                items={[
                    { title: "Home", href: "/" },
                    { title: "Roles", href: "/roles" },
                    { title: "Edit Role" },
                ]}
            />
            <div
                className="w-full rounded-2xl border border-gray-200 bg-white px-5 py-7 dark:border-gray-800 dark:bg-white/[0.03] xl:px-10 xl:py-12">
                <RoleForm
                    role={role || undefined}
                    allPermissions={permissions.data}
                    onSubmitAction={saveRole}
                />
            </div>
        </div>

    );
}