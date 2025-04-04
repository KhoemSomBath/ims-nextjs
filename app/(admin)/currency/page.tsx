import PageBreadcrumb from "../../../components/common/PageBreadCrumb";
import React, {Suspense} from "react";
import type {Metadata} from "next";
import {deleteWithAuth, getWithAuth} from "@/lib/api-client";
import type {ApiResponse} from "@/types/BaseRespond";
import {revalidateTag} from "next/cache";
import type {Currency} from "@/types/Currency";
import {Loading} from "@/components/common/Loading";
import CurrencyPage from "@/components/page/currency/CurrencyPage";

export const metadata: Metadata = {
    title: "Currency",
    description: "This is Currency Page in IMS",
};

type PageProps = Promise<{ page?: number, query?: string, from?: string }>


export default async function CurrencyServerPage(props: { searchParams: PageProps }) {

    const searchParams = await props.searchParams;
    const {page = 1, query = ''} = searchParams;

    const data = await getWithAuth<ApiResponse<Currency[]>>('/currency', {
        params: {
            page: page - 1,
            query: query || '',
        },
        tags: ['currency'],
    })

    async function handleDelete(id: string | number) {
        'use server'
        const data = await deleteWithAuth<ApiResponse<void>>(`/currency/${id}`, {tags: ['currency'],});
        if (data.status == 200)
            revalidateTag('currency')
        return data;
    }

  return (
    <div>
      <PageBreadcrumb
          items={[
            { title: "Home", href: "/" },
            { title: "Currency" }
          ]}
      />
        <Suspense key={`currency-${page}-${query}`} fallback={<Loading
            fullScreen
            withText={false}
            size="lg"
            variant="brand"
        />}>
            <CurrencyPage query={query} data={data} handleDelete={handleDelete}/>
        </Suspense>
    </div>
  );
}
