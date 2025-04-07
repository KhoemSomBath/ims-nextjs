import type {ApiResponse} from "@/types/BaseRespond";
import {getWithAuth, putWithAuth} from "@/lib/api-client";
import {revalidateTag} from "next/cache";
import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import React from "react";
import type {Category} from "@/types/Category";
import CategoryForm from "@/components/page/category/CategoryForm";
import {getTranslations} from "next-intl/server";

type PageProps = Promise<{ id: string }>


export default async function EditCategoryPage(props: { params: PageProps }) {
    const params = await props.params;
    const isEdit = !!params.id;
    let category: Category | undefined = undefined;

    if (isEdit) {
        const data = await getWithAuth<ApiResponse<Category>>(`/category/${params.id}`, {tags: ['category']});
        category = data.data;
    }

    const commonT = await getTranslations('Common');
    const t = await getTranslations('Categories');


    const saveCategory = async (data: {
        name: string;
        description: string;
    }): Promise<ApiResponse<Category>> => {
        'use server';

        const body: { name: string; description: string; version: number } = {
            ...data,
            version: 0
        }

        const respond = await putWithAuth<ApiResponse<Category>, {
            name: string;
            description: string;
            version: number
        }>(`/category/${params.id}`, body);

        revalidateTag('category')
        return respond;
    };

    return (
        <div>
            <PageBreadcrumb
                items={[
                    {title: commonT('home'), href: "/"},
                    {title: t('title'), href: "/categories"},
                    {title: t('update')},
                ]}
            />
            <div
                className="w-full rounded-2xl border border-gray-200 bg-white px-5 py-7 dark:border-gray-800 dark:bg-white/[0.03] xl:px-10 xl:py-12">

                <CategoryForm
                    category={category}
                    onSubmitAction={saveCategory}
                />
            </div>
        </div>

    );
}