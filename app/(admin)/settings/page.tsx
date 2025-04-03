import PageBreadcrumb from "../../../components/common/PageBreadCrumb";
import React, {Suspense} from "react";
import {getAllSettings, updateSetting} from "@/lib/setting-loader";
import Settings from "@/components/page/Settings";
import {revalidateTag} from "next/cache";
import type {Metadata} from "next";
import type {Setting, SettingLabel, SettingValue} from "@/types/settings";
import type {ApiResponse} from "@/types/BaseRespond";
import {Loading} from "@/components/common/Loading";

export const metadata: Metadata = {
    title: "Settings",
    description: "IMS System settings page",
};

export default async function SettingPage() {

    const settings = await getAllSettings();


    async function updateSettingAction(key: SettingLabel, value: SettingValue): Promise<ApiResponse<Setting> | void> {
        'use server';
        const respond = await updateSetting(key, value, true);
        if (respond && respond.status === 200) {
            revalidateTag('settings');
        }
        return respond;
    }

    return (
        <div>
            <PageBreadcrumb pageTitle="Settings"/>
            <div
                className="min-h-screen rounded-2xl border border-gray-200 bg-white px-5 py-7 dark:border-gray-800 dark:bg-white/[0.03] xl:px-10 xl:py-12">

                <Suspense fallback={<Loading
                    fullScreen
                    withText={false}
                    size="lg"
                    variant="brand"
                />}>
                    <Settings
                        initialSettings={settings}
                        updateSettingAction={updateSettingAction}
                    />
                </Suspense>
            </div>
        </div>
    );
}
