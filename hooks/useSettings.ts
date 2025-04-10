// hooks/useSettings.ts
'use client';

import { useState } from 'react';
import {SettingLabel, SettingValue} from "@/types/settings";

export function useSettings() {
    const [isLoading, setIsLoading] = useState(false);

    const updateSetting = async (label: SettingLabel, value: SettingValue) => {

        setIsLoading(true);
        try {
            const response = await fetch('/api/setting', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ label, value }),
            });

            if (!response.ok) {
                throw new Error('Failed to update setting');
            }

            return await response.json();
        } finally {
            setIsLoading(false);
        }
    };

    return { updateSetting, isLoading };
}