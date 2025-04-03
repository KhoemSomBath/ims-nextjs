'use client';
import {useEffect, useState} from 'react';
import type {Setting, SettingLabel, SettingValue} from '@/types/settings';
import type {ApiResponse} from "@/types/BaseRespond";
import Switch from "@/components/form/switch/Switch";
import Input from "@/components/form/input/InputField";
import {Table, TableBody, TableCell, TableHeader, TableRow} from "@/components/ui/table";
import {useToast} from "@/hooks/useToast";

interface SettingsClientProps {
    initialSettings: Record<SettingLabel, SettingValue>;
    updateSettingAction: (key: SettingLabel, value: SettingValue) => Promise<ApiResponse<Setting> | void>;
}

export default function Settings({
                                     initialSettings,
                                     updateSettingAction
                                 }: SettingsClientProps) {

    const [settings, setSettings] = useState(initialSettings);
    const [editingKey, setEditingKey] = useState<SettingLabel | null>(null);
    const [editValue, setEditValue] = useState<SettingValue>('');
    const [isLoading, setIsLoading] = useState(false);
    const [message, setMessage] = useState<{ text: string; type: 'success' | 'error' } | null>(null);
    const {showToast} = useToast();

    useEffect(() => {
        if (message) {
            const timer = setTimeout(() => setMessage(null), 5000);
            return () => clearTimeout(timer);
        }
    }, [message]);

    const handleSave = async (key: SettingLabel) => {
        try {
            setIsLoading(true);
            setMessage(null);

            const result = await updateSettingAction(key, editValue);
            if (result) {
                if (result.status === 200) {
                    setMessage({text: result.message, type: 'success'});
                    setSettings(prev => ({...prev, [key]: editValue}));
                    setEditingKey(null);
                    showToast(result.message, 'success')
                } else
                    showToast(result.message, 'error')

            }
        } catch (error) {
            setMessage({
                text: `Failed to update setting: ${error instanceof Error ? error.message : 'Unknown error'}`,
                type: 'error'
            });
        } finally {
            setIsLoading(false);
        }
    };

    const handleEdit = (key: SettingLabel) => {
        setEditingKey(key);
        setEditValue(settings[key]);
    };

    const handleCancel = () => {
        setEditingKey(null);
        setEditValue('');
    };

    const handleSwitchChange = (key: SettingLabel, checked: boolean) => {
        setEditValue(checked);
    };

    const renderInput = (key: SettingLabel) => {
        const settingType = typeof settings[key];
        const isEditing = editingKey === key;

        if (!isEditing) {
            return (
                <span className="px-3 py-1.5 rounded text-sm text-gray-800 dark:text-gray-200">
                    {String(settings[key])}
                </span>
            );
        }

        switch (settingType) {
            case 'boolean':
                return (
                    <Switch
                        label=""
                        defaultChecked={settings[key] as boolean}
                        onChange={(checked) => handleSwitchChange(key, checked)}
                    />
                );
            case 'number':
                return (
                    <Input
                        type="number"
                        defaultValue={settings[key] as number}
                        onChange={(e) => setEditValue(Number(e.target.value))}
                        className="w-32"
                    />
                );
            default:
                return (
                    <Input
                        type="text"
                        defaultValue={settings[key] as string}
                        onChange={(e) => setEditValue(e.target.value)}
                    />
                );
        }
    };

    return (
        <div className="rounded-lg p-6">

            <div className="overflow-x-auto">
                <Table className="divide-y divide-gray-200 dark:divide-gray-700">
                    <TableHeader>
                        <TableRow>
                            <TableCell isHeader
                                       className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                                Setting
                            </TableCell>
                            <TableCell isHeader
                                       className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                                Value
                            </TableCell>
                            <TableCell isHeader
                                       className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                                Actions
                            </TableCell>
                        </TableRow>
                    </TableHeader>
                    <TableBody className="divide-y divide-gray-200 dark:divide-gray-700">
                        {(Object.keys(settings) as SettingLabel[]).map((key) => (
                            <TableRow key={key}>
                                <TableCell
                                    className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                                    {key}
                                </TableCell>
                                <TableCell
                                    className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                                    {renderInput(key)}
                                </TableCell>
                                <TableCell
                                    className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                                    {editingKey === key ? (
                                        <div className="flex space-x-2">
                                            <button
                                                onClick={() => handleSave(key)}
                                                disabled={isLoading}
                                                className="px-3 py-1 bg-blue-600 hover:bg-blue-700 text-white rounded text-sm disabled:opacity-50 transition-colors"
                                            >
                                                {isLoading ? 'Saving...' : 'Save'}
                                            </button>
                                            <button
                                                onClick={handleCancel}
                                                className="px-3 py-1 bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-800 dark:text-gray-200 rounded text-sm transition-colors"
                                            >
                                                Cancel
                                            </button>
                                        </div>
                                    ) : (
                                        <button
                                            onClick={() => handleEdit(key)}
                                            className="px-3 py-1 bg-blue-600 hover:bg-blue-700 text-white rounded text-sm transition-colors"
                                        >
                                            Edit
                                        </button>
                                    )}
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>
        </div>
    );
}