import PageBreadcrumb from "../../../components/common/PageBreadCrumb";
import React, {Suspense} from "react";
import type {Metadata} from "next";
import {deleteWithAuth, getWithAuth} from "@/lib/api-client";
import type {ApiResponse} from "@/types/BaseRespond";
import {revalidateTag} from "next/cache";
import {Loading} from "@/components/common/Loading";
import {getTranslations} from "next-intl/server";
import {Warehouse} from "@/types/Warehouse";
import WarehousePage from "@/components/page/warehouse/WarehousePage";

export const metadata: Metadata = {
    title: "Warehouse",
    description: "This is Warehouse Page in IMS",
};

type PageProps = Promise<{ page?: number, query?: string, sort?: string }>


export default async function WarehouseServerPage(props: { searchParams: PageProps }) {

    const searchParams = await props.searchParams;
    const {page = 1, query = '', sort} = searchParams;
    const commonT = await getTranslations('Common');
    const t = await getTranslations('Warehouse');

    const data = await getWithAuth<ApiResponse<Warehouse[]>>('/warehouse', {
        params: {
            page: page - 1,
            query: query || '',
            sort: sort || '',
        },
        tags: ['warehouse'],
    })

    async function handleDelete(id: string | number) {
        'use server'
        const data = await deleteWithAuth<ApiResponse<void>>(`/warehouse/${id}`, {tags: ['warehouse'],});
        if (data.status == 200)
            revalidateTag('warehouse')
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
        <Suspense key={`warehouse-${page}-${query}`} fallback={<Loading
            fullScreen
            withText={false}
            size="lg"
            variant="brand"
        />}>
            <WarehousePage query={query} data={data} handleDelete={handleDelete}/>
        </Suspense>
    </div>
  );
}
