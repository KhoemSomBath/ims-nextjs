import {getWithAuth, postWithAuth} from "@/lib/api-client";
import type {ApiResponse} from "@/types/BaseRespond";
import type {Role} from "@/types/Role";
import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import React from "react";
import UserForm from "@/components/page/user/UserForm";
import type {User} from "@/types/User";
import {revalidateTag} from "next/cache";

export default async function CreateUserPage() {

    const roles = await getWithAuth<ApiResponse<Role[]>>(`/role`, {tags: ['role']});

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

        const respond = await postWithAuth<ApiResponse<User>, {
            username: string;
            name: string;
            password: string | undefined;
            role: { id: number };
            status: boolean
        }>('/user', body);
        console.log(respond)
        revalidateTag('user')
        return respond;
    };

    return (
        <div>
            <PageBreadcrumb pageTitle="Create Users"/>
            <div
                className="w-full rounded-2xl border border-gray-200 bg-white px-5 py-7 dark:border-gray-800 dark:bg-white/[0.03] xl:px-10 xl:py-12">

                <UserForm
                    user={undefined}
                    allRoles={roles.data}
                    onSubmitAction={saveUser}
                />
            </div>
        </div>

    );
}