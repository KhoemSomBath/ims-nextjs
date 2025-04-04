import PageBreadcrumb from "../../../components/common/PageBreadCrumb";
import type {Metadata} from "next";
import React, {Suspense} from "react";
import {deleteWithAuth, getWithAuth} from "@/lib/api-client";
import type {ApiResponse} from "@/types/BaseRespond";
import {revalidateTag} from "next/cache";
import type {User} from "@/types/User";
import {Loading} from "@/components/common/Loading";
import Users from "@/components/page/user/Users";

export const metadata: Metadata = {
    title: "Users",
    description: "This is Users Page in IMS",
};

type UsersPageProps = Promise<{ page?: number, query?: string, from?: string }>


export default async function UsersPage(props: { searchParams: UsersPageProps }) {
    const searchParams = await props.searchParams;
    const {page = 1, query = ''} = searchParams;

    const data = await getWithAuth<ApiResponse<User[]>>('/user', {
        params: {
            page: page - 1,
            query: query || '',
        },
        tags: ['user'],
    })

    async function handleDelete(id: string | number) {
        'use server'
        const data = await deleteWithAuth<ApiResponse<void>>(`/user/${id}`, {tags: ['user'],});
        if (data.status == 200)
            revalidateTag('user')
        return data;
    }

    return (
        <div>
            <PageBreadcrumb
                items={[
                    { title: "Home", href: "/" },
                    { title: "Users" }
                ]}
            />
            <Suspense key={`user-${page}-${query}`} fallback={<Loading
                fullScreen
                withText={false}
                size="lg"
                variant="brand"
            />}>
                <Users query={query} data={data} handleDelete={handleDelete}/>
            </Suspense>
        </div>
    );

}
