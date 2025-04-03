import React, { useEffect, useState } from "react";
import type {UseFormRegisterReturn} from "react-hook-form";

interface Option {
    value: string;
    label: string;
}

interface SelectProps {
    options: Option[];
    placeholder?: string;
    onChange?: (value: string) => void;
    className?: string;
    value?: string; // Controlled component value
    defaultValue?: string; // Uncontrolled initial value
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
                                           value: propValue, // Controlled value
                                           defaultValue,
                                           register,
                                           name,
                                           id,
                                           error = false,
                                           hint,
                                       }) => {
    const [internalValue, setInternalValue] = useState(defaultValue || '');

    // Update internal value when propValue changes (controlled mode)
    useEffect(() => {
        if (propValue !== undefined) {
            setInternalValue(propValue);
        }
    }, [propValue]);

    const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const newValue = e.target.value;
        setInternalValue(newValue);
        onChange?.(newValue); // Notify parent component
        register?.onChange(e); // Notify React Hook Form
    };

    return (
        <div className="w-full">
            <select
                {...register}
                name={name || register?.name}
                id={id || register?.name || name}
                value={propValue !== undefined ? propValue : internalValue} // Controlled if propValue provided
                onChange={handleChange}
                className={`h-11 w-full appearance-none rounded-lg border ${
                    error ? "border-destructive" : "border-gray-300 dark:border-gray-700"
                } px-4 py-2.5 pr-11 text-sm shadow-theme-xs placeholder:text-gray-400 focus:border-brand-300 focus:outline-none focus:ring-3 focus:ring-brand-500/10 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30 dark:focus:border-brand-800 ${
                    internalValue
                        ? "text-gray-800 dark:text-white/90"
                        : "text-gray-400 dark:text-gray-400"
                } ${className}`}
            >
                <option value="" disabled className="text-gray-700 dark:bg-gray-900 dark:text-gray-400">
                    {placeholder}
                </option>
                {options.map((option) => (
                    <option
                        key={option.value}
                        value={option.value}
                        className="text-gray-700 dark:bg-gray-900 dark:text-gray-400"
                    >
                        {option.label}
                    </option>
                ))}
            </select>
            {hint && (
                <p
                    className={`mt-1.5 text-xs ${
                        error
                            ? "text-error-500"
                            :  "text-success-500"
                    }`}
                >
                    {hint}
                </p>
            )}
        </div>
    );
};

export default Select;

