export enum SettingLabel {
    IMS_NAME = 'IMS_NAME',
    IMS_VERSION = 'IMS_VERSION',
    IMS_TIMEZONE = 'IMS_TIMEZONE',
    IMS_CURRENCY = 'IMS_CURRENCY',
    IMS_DEFAULT_LANGUAGE = 'IMS_DEFAULT_LANGUAGE',
    IMS_MAX_LOGIN_ATTEMPTS = 'IMS_MAX_LOGIN_ATTEMPTS',
    IMS_SESSION_TIMEOUT = 'IMS_SESSION_TIMEOUT',
    IMS_TELEGRAM_NOTIFICATIONS_ENABLED = 'IMS_TELEGRAM_NOTIFICATIONS_ENABLED',
    IMS_DEFAULT_PAGE_SIZE = 'IMS_DEFAULT_PAGE_SIZE',
    IMS_TAX_RATE = 'IMS_TAX_RATE',
    IMS_RETURN_POLICY_DAYS = 'IMS_RETURN_POLICY_DAYS',
    IMS_INVENTORY_LOW_STOCK_THRESHOLD = 'IMS_INVENTORY_LOW_STOCK_THRESHOLD',
    IMS_MAINTENANCE_MODE = 'IMS_MAINTENANCE_MODE',
}

export type SettingValue = string | number | boolean;

export interface Setting {
    id: number;
    version: number;
    label: SettingLabel;
    value: SettingValue;
}

// Default values for each setting
export const SETTING_DEFAULTS: Record<SettingLabel, SettingValue> = {
    [SettingLabel.IMS_NAME]: 'Inventory Management System',
    [SettingLabel.IMS_VERSION]: '1.0.0',
    [SettingLabel.IMS_TIMEZONE]: 'UTC',
    [SettingLabel.IMS_CURRENCY]: 'USD',
    [SettingLabel.IMS_DEFAULT_LANGUAGE]: 'en',
    [SettingLabel.IMS_MAX_LOGIN_ATTEMPTS]: 5,
    [SettingLabel.IMS_SESSION_TIMEOUT]: 30,
    [SettingLabel.IMS_TELEGRAM_NOTIFICATIONS_ENABLED]: false,
    [SettingLabel.IMS_DEFAULT_PAGE_SIZE]: 20,
    [SettingLabel.IMS_TAX_RATE]: 0.1,
    [SettingLabel.IMS_RETURN_POLICY_DAYS]: 30,
    [SettingLabel.IMS_INVENTORY_LOW_STOCK_THRESHOLD]: 10,
    [SettingLabel.IMS_MAINTENANCE_MODE]: false,
};

// Type mapping for settings
export const SETTING_TYPES: Record<SettingLabel, 'STRING' | 'NUMBER' | 'BOOLEAN'> = {
    [SettingLabel.IMS_NAME]: 'STRING',
    [SettingLabel.IMS_VERSION]: 'STRING',
    [SettingLabel.IMS_TIMEZONE]: 'STRING',
    [SettingLabel.IMS_CURRENCY]: 'STRING',
    [SettingLabel.IMS_DEFAULT_LANGUAGE]: 'STRING',
    [SettingLabel.IMS_MAX_LOGIN_ATTEMPTS]: 'NUMBER',
    [SettingLabel.IMS_SESSION_TIMEOUT]: 'NUMBER',
    [SettingLabel.IMS_TELEGRAM_NOTIFICATIONS_ENABLED]: 'BOOLEAN',
    [SettingLabel.IMS_DEFAULT_PAGE_SIZE]: 'NUMBER',
    [SettingLabel.IMS_TAX_RATE]: 'NUMBER',
    [SettingLabel.IMS_RETURN_POLICY_DAYS]: 'NUMBER',
    [SettingLabel.IMS_INVENTORY_LOW_STOCK_THRESHOLD]: 'NUMBER',
    [SettingLabel.IMS_MAINTENANCE_MODE]: 'BOOLEAN',
};