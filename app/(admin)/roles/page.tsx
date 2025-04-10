import PageBreadcrumb from "../../../components/common/PageBreadCrumb";
import React, {Suspense} from "react";
import {deleteWithAuth, getWithAuth} from "@/lib/api-client";
import Roles from "@/components/page/role/Roles";
import {revalidateTag} from "next/cache";
import type {Metadata} from "next";
import type {ApiResponse} from "@/types/BaseRespond";
import type {Role} from "@/types/Role";
import {Loading} from "@/components/common/Loading";
import {getTranslations} from "next-intl/server";

export const metadata: Metadata = {
    title: "Roles",
    description: "This is Role Page in IMS",
};

type RolesPageProps = Promise<{ page?: number, query?: string, from?: string }>


export default async function RolesPage(props: { searchParams: RolesPageProps }) {

    const commonT = await getTranslations('Common');
    const t = await getTranslations('Roles');

    const searchParams = await props.searchParams;
    const {page = 1, query = ''} = searchParams;

    const data = await getWithAuth<ApiResponse<Role[]>>('/role', {
        params: {
            page: page - 1,
            query: query || '',
        },
        tags: ['role'],
    })

    async function handleDelete(id: string | number) {
        'use server'
        const data = await deleteWithAuth<ApiResponse<void>>(`/role/${id}`, {tags: ['role'],});
        if (data.status == 200)
            revalidateTag('role')
        return data;
    }

    return (
        <div>
            <PageBreadcrumb
                items={[
                    { title: commonT('home'), href: "/" },
                    { title: t('title') }
                ]}
            />
            <Suspense fallback={<Loading
                fullScreen
                withText={false}
                size="lg"
                variant="brand"
            />}>
                <Roles addNewLink={'/roles/new'} query={query} data={data} handleDelete={handleDelete}/>
            </Suspense>
        </div>
    );
}
