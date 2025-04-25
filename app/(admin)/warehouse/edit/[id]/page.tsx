import type {ApiResponse} from "@/types/BaseRespond";
import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import React from "react";
import {getWithAuth, putWithAuth} from "@/lib/api-client";
import {revalidateTag} from "next/cache";
import {Warehouse} from "@/types/Warehouse";
import WarehouseForm from "@/components/page/warehouse/WarehouseForm";
type PagePageProps = Promise<{ id: string }>


export default async function EditWarehousePage(props: { params: PagePageProps }) {
    const params = await props.params;
    const isEdit = !!params.id;
    let warehouse: Warehouse | undefined = undefined;

    if (isEdit) {
        const data = await getWithAuth<ApiResponse<Warehouse>>(`/warehouse/${params.id}`, {tags: ['warehouse']});
        warehouse = data.data;
    }

    const saveWarehouse = async (data: Omit<Warehouse, 'id' | 'version' | 'createdAt' | 'updatedAt'>): Promise<ApiResponse<Warehouse>> => {
        'use server';
        const body = { ...data, version: 0, id: warehouse?.id};
        const respond = await putWithAuth<ApiResponse<Warehouse>, { name: string; location: string; version: number }>(`/warehouse/${warehouse?.id}`, body);
        revalidateTag('warehouse');
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

                <WarehouseForm
                    warehouse={warehouse}
                    onSubmitAction={saveWarehouse}
                />
            </div>
        </div>

    );
}