import React, { useEffect, useState } from "react";
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
                                       }) => {
    const [internalValue, setInternalValue] = useState(defaultValue || '');

    useEffect(() => {
        if (propValue !== undefined) {
            setInternalValue(propValue);
        }
    }, [propValue]);

    const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const newValue = e.target.value;
        setInternalValue(newValue);
        onChange?.(newValue);
        register?.onChange(e);
    };

    return (
        <div className="w-full">
            <select
                {...register}
                name={name || register?.name}
                id={id || register?.name || name}
                value={propValue !== undefined ? propValue : internalValue}
                onChange={handleChange}
                className={`h-11 w-full appearance-none rounded-lg border ${
                    error ? "text-error-800 border-error-500 focus:ring-3 focus:ring-error-500/10 dark:text-error-400 dark:border-error-500"
                        : "border-gray-300 dark:border-gray-700"
                } px-4 py-2.5 pr-11 text-sm shadow-theme-xs focus:border-brand-300 focus:outline-none focus:ring-3 focus:ring-brand-500/10 dark:bg-gray-900 dark:text-white/90 ${
                    internalValue
                        ? "text-gray-800 dark:text-white/90"
                        : "text-gray-500 dark:text-gray-400"
                } ${className}`}
                // Add style attribute as fallback
                style={{
                    color: internalValue ? '' : '#6b7280' // gray-500
                }}
            >
                <option
                    value=""
                    disabled
                    className="text-gray-500 dark:text-gray-400"
                    // Force gray color with style attribute
                    style={{
                        color: '#6b7280' // gray-500
                    }}
                >
                    {placeholder}
                </option>
                {options.map((option) => (
                    <option
                        key={option.value}
                        value={option.value}
                        className="text-gray-800 dark:text-white/90 dark:bg-gray-900"
                    >
                        {option.label}
                    </option>
                ))}
            </select>
            {hint && (
                <p className={`mt-1.5 text-xs ${
                    error ? "text-error-500" : "text-success-500"
                }`}>
                    {hint}
                </p>
            )}
        </div>
    );
};

export default Select;