import React from "react";
import type {Metadata} from "next";

export const metadata: Metadata = {
  title: "Dashboard",
  description: "This is Dashboard Page in IMS",
};


export default async function DashboardPage() {


  // async function onSubmitAction(query: string): Promise<{ value: string; label: string }[]> {
  //   'use server'
  //   const data = await getWithAuth<ApiResponse<User[]>>(`/user?query=${query}`, {tags: ['user'],});
  //   return data.data.map((item: User) => ({
  //     value: item.id.toString(),
  //     label: item.name
  //   }));
  // }


  return (
    <div className="w-full">
      {/*<CategoryForm onSubmitAction={onSubmitAction} />*/}
    </div>
  );
}
