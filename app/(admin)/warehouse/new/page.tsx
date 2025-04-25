import type {ApiResponse} from "@/types/BaseRespond";
import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import React from "react";
import {postWithAuth} from "@/lib/api-client";
import {revalidateTag} from "next/cache";
import {getTranslations} from "next-intl/server";
import WarehouseForm from "@/components/page/warehouse/WarehouseForm";
import {Warehouse} from "@/types/Warehouse";

export default async function CreateWarehousePage() {

    const commonT = await getTranslations('Common');
    const t = await getTranslations('Warehouse');

    // Server action for create/update
    const saveWarehouse = async (data: Omit<Warehouse, 'id' | 'version' | 'createdAt' | 'updatedAt'>): Promise<ApiResponse<Warehouse>> => {
        'use server';
        const body = { ...data, version: 0};
        const respond = await postWithAuth<ApiResponse<Warehouse>, { name: string; location: string; version: number }>('/warehouse', body);
        revalidateTag('warehouse');
        return respond;
    };

    return (
        <div>
            <PageBreadcrumb
                items={[
                    {title: commonT('home'), href: "/"},
                    {title: t('title'), href: "/warehouse"},
                    {title: t('create')}
                ]}
            />
            <div
                className="w-full rounded-2xl border border-gray-200 bg-white px-5 py-7 dark:border-gray-800 dark:bg-white/[0.03] xl:px-10 xl:py-12">

                <WarehouseForm
                    warehouse={undefined}
                    onSubmitAction={saveWarehouse}
                />
            </div>
        </div>

    );
}