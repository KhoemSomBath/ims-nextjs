import {getRequestConfig} from 'next-intl/server';
import {getSetting} from "@/lib/setting-loader";
import {SettingLabel} from "@/types/settings";

export default getRequestConfig(async () => {
    const locale = await getSetting<string>(SettingLabel.IMS_DEFAULT_LANGUAGE)

    return {
        locale,
        messages: (await import(`../messages/${locale}.json`)).default
    };
});