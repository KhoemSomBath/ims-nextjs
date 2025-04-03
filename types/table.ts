// components/tables/types.ts

// types/table.ts
import React from "react";

export type TableColumn<T> = {
    key: keyof T;
    header: string;
    render?: (row: T, index: number) => React.ReactNode;
    className?: string;
};

export type TableAction<T> = {
    name: string;
    icon?: React.ReactNode;
    onClick: (row: T) => void;
    className?: string;
    render?: (row: T, index: number) => React.ReactNode;
};