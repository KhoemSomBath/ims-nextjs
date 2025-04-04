// lib/utils.ts
import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'
import { format } from 'date-fns-tz';
import { enUS, km } from 'date-fns/locale';
import {toZonedTime } from 'date-fns-tz';


export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs))
}

type LocaleCode = 'en' | 'kh';
type Timezone = string; // e.g., 'Asia/Phnom_Penh'

/**
 * Format a date with locale and timezone support
 * @param date Date object, string, or timestamp
 * @param timezone Target timezone (e.g., 'Asia/Phnom_Penh')
 * @param locale 'en' or 'kh'
 * @param formatStr Date format (e.g., 'MMM dd, yyyy hh:mm a')
 */
export function formatLocalizedDate(
    date: Date | string | number,
    timezone: Timezone,
    locale: LocaleCode = 'en',
    formatStr: string = 'MMM dd, yyyy hh:mm a'
): string {
    const locales = { en: enUS, kh: km };
    const parsedDate = typeof date === 'string' ? new Date(date) : new Date(date);
    const zonedDate = toZonedTime(parsedDate, timezone);

    return format(zonedDate, formatStr, {
        locale: locales[locale],
        timeZone: timezone,
    });
}

// Example: Pre-configured formatters for common cases
export const DateFormats = {
    en: (date: Date | string, timezone: Timezone = 'Asia/Phnom_Penh') =>
        formatLocalizedDate(date, timezone, 'en', 'MMM dd, yyyy hh:mm a'),
    kh: (date: Date | string, timezone: Timezone = 'Asia/Phnom_Penh') =>
        formatLocalizedDate(date, timezone, 'kh', 'MMM dd, yyyy hh:mm a'),
};