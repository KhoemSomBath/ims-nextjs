// app/api/settings/route.ts
import { updateSetting as serverUpdateSetting } from '@/lib/setting-loader';
import { NextResponse } from 'next/server';
import {revalidateTag} from "next/cache";

export async function PUT(request: Request) {
    const { label, value } = await request.json();
    const result = await serverUpdateSetting(label, value, true);
    revalidateTag('settings');
    return NextResponse.json(result);
}