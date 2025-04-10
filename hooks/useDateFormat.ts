// hooks/useDateFormat.ts
import { format } from 'date-fns-tz';
import { enUS, km } from 'date-fns/locale';
import { useLocale } from 'next-intl';
import {toKhmerNumerals} from "@/lib/utils";

const PHNOM_PENH_TIMEZONE = 'Asia/Phnom_Penh';

type DateFormatType = 'full' | 'date' | 'time' | 'month' | 'custom';

interface UseDateFormatOptions {
    formatStr?: string;
    includeTime?: boolean;
}



export default function useDateFormat() {
    const locale = useLocale() as 'en' | 'kh';

    /**
     * Format a date based on the current locale
     * @param date Date object, string, or timestamp
     * @param type Predefined format type or 'custom'
     * @param options Additional formatting options
     */
    const formatDate = (
        date: Date | string | number,
        type: DateFormatType = 'full',
        options?: UseDateFormatOptions
    ): string => {
        const dateObj = new Date(date);
        let formatString = '';

        switch (type) {
            case 'date':
                formatString = 'MMM dd, yyyy';
                break;
            case 'time':
                formatString = 'hh:mm a';
                break;
            case 'month':
                formatString = 'MMMM yyyy';
                break;
            case 'custom':
                formatString = options?.formatStr || 'MMM dd, yyyy';
                break;
            default: // 'full'
                formatString = options?.includeTime === false
                    ? 'MMM dd, yyyy'
                    : 'MMM dd, yyyy hh:mm a';
        }

        const formatted = format(dateObj, formatString, {
            locale: locale === 'en' ? enUS : km,
            timeZone: PHNOM_PENH_TIMEZONE,
        });

        return locale === 'kh' ? toKhmerNumerals(formatted) : formatted;
    };

    // Convenience methods
    const fullDateTime = (date: Date | string | number) => formatDate(date, 'full');
    const dateOnly = (date: Date | string | number) => formatDate(date, 'date');
    const timeOnly = (date: Date | string | number) => formatDate(date, 'time');
    const monthYear = (date: Date | string | number) => formatDate(date, 'month');
    const customFormat = (date: Date | string | number, formatStr: string) =>
        formatDate(date, 'custom', { formatStr });

    return {
        formatDate,
        fullDateTime,
        dateOnly,
        timeOnly,
        monthYear,
        customFormat,
    };
}