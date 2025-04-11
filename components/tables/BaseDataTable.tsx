// components/ReactDataTable.tsx
'use client';

import {type ColumnDef, flexRender, getCoreRowModel, useReactTable,} from '@tanstack/react-table';
import {usePathname, useRouter, useSearchParams} from 'next/navigation';
import {Loader2, PlusCircle, Search, X} from 'lucide-react';
import React, {useMemo, useState} from 'react';
import Button from "@/components/ui/button/Button";
import Pagination from "@/components/tables/Pagination";
import {cn} from "@/lib/utils";
import type {ApiResponse} from "@/types/BaseRespond";
import {useTranslations} from "next-intl";
import useLocalNumeric from "@/hooks/useLocalNumeric";

interface ReactDataTableProps<TData> {
    pageData: ApiResponse<TData[]>,
    columns: ColumnDef<TData>[],
    query?: string,
    addNewLink?: string,
    actions?: {
        icon?: React.ReactNode;
        name: string;
        onClick: (row: TData) => void;
        className?: string;
    }[],
    className?: string,
    emptyState?: React.ReactNode,
    isPagination?: boolean
}

export function BaseDataTable<TData>({
                                         pageData,
                                         columns,
                                         addNewLink,
                                         actions,
                                         className,
                                         emptyState,
                                         isPagination = true,
                                     }: ReactDataTableProps<TData>) {
    const {replace, push} = useRouter();
    const searchParams = useSearchParams();
    const pathname = usePathname();
    const t = useTranslations('Common');
    const {toLocalNumeric} = useLocalNumeric();

    // Calculate display range
    const {data, paging} = pageData;

    const {page, size, totals, totalPage} = paging;
    const currentPage = page + 1; // Convert to 1-based for display
    const startElement = Math.min((currentPage - 1) * size + 1, totals);
    const endElement = Math.min(currentPage * size, totals);

    // Search state
    const currentQuery = searchParams.get('query') || '';
    const [searchQuery, setSearchQuery] = useState(currentQuery);
    const [isSearching, setIsSearching] = useState(false);
    const showClearIcon = searchQuery === currentQuery && searchQuery !== '';

    // Add actions column if provided
    const tableColumns = useMemo<ColumnDef<TData>[]>(() => {
        const baseColumns = [...columns];
        if (actions && actions.length > 0) {
            baseColumns.push({
                id: 'actions',
                cell: ({row}) => (
                    <div className="flex items-center justify-center space-x-2">
                        {actions.map((action) => (
                            <button
                                key={action.name}
                                onClick={() => action.onClick(row.original)}
                                className={cn(
                                    'inline-flex items-center justify-center p-2 rounded-md',
                                    action.className || 'hover:bg-gray-100 dark:hover:bg-gray-700'
                                )}
                                aria-label={action.name}
                            >
                                {action.icon || action.name}
                            </button>
                        ))}
                    </div>
                ),
            });
        }
        return baseColumns;
    }, [columns, actions]);

    const table = useReactTable({
        data,
        columns: tableColumns,
        getCoreRowModel: getCoreRowModel(),
        manualPagination: true,
        state: {
            pagination: {pageIndex: currentPage, pageSize: size},
        },
    });

    // Search handlers
    const handleSearch = () => {
        if (searchQuery === currentQuery) return;

        setIsSearching(true);
        const params = new URLSearchParams(searchParams);

        if (searchQuery) {
            params.set('query', searchQuery);
        } else {
            params.delete('query');
        }
        params.delete('page');

        setTimeout(() => {
            replace(`${pathname}?${params.toString()}`);
            setIsSearching(false);
        }, 500);
    };

    const handleClear = () => {
        setSearchQuery('');
        if (currentQuery) {
            const params = new URLSearchParams(searchParams);
            params.delete('query');
            replace(`${pathname}?${params.toString()}`);
        }
    };

    const handlePageChange = (page: number) => {
        const params = new URLSearchParams(searchParams);
        params.set('page', page.toString());
        replace(`${pathname}?${params.toString()}`);
    };

    return (
        <div className={cn("space-y-4", className)}>
            {/* Search and Add New Header */}
            <div className="flex items-center justify-between pb-4 border-b border-gray-200 dark:border-gray-700">
                <div className="flex-1">
                    {addNewLink && (
                        <Button
                            onClick={() => push(addNewLink)}
                            size="sm"
                            variant="primary"
                            className="gap-2"
                        >
                            <PlusCircle className="h-4 w-4"/>
                            {t('add-new')}
                        </Button>
                    )}
                </div>

                <div className="w-full max-w-xs">
                    <div className="relative">
                        <div className="absolute left-3 top-1/2 -translate-y-1/2 cursor-pointer">
                            {isSearching ? (
                                <Loader2 className="h-4 w-4 animate-spin text-brand-500"/>
                            ) : showClearIcon ? (
                                <X
                                    onClick={handleClear}
                                    className="h-4 w-4 text-gray-400 hover:text-blue-950 dark:hover:text-white"
                                />
                            ) : (
                                <Search className="h-4 w-4 text-gray-400 dark:text-gray-500"/>
                            )}
                        </div>

                        <input
                            type="text"
                            defaultValue={currentQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            onKeyDown={(e) => {
                                if (e.key === 'Enter') handleSearch();
                                if (e.key === 'Escape') handleClear();
                            }}
                            placeholder={t('search')}
                            className="h-10 w-full dark:shadow-theme-md rounded-lg border border-gray-200 py-2 pl-10 pr-24 text-sm text-gray-800 dark:border-gray-700 placeholder:text-gray-400 focus:border-brand-300 focus:outline-none focus:ring-4 focus:ring-brand-500/10 dark:text-white/90 dark:placeholder:text-gray-500 dark:focus:border-brand-800"
                        />

                        <button
                            onClick={handleSearch}
                            className="absolute right-3 top-1/2 -translate-y-1/2 inline-flex items-center gap-0.5 rounded border border-gray-200 bg-gray-50 px-2 py-1 text-xs text-gray-500 hover:bg-gray-100 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400"
                        >
                            <span>⌘</span>
                            <span>K</span>
                        </button>
                    </div>
                </div>
            </div>

            {/* Table */}
            <div className="overflow-hidden rounded-xl border border-gray-200 shadow-sm dark:border-gray-700">
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                        <thead>
                        {table.getHeaderGroups().map(headerGroup => (
                            <tr key={headerGroup.id}>
                                {headerGroup.headers.map(header => (
                                    <th
                                        key={header.id}
                                        className="px-6 py-3 text-left text-sm font-medium text-gray-700 dark:text-gray-300 uppercase tracking-wider"
                                    >
                                        {flexRender(
                                            header.column.columnDef.header,
                                            header.getContext()
                                        )}
                                    </th>
                                ))}
                            </tr>
                        ))}
                        </thead>
                        <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                        {table.getRowModel().rows.length > 0 ? (
                            table.getRowModel().rows.map(row => (
                                <tr
                                    key={row.id}
                                    className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
                                >
                                    {row.getVisibleCells().map(cell => (
                                        <td
                                            key={cell.id}
                                            className="px-6 py-4 whitespace-nowrap text-sm text-gray-700 dark:text-gray-300"
                                        >
                                            {flexRender(
                                                cell.column.columnDef.cell,
                                                cell.getContext()
                                            )}
                                        </td>
                                    ))}
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan={table.getAllColumns().length} className="px-6 py-24 text-center">
                                    {emptyState || (
                                        <div className="text-gray-500 dark:text-gray-400">
                                            No data available
                                        </div>
                                    )}
                                </td>
                            </tr>
                        )}
                        </tbody>
                    </table>
                </div>
            </div>

            {isPagination &&
                <div className="flex items-center justify-between border-t pt-4 border-gray-200 dark:border-gray-700">
                    <div className="text-sm text-gray-500 dark:text-gray-400">
                        {t('show')} <span
                        className="font-semibold"> {toLocalNumeric(paging.totals ? startElement : 0)} </span>{t('to')}
                        <span className="font-semibold"> {toLocalNumeric(endElement)} </span> {t('of')}
                        <span className="font-semibold"> {toLocalNumeric(paging.totals)} </span> {t('elements')}
                    </div>
                    <Pagination
                        currentPage={paging.page + 1}
                        totalPages={totalPage}
                        onPageChange={handlePageChange}
                    />
                </div>
            }
        </div>
    );
}