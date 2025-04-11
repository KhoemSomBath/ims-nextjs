'use client';

import ServerSelect from "@/components/form/ServerSelect";
import React from "react";

interface CategoryFormProps {
    onSubmitAction: (query: string) => Promise<{ value: string; label: string }[]>
}

export default function CategoryForm({onSubmitAction}: CategoryFormProps) {


    return (
        <div className="p-6 w-full">
            <h1 className="text-2xl font-bold mb-4">Server Component Example</h1>

            <div className="max-w-md space-y-4">
                <ServerSelect
                    fetchOptionsAction={onSubmitAction}
                    defaultValue="3" // Can be set from server data
                    placeholder="Select an option..."
                    className="w-full"
                />
            </div>
        </div>
    );
}