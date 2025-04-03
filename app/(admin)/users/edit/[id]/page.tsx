// app/roles/[id]/page.tsx
// app/roles/[id]/page.tsx
import type {Role} from "@/types/Role";
import type {ApiResponse} from "@/types/BaseRespond";
import {getWithAuth, putWithAuth} from "@/lib/api-client";
import {revalidateTag} from "next/cache";
import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import React from "react";
import type {User} from "@/types/User";
import UserForm from "@/components/page/user/UserForm";

type UserPageProps = Promise<{ id: string }>


export default async function EditUserPage(props: { params: UserPageProps }) {
    const params = await props.params;
    const isEdit = !!params.id;
    let user: User | undefined = undefined;

    const roles = await getWithAuth<ApiResponse<Role[]>>(`/role`, {tags: ['role']});

    if (isEdit) {
        const data = await getWithAuth<ApiResponse<User>>(`/user/${params.id}`, {tags: ['role']});
        user = data.data;
    }


    // Server action for create/update
    const saveUser = async (data: {
        username: string;
        name: string;
        password?: string;
        roleId: number;
        status: boolean;
    }): Promise<ApiResponse<User>> => {
        'use server';

        const body = {
            username: data.username,
            name: data.name,
            password: data.password,
            version: 0,
            role: {
                id: data.roleId,
                version: 0
            },
            status: data.status,
        }

        const respond = await putWithAuth<ApiResponse<User>, {
            username: string;
            name: string;
            password: string | undefined;
            role: { id: number };
            status: boolean
        }>(`/user/${user?.id}`, body);
        revalidateTag('user')
        return respond;
    };

    return (
        <div>
            <PageBreadcrumb pageTitle="Edit Roles" />
            <div
                className="w-full rounded-2xl border border-gray-200 bg-white px-5 py-7 dark:border-gray-800 dark:bg-white/[0.03] xl:px-10 xl:py-12">

                <UserForm
                    user={user}
                    allRoles={roles.data}
                    onSubmitAction={saveUser}
                />
            </div>
        </div>

    );
}