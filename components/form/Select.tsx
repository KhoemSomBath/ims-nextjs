import React, { useEffect, useRef, useState } from "react";
import type { UseFormRegisterReturn } from "react-hook-form";

interface Option {
    value: string;
    label: string;
}

interface SelectProps {
    options: Option[];
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
}

const Select: React.FC<SelectProps> = ({
                                           options,
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
                                       }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [internalValue, setInternalValue] = useState(defaultValue || '');
    const dropdownRef = useRef<HTMLDivElement>(null);

    const selectedOption = options.find(opt => opt.value === (propValue !== undefined ? propValue : internalValue));

    useEffect(() => {
        if (propValue !== undefined) {
            setInternalValue(propValue);
        }
    }, [propValue]);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleSelect = (value: string) => {
        setInternalValue(value);
        onChange?.(value);
        setIsOpen(false);

        if (register) {
            const mockEvent = {
                target: {
                    name: register.name,
                    value,
                },
            } as unknown as React.ChangeEvent<HTMLSelectElement>;
            register.onChange(mockEvent);
        }
    };

    return (
        <div className={`w-full ${className}`} ref={dropdownRef}>
            <div className="relative">
                {/* Custom select button */}
                <button
                    type="button"
                    onClick={() => !disabled && setIsOpen(!isOpen)}
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
                    {/* Dropdown icon */}
                    <span className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                        <svg className="w-5 h-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd"/>
                        </svg>
                    </span>
                </button>

                {/* Custom dropdown options with bordered list items */}
                {isOpen && (
                    <ul className={`
                        absolute z-10 mt-1 w-full bg-white dark:bg-gray-900 rounded-lg shadow-theme-xs overflow-hidden
                        border ${error ? 'border-error-500' : 'border-gray-300 dark:border-gray-700'}
                    `}>
                        {options.map((option, index) => (
                            <li
                                key={option.value}
                                onClick={() => handleSelect(option.value)}
                                className={`
                                    px-4 py-2.5 text-sm cursor-pointer 
                                    ${(propValue !== undefined ? propValue : internalValue) === option.value
                                    ? "bg-brand-100 dark:bg-brand-900/30"
                                    : "hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
                                }
                                    ${index !== options.length - 1 ? "border-b border-gray-200 dark:border-gray-700" : ""}
                                `}
                            >
                                {option.label}
                            </li>
                        ))}
                    </ul>
                )}
            </div>

            {/* Hint text */}
            {hint && (
                <p className={`mt-1.5 text-xs ${
                    error ? "text-error-500" : "text-gray-500 dark:text-gray-400"
                }`}>
                    {hint}
                </p>
            )}

            {/* Hidden native select for form submission */}
            <select
                {...register}
                name={name || register?.name}
                id={id || register?.name || name}
                value={propValue !== undefined ? propValue : internalValue}
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
};

export default Select;