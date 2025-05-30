import type {ApiResponse} from "@/types/BaseRespond";
import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import React from "react";
import CurrencyForm from "@/components/page/currency/CurrencyForm";
import type {Currency} from "@/types/Currency";
import {postWithAuth} from "@/lib/api-client";
import {revalidateTag} from "next/cache";
import {getTranslations} from "next-intl/server";

export default async function CreateCurrencyPage() {

    const commonT = await getTranslations('Common');
    const t = await getTranslations('Currencies');

    // Server action for create/update
    const saveCurrency = async (data: {
        id?: number;
        code: string;
        name: string;
        rate: number;
    }): Promise<ApiResponse<Currency>> => {
        'use server';
        const body = { ...data, version: 0};
        const respond = await postWithAuth<ApiResponse<Currency>, { id?: number; code: string; name: string; rate: number; version: number }>('/currency', body);
        revalidateTag('currency')
        return respond;
    };

    return (
        <div>
            <PageBreadcrumb
                items={[
                    {title: commonT('home'), href: "/"},
                    {title: t('title'), href: "/currency"},
                    {title: t('create')}
                ]}
            />
            <div
                className="w-full rounded-2xl border border-gray-200 bg-white px-5 py-7 dark:border-gray-800 dark:bg-white/[0.03] xl:px-10 xl:py-12">

                <CurrencyForm
                    currency={undefined}
                    onSubmitAction={saveCurrency}
                />
            </div>
        </div>

    );
}