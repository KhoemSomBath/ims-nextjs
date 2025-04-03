// components/Table.tsx
'use client';

import {usePathname, useRouter, useSearchParams} from 'next/navigation';
import type {TableAction, TableColumn} from '@/types/table';
import type {ApiResponse} from "@/types/BaseRespond";
import Pagination from "@/components/tables/Pagination";
import React, {memo, useMemo, useState} from "react";
import {Loader2, PlusCircleIcon, Search, X} from "lucide-react";
import Button from "@/components/ui/button/Button";

export interface TableProps<T> {
    pageData: ApiResponse<T[]>;
    query?: string;
    addNewLink?: string;
    columns: TableColumn<T>[];
    actions?: TableAction<T>[];
    className?: string;
}

export function BaseTable<T>({
                                 pageData,
                                 query = '',
                                 columns,
                                 addNewLink,
                                 actions,
                             }: TableProps<T>) {
    const router = useRouter();
    const searchParams = useSearchParams();
    const pathname = usePathname();
    const {data, paging} = pageData;

    const {page, size, totals, totalPage} = paging;
    const currentPage = page + 1; // Convert to 1-based for display
    const totalElements = totals;

// Calculate display range
    const startElement = Math.min((currentPage - 1) * size + 1, totalElements);
    const endElement = Math.min(currentPage * size, totalElements);

    const [searchQuery, setSearchQuery] = useState(query);
    const [isSearching, setIsSearching] = useState(false);

    // Get current query from URL
    const currentQuery = searchParams.get('query') || '';

    // Show clear icon when input matches active search
    const showClearIcon = searchQuery === currentQuery && searchQuery !== '';

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

        new Promise(resolve => setTimeout(resolve, 500)).then(() => {
            router.replace(`${pathname}?${params.toString()}`);
            setIsSearching(false);
        }); // Minimum loading time
    };

    const handleClear = () => {
        setSearchQuery('');
        if (currentQuery) {
            const params = new URLSearchParams(searchParams);
            params.delete('query');
            router.replace(`${pathname}?${params.toString()}`);
        }
    };

    const handlePageChange = (page: number) => {
        const params = new URLSearchParams(searchParams);
        params.set('page', page.toString());
        router.replace(`${pathname}?${params.toString()}`);
    };

    const memoizedColumns = useMemo(() => columns, [columns]);

    const TableRow = memo(({ row, columns, index }: { row: T; columns: TableColumn<T>[], index: number }) => (
        <tr className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
            {columns.map((column) => (
                <td key={column.key.toString()} className="px-6 py-4 whitespace-nowrap text-sm text-gray-700 dark:text-gray-300 text-left">
                    {column.render ? column.render(row, index) : String(row[column.key])}
                </td>
            ))}

            {actions && actions.length > 0 && (
                <td className="px-4 py-2 whitespace-nowrap text-sm font-medium">
                    <div className="flex items-center justify-center space-x-2">
                        {actions.map((action) => (
                            action.render ? action.render(row, index) : (
                                <button
                                    key={action.name}
                                    onClick={() => action.onClick(row)}
                                    className={`inline-flex items-center justify-center p-2 rounded-md ${action.className || 'hover:bg-gray-100 dark:hover:bg-gray-700'} transition-colors`}
                                    aria-label={action.name}
                                >
                                    {action.icon || action.name}
                                </button>
                            )
                        ))}
                    </div>
                </td>
            )}

        </tr>
    ));
    TableRow.displayName = 'TableRow';

    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between pb-4 border-b border-gray-200 dark:border-gray-700">
                <div className="flex-1">
                    {addNewLink && <Button onClick={() => router.push(addNewLink)} size="xs" variant="primary" startIcon={<PlusCircleIcon/>}>
                        Add new
                    </Button>}
                </div>
                {/* Spacer */}
                <div className="w-full max-w-xs">
                    <div className="relative">
                        {/* Dynamic Left Icon */}
                        <div className="absolute left-3 top-1/2 -translate-y-1/2 cursor-pointer">
                            {isSearching ? (
                                <Loader2 className="h-4 w-4 animate-spin text-brand-500"/>
                            ) : showClearIcon ? (
                                <X onClick={handleClear}
                                   className="h-4 w-4 text-gray-400 hover:text-blue-950 dark:hover:text-white"/>
                            ) : (
                                <Search className="h-4 w-4 text-gray-400 dark:text-gray-500"/>
                            )}
                        </div>

                        <input
                            type="text"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            onKeyDown={(e) => {
                                if (e.key === 'Enter') handleSearch();
                                if (e.key === 'Escape') handleClear();
                            }}
                            placeholder="Search"
                            className="h-11 w-full dark:shadow-theme-md rounded-lg border border-gray-200 py-2.5 pl-10 pr-24 text-sm text-gray-800 dark:border-gray-700 placeholder:text-gray-400 focus:border-brand-300 focus:outline-none focus:ring-4 focus:ring-brand-500/10 dark:text-white/90 dark:placeholder:text-gray-500 dark:focus:border-brand-800"
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

            {/* Table Container */}
            <div
                className="overflow-hidden rounded-xl border border-gray-200 shadow-sm dark:border-gray-700">
                {/* Table */}
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                        <thead>
                        <tr>
                            {memoizedColumns.map((column) => (
                                <th
                                    key={column.key.toString()}
                                    scope="col"
                                    className="px-6 py-4 whitespace-nowrap text-sm text-gray-700 dark:text-gray-300 text-left"
                                >
                                    {column.header}
                                </th>
                            ))}
                            {actions && actions.length > 0 && (
                                <th scope="col"
                                    className="px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-gray-300">
                                    Actions
                                </th>
                            )}
                        </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                            {data.map((row, rowIndex) => (
                                <TableRow key={rowIndex} index={rowIndex} row={row} columns={memoizedColumns} />
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Pagination */}
            <div className="flex items-center justify-between border-t pt-4 border-gray-200 dark:border-gray-700">
                <div className="text-sm text-gray-500 dark:text-gray-400">
                    Showing <span className="font-semibold"> {paging.totals ? startElement : 0} </span>to
                    <span className="font-semibold"> {endElement} </span> of
                    <span className="font-semibold"> {paging.totals} </span> elements
                </div>
                <Pagination
                    currentPage={paging.page + 1}
                    totalPages={totalPage}
                    onPageChange={handlePageChange}
                />
            </div>
        </div>
    );
}