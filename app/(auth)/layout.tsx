import ThemeToggleTwo from "../../components/common/ThemeTogglerTwo";

import React from "react";
import {ThemeProvider} from "next-themes";

export default function AuthLayout({
                                       children,
                                   }: {
    children: React.ReactNode;
}) {
    return (
        <div className="relative p-6 bg-white z-1 dark:bg-gray-900 sm:p-0">
            <ThemeProvider
                attribute="class"
                defaultTheme="system"
                enableSystem
                disableTransitionOnChange
                storageKey="ims-theme"
            >
                <div
                    className="relative flex lg:flex-row w-full h-screen justify-center flex-col  dark:bg-gray-900 sm:p-0">
                    {children}
                    <div className="fixed bottom-6 right-6 z-50 hidden sm:block">
                        <ThemeToggleTwo/>
                    </div>
                </div>
            </ThemeProvider>
        </div>
    );
}
