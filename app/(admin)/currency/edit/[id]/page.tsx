import type {ApiResponse} from "@/types/BaseRespond";
import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import React from "react";
import CurrencyForm from "@/components/page/currency/CurrencyForm";
import type {Currency} from "@/types/Currency";
import {getWithAuth, putWithAuth} from "@/lib/api-client";
import {revalidateTag} from "next/cache";
type PagePageProps = Promise<{ id: string }>


export default async function EditCurrencyPage(props: { params: PagePageProps }) {
    const params = await props.params;
    const isEdit = !!params.id;
    let currency: Currency | undefined = undefined;

    if (isEdit) {
        const data = await getWithAuth<ApiResponse<Currency>>(`/currency/${params.id}`, {tags: ['currency']});
        currency = data.data;
    }

    // Server action for create/update
    const saveCurrency = async (data: {
        id?: number;
        code: string;
        name: string;
        rate: number;
    }): Promise<ApiResponse<Currency>> => {
        'use server';
        const body = { ...data, version: currency?.version};
        const respond = await putWithAuth<ApiResponse<Currency>, { id?: number; code: string; name: string; rate: number; version?: number }>(`/currency/${params.id}`, body);
        revalidateTag('currency')
        return respond;
    };

    return (
        <div>
            <PageBreadcrumb
                items={[
                    {title: "Home", href: "/"},
                    {title: "Currency", href: "/currency"},
                    {title: "Edit Currency"}
                ]}
            />
            <div
                className="w-full rounded-2xl border border-gray-200 bg-white px-5 py-7 dark:border-gray-800 dark:bg-white/[0.03] xl:px-10 xl:py-12">

                <CurrencyForm
                    currency={currency}
                    onSubmitAction={saveCurrency}
                />
            </div>
        </div>

    );
}