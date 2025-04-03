// setting-loader.ts
import {
    SettingLabel,
    type SettingValue,
    SETTING_DEFAULTS, SETTING_TYPES, type Setting,
} from '@/types/settings';
import 'server-only';
import {cache} from "react";
import type {ApiResponse} from "@/types/BaseRespond";

// Create a cached version of the fetch function
const cachedFetchSettings = cache(async (): Promise<Record<SettingLabel, SettingValue>> => {
    // Use defaults during build
    if (process.env.NEXT_PUBLIC_IS_BUILD_TIME) {
        return { ...SETTING_DEFAULTS };
    }

    const apiUrl = `${process.env.API_BASE_URL}/setting`;

    const response = await fetch(apiUrl, {
        headers: {
            'Content-Type': 'application/json',
            'Accept-Language': 'kh',
        },
        cache: "force-cache",
        next: { tags: ['settings'] }
    });

    if (!response.ok) {
        throw new Error(`Failed to fetch settings: HTTP ${response.status}`);
    }

    const { data } = await response.json() as {
        data: Array<{ label: SettingLabel; value: SettingValue }>
    };

    const settings: Record<SettingLabel, SettingValue> = { ...SETTING_DEFAULTS };
    data.forEach(item => {
        if (Object.values(SettingLabel).includes(item.label)) {
            settings[item.label] = parseValue(item.value, item.label);
        }
    });

    return settings;
});

// Helper function (moved outside class)
function parseValue(value: SettingValue, label: SettingLabel): SettingValue {
    const type = SETTING_TYPES[label];
    const defaultValue = SETTING_DEFAULTS[label];

    if (value === undefined || value === null) return defaultValue;

    try {
        switch (type) {
            case 'NUMBER':
                const num = Number(value);
                return isNaN(num) ? defaultValue : num;
            case 'BOOLEAN':
                if (typeof value === 'string') {
                    return value.toLowerCase() === 'true';
                }
                return Boolean(value);
            case 'STRING':
                return String(value);
            default:
                return defaultValue;
        }
    } catch {
        return defaultValue;
    }
}

class ServerSettings {
    private static instance: ServerSettings;
    private isInitialized = false;

    private constructor() {
        // Private constructor for singleton
    }

    public static getInstance(): ServerSettings {
        if (!ServerSettings.instance) {
            ServerSettings.instance = new ServerSettings();
        }
        return ServerSettings.instance;
    }

    public async getSettings(): Promise<Record<SettingLabel, SettingValue>> {
        const settings = await cachedFetchSettings();
        this.isInitialized = true;
        return settings;
    }

    public async ensureReady(): Promise<void> {
        if (!this.isInitialized) {
            await this.getSettings();
        }
    }

    public async forceRefresh(): Promise<void> {
        // Revalidate by calling the cached function again
        await cachedFetchSettings();
    }

    public async getSetting<T extends SettingValue>(label: SettingLabel): Promise<T> {
        const settings = await this.getSettings();
        return settings[label] as T;
    }

    public async getAllSettings(): Promise<Record<SettingLabel, SettingValue>> {
        return this.getSettings();
    }

    public async updateSetting(
        label: SettingLabel,
        value: SettingValue,
        persistToServer = false
    ): Promise<ApiResponse<Setting> | void> {
        if (!Object.values(SettingLabel).includes(label)) {
            throw new Error(`Invalid setting label: ${label}`);
        }

        if (persistToServer) {
            const response = await fetch(`${process.env.API_BASE_URL}/setting/${label}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept-Language': 'kh',
                },
                body: JSON.stringify({ value: value, version: 0, label: label }),
                next: {
                    tags: ['settings']
                }
            });

            if (!response.ok) {
                throw new Error(`Failed to update setting: HTTP ${response.status}`);
            }
            const respond = await response.json() as ApiResponse<Setting>;
            await this.forceRefresh();
            return respond;
        }
    }
}

const settings = ServerSettings.getInstance();

// Public API
export async function getSetting<T extends SettingValue>(label: SettingLabel): Promise<T> {
    return settings.getSetting<T>(label);
}

export async function getAllSettings(): Promise<Record<SettingLabel, SettingValue>> {
    return settings.getAllSettings();
}

export async function updateSetting(
    label: SettingLabel,
    value: SettingValue,
    persistToServer = false
): Promise<ApiResponse<Setting> | void> {
    return settings.updateSetting(label, value, persistToServer);
}

export async function refreshSettings(): Promise<void> {
    return settings.forceRefresh();
}

export async function ensureSettingsInitialized(): Promise<void> {
    return settings.ensureReady();
}