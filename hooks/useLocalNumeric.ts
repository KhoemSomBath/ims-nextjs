// hooks/useLocalNumeric.ts

import { useLocale } from 'next-intl';
import {toKhmerNumerals} from "@/lib/utils";


export default function LocalNumeric() {
    const locale = useLocale() as 'en' | 'kh';

    const toLocalNumeric = (
        str: string | number,
    ): string => {
        const formatString = str + '';
        switch (locale) {
            case 'kh':
                return toKhmerNumerals(formatString)
            default:
                return formatString;
        }
    };


    return {
        toLocalNumeric,
    };
}