import {Noto_Sans_Khmer, Outfit} from 'next/font/google';
import './globals.css';
import {SidebarProvider} from '@/context/SidebarContext';
import {ThemeProvider} from "next-themes";
import {AuthProvider} from "@/context/AuthProvider";
import type {Metadata, Viewport} from "next";
import React from "react";
import {NextIntlClientProvider} from "next-intl";
import {getSetting} from "@/lib/setting-loader";
import {SettingLabel} from "@/types/settings";
import {auth} from "@/auth";

export const metadata: Metadata = {
    title: {
        template: '%s | IMS System',
        default: 'IMS System',
    },
    description: 'Inventory Management System',
    metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'),
    alternates: {
        canonical: '/',
    },
    robots: {
        index: true,
        follow: true,
    },
}

export const viewport: Viewport = {
    themeColor: [
        {media: '(prefers-color-scheme: light)', color: '#ffffff'},
        {media: '(prefers-color-scheme: dark)', color: '#111827'},
    ],
    width: 'device-width',
    initialScale: 1,
}

const outfit = Outfit({
    subsets: ['latin'],
    variable: '--font-outfit',
    display: 'swap',
});

const notoSansKhmer = Noto_Sans_Khmer({
    subsets: ['khmer'],
    variable: '--font-noto-sans-khmer',
    display: 'swap',
});


export default async function RootLayout({
                                             children,
                                         }: Readonly<{
    children: React.ReactNode;
}>) {
    const session = await auth();
    const locale = await getSetting<string>(SettingLabel.IMS_DEFAULT_LANGUAGE)

    return (
        <html lang={locale} suppressHydrationWarning>
        <body  className={`${locale === 'kh' ? notoSansKhmer.variable : outfit.variable} font-sans bg-white dark:bg-gray-900`}>
        <NextIntlClientProvider locale={locale}>

            <ThemeProvider
                attribute="class"
                defaultTheme="system"
                enableSystem
                disableTransitionOnChange
                storageKey="ims-theme"
            >
                <AuthProvider session={session}>
                    <SidebarProvider>
                        {children}
                    </SidebarProvider>
                </AuthProvider>

            </ThemeProvider>

        </NextIntlClientProvider>

        </body>
        </html>
    );
}