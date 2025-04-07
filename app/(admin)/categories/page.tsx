import PageBreadcrumb from "../../../components/common/PageBreadCrumb";
import type {Metadata} from "next";
import React, {Suspense} from "react";
import {deleteWithAuth, getWithAuth} from "@/lib/api-client";
import type {ApiResponse} from "@/types/BaseRespond";
import {revalidateTag} from "next/cache";
import {Loading} from "@/components/common/Loading";
import {getTranslations} from "next-intl/server";
import {Category} from "@/types/Category";
import Categories from "@/components/page/category/Categories";


export const metadata: Metadata = {
    title: "Categories",
    description: "This is Categories Page in IMS",
};

type PageProps = Promise<{ page?: number, query?: string, from?: string }>


export default async function CategoriesPage(props: { searchParams: PageProps }) {
    const searchParams = await props.searchParams;
    const {page = 1, query = ''} = searchParams;
    const commonT = await getTranslations('Common');
    const t = await getTranslations('Categories');


    const data = await getWithAuth<ApiResponse<Category[]>>('/category', {
        params: {
            page: page - 1,
            query: query || '',
        },
        tags: ['category'],
    })

    async function handleDelete(id: string | number) {
        'use server'
        const data = await deleteWithAuth<ApiResponse<void>>(`/user/${id}`, {tags: ['category'],});
        if (data.status == 200)
            revalidateTag('category')
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
            <Suspense key={`user-${page}-${query}`} fallback={<Loading
                fullScreen
                withText={false}
                size="lg"
                variant="brand"
            />}>
                <Categories query={query} data={data} handleDelete={handleDelete}/>
            </Suspense>
        </div>
    );

}
