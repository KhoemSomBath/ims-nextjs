// components/tables/types.ts

// types/table.ts
import React from "react";

export interface ReactTableAction<T> {
    name: string;
    className?: string;
    icon: React.ReactNode;
    onClick: (data: T) => void;
    variant?: 'default' | 'outline' | 'ghost' | 'destructive';
}