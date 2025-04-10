// components/LanguageButton.tsx
'use client';

import {useLocale} from 'next-intl';
import {useRouter} from 'next/navigation';
import {useSettings} from "@/hooks/useSettings";
import {SettingLabel} from "@/types/settings";

export default function LanguageButton() {
    const locale = useLocale();
    const router = useRouter();
    const { updateSetting } = useSettings();

    const switchLanguage = async () => {
        await updateSetting(SettingLabel.IMS_DEFAULT_LANGUAGE, locale === 'en' ? 'kh' : 'en');
        router.refresh();
    };


    return (
        <button
            onClick={switchLanguage}
            className="relative flex items-center justify-center text-gray-500 transition-colors bg-white border border-gray-200 rounded-full hover:text-dark-900 h-11 w-11 hover:bg-gray-100 hover:text-gray-700 dark:border-gray-800 dark:bg-gray-900 dark:text-gray-400 dark:hover:bg-gray-800 dark:hover:text-white"

            aria-label="Switch language"
        >
            {locale === 'en' ? 'EN' : 'KH'}
        </button>
    );
}