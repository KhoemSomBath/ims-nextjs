import React, { useEffect, useRef, useState, useCallback } from "react";
import type { UseFormRegisterReturn } from "react-hook-form";

interface Option {
    value: string;
    label: string;
}

interface ServerSelectProps {
    fetchOptionsAction: (searchTerm: string) => Promise<Option[]>;
    placeholder?: string;
    onChange?: (value: string) => void;
    className?: string;
    value?: string;
    defaultValue?: string;
    register?: UseFormRegisterReturn;
    name?: string;
    id?: string;
    error?: boolean;
    hint?: string;
    disabled?: boolean;
    debounceTimeout?: number;
}

const debounce = <T,>(func: (arg: T) => void, wait: number) => {
    let timeout: number;
    return (arg: T) => {
        window.clearTimeout(timeout);
        timeout = window.setTimeout(() => func(arg), wait);
    };
};

export default function ServerSelect({
                                         fetchOptionsAction,
                                         placeholder = "Select an option",
                                         onChange,
                                         className = "",
                                         value: propValue,
                                         defaultValue,
                                         register,
                                         name,
                                         id,
                                         error = false,
                                         hint,
                                         disabled = false,
                                         debounceTimeout = 300,
                                     }: ServerSelectProps) {
    const [isOpen, setIsOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");
    const [options, setOptions] = useState<Option[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [selectedOption, setSelectedOption] = useState<Option | null>(null);
    const dropdownRef = useRef<HTMLDivElement>(null);

    const fetchAndCacheOptions = useCallback(async (term: string) => {
        if(options.length)
            return;
        setIsLoading(options.length === 0);
        try {
            const results = await fetchOptionsAction(term);
            setOptions(results);
        } catch (err) {
            console.error("Failed to fetch options:", err);
            setOptions([]);
        } finally {
            setIsLoading(false);
        }
    }, [fetchOptionsAction]);

    // Memoized debounced search function
    // eslint-disable-next-line react-hooks/exhaustive-deps
    const debouncedSearch = useCallback(
        debounce((term: string) => {
            fetchAndCacheOptions(term);
        }, debounceTimeout),
        [fetchAndCacheOptions, debounceTimeout]
    );

    // Handle search term changes
    useEffect(() => {
        if (isOpen && searchTerm !== undefined) {
            debouncedSearch(searchTerm);
        }
    }, [searchTerm, isOpen, debouncedSearch]);

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                handleClose();
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    const handleClose = useCallback(() => {
        setIsOpen(false);
        setSearchTerm("");
    }, []);

    const handleSelect = useCallback((option: Option) => {
        setSelectedOption(option);
        onChange?.(option.value);
        handleClose();
    }, [onChange, handleClose]);

    const toggleDropdown = useCallback(() => {
        if (disabled) return;

        if (isOpen) {
            handleClose();
        } else {
            setIsOpen(true);
            // Trigger initial load when opening
            if(!options)
                fetchAndCacheOptions("");
        }
    }, [disabled, isOpen, fetchAndCacheOptions, handleClose]);

    // Initialize with default value
    useEffect(() => {
        if (defaultValue && options.length > 0) {
            const selected = options.find(opt => opt.value === defaultValue);
            setSelectedOption(selected || null);
        }
    }, [defaultValue, options]);

    // Handle prop value changes
    useEffect(() => {
        if (propValue !== undefined) {
            const selected = options.find(opt => opt.value === propValue);
            setSelectedOption(selected || null);
        }
    }, [propValue, options]);

    return (
        <div className={`w-full ${className}`} ref={dropdownRef}>
            <div className="relative">
                <button
                    type="button"
                    onClick={toggleDropdown}
                    disabled={disabled}
                    className={`h-11 w-full text-left rounded-lg border ${
                        error
                            ? "border-error-500 focus:ring-error-500/10 text-error-800 dark:text-error-400 dark:border-error-500"
                            : "border-gray-300 dark:border-gray-700 focus:border-brand-300 focus:ring-brand-500/10"
                    } px-4 py-2.5 pr-10 text-sm shadow-theme-xs focus:outline-none focus:ring-3 dark:bg-gray-900 ${
                        selectedOption
                            ? "text-gray-800 dark:text-white/90"
                            : "text-gray-500 dark:text-gray-400"
                    } ${disabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}`}
                >
                    {selectedOption?.label || placeholder}
                    <span className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                        <svg className="w-5 h-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd"/>
                        </svg>
                    </span>
                </button>

                {isOpen && (
                    <div className={`
                        absolute z-10 mt-1 w-full bg-white dark:bg-gray-900 rounded-lg shadow-theme-xs
                        border ${error ? 'border-error-500' : 'border-gray-300 dark:border-gray-700'}
                    `}>
                        <div className="p-2 border-b border-gray-200 dark:border-gray-700">
                            <input
                                type="text"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                placeholder="Search..."
                                className="w-full px-3 py-2 text-sm border rounded-md focus:outline-none focus:ring-2 focus:ring-brand-500/10 dark:bg-gray-800 dark:border-gray-700"
                                autoFocus
                            />
                        </div>

                        <ul className="max-h-60 overflow-auto">
                            {isLoading ? (
                                <li className="px-4 py-2 text-sm text-gray-500 dark:text-gray-400">Loading...</li>
                            ) : options.length === 0 ? (
                                <li className="px-4 py-2 text-sm text-gray-500 dark:text-gray-400">No options found</li>
                            ) : (
                                options.map((option) => (
                                    <li
                                        key={option.value}
                                        onClick={() => handleSelect(option)}
                                        className={`px-4 py-2 text-sm cursor-pointer ${
                                            selectedOption?.value === option.value
                                                ? "bg-brand-100 dark:bg-brand-900/30"
                                                : "hover:bg-gray-100 dark:hover:bg-gray-800"
                                        }`}
                                    >
                                        {option.label}
                                    </li>
                                ))
                            )}
                        </ul>
                    </div>
                )}
            </div>

            {hint && (
                <p className={`mt-1.5 text-xs ${
                    error ? "text-error-500" : "text-gray-500 dark:text-gray-400"
                }`}>
                    {hint}
                </p>
            )}

            <select
                {...register}
                name={name || register?.name}
                id={id || register?.name || name}
                value={selectedOption?.value || ''}
                onChange={() => {}}
                className="absolute opacity-0 h-0 w-0"
                aria-hidden="true"
                tabIndex={-1}
            >
                {options.map((option) => (
                    <option key={option.value} value={option.value}>
                        {option.label}
                    </option>
                ))}
            </select>
        </div>
    );
}