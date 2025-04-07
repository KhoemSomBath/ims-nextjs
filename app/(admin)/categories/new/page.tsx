import type {ApiResponse} from "@/types/BaseRespond";
import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import React from "react";
import {getTranslations} from "next-intl/server";
import {Category} from "@/types/Category";
import CategoryForm from "@/components/page/category/CategoryForm";
import {postWithAuth} from "@/lib/api-client";
import {revalidateTag} from "next/cache";

export default async function CreateCategoryPage() {

    const commonT = await getTranslations('Common');
    const t = await getTranslations('Categories');

    // Server action for create/update
    const saveCategory = async (data: {
        name: string;
        description: string;
    }): Promise<ApiResponse<Category>> => {
        'use server';

        const body: { name: string; description: string; version: number } = {
            ...data,
            version: 0
        }

        const respond = await postWithAuth<ApiResponse<Category>, {
            name: string;
            description: string;
            version: number
        }>('/category', body);

        revalidateTag('category')
        return respond;
    };

    return (
        <div>
            <PageBreadcrumb
                items={[
                    {title: commonT('home'), href: "/"},
                    {title: t('title'), href: "/categories"},
                    {title: t('create')},
                ]}
            />
            <div
                className="w-full rounded-2xl border border-gray-200 bg-white px-5 py-7 dark:border-gray-800 dark:bg-white/[0.03] xl:px-10 xl:py-12">

                <CategoryForm onSubmitAction={saveCategory}/>

            </div>
        </div>

    );
}