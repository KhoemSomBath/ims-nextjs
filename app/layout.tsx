import {Outfit} from 'next/font/google';
import './globals.css';
import {SidebarProvider} from '@/context/SidebarContext';
import {ThemeProvider} from "next-themes";
import {getCurrentUser} from "@/lib/auth";
import {AuthProvider} from "@/context/AuthProvider";
import type {Metadata, Viewport} from "next";
import React from "react";

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
    subsets: ["latin"],
});

export default async function RootLayout({
                                             children,
                                         }: Readonly<{
    children: React.ReactNode;
}>) {
    const user = await getCurrentUser();

    return (
        <html lang="en" suppressHydrationWarning className={`${outfit}`}>
        <body className={`${outfit.className} bg-white dark:bg-gray-900`}>
        <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
            storageKey="ims-theme"
        >
            <AuthProvider user={user}>
                <SidebarProvider>
                    {children}
                </SidebarProvider>
            </AuthProvider>
        </ThemeProvider>
        </body>
        </html>
    );
}