'use client';
import React, {useMemo, useState} from 'react';
import {useForm} from 'react-hook-form';
import type {Permission, Role} from "@/types/Role";
import {useRouter} from "next/navigation";
import type {ApiResponse} from "@/types/BaseRespond";
import {useToast} from "@/hooks/useToast";
import Checkbox from "@/components/form/input/Checkbox";
import Button from "@/components/ui/button/Button";
import Input from "@/components/form/input/InputField";
import {useTranslations} from "use-intl"; // Import the Input component

interface RoleFormProps {
    role?: Role;
    allPermissions: Permission[];
    onSubmitAction: (data: {
        name: string;
        permissionIds: number[];
    }) => Promise<ApiResponse<Role | null>>;
}

export default function RoleForm({role, allPermissions, onSubmitAction}: RoleFormProps) {

    const t = useTranslations('Roles');
    const commonT = useTranslations('Common');

    const {register, handleSubmit, formState: {errors, isSubmitting}} = useForm({
        defaultValues: {
            name: role?.name || '',
            permissionIds: role?.permissions.map(p => p.id) || []
        }
    });

    const [selectedPermissions, setSelectedPermissions] = useState<number[]>(
        role?.permissions.map(p => p.id) || []
    );
    const [error, setError] = useState<string | null>(null);
    const {showToast} = useToast();
    const router = useRouter();

    // Group and sort permissions by module
    const groupedPermissions = useMemo(() => {
        const groups = allPermissions.reduce((acc, permission) => {
            if (!acc[permission.module]) {
                acc[permission.module] = [];
            }
            acc[permission.module].push(permission);
            return acc;
        }, {} as Record<string, Permission[]>);

        return Object.entries(groups).sort((a, b) => b[1].length - a[1].length);
    }, [allPermissions]);

    const handlePermissionToggle = (permissionId: number) => {
        setSelectedPermissions(prev =>
            prev.includes(permissionId)
                ? prev.filter(id => id !== permissionId)
                : [...prev, permissionId]
        );
    };

    const onFormSubmit = async (data: { name: string }) => {
        setError(null);
        try {
            const result = await onSubmitAction({
                name: data.name,
                permissionIds: selectedPermissions,
            });

            if (result.status != 200) {
                showToast(result.message, 'error');
            } else {
                showToast(result.message, 'success');
                router.back();
            }
        } catch (err) {
            setError(err instanceof Error ? err.message : 'An unknown error occurred');
        }
    };

    return (
        <form onSubmit={handleSubmit(onFormSubmit)} className="flex flex-col h-[80dvh] max-h-[80dvh]">
            {/* Header and Role Name */}
            <div
                className="bg-background rounded-t-xl p-6 shadow-sm border border-gray-200 rounded-2xl dark:border-gray-800 ">

                <div className="space-y-2">
                    <label htmlFor="name" className="block text-sm font-medium text-muted-foreground">
                        {t('columns.name')} {t('columns.role')}
                    </label>
                    <Input
                        {...register('name', {required: t('validation.name')})}
                        error={!!errors.name}
                        hint={errors.name?.message}
                        id="name"
                        name="name"
                        defaultValue={role?.name || ''}
                        placeholder={t('enter.name')}
                        className="w-full"
                    />
                </div>
            </div>

            {/* Scrollable Permissions Section */}
            <div className="flex-1 overflow-y-auto border mt-4 mb-4 border-gray-200 rounded-2xl dark:border-gray-800 ">
                <div className="p-6">
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="text-lg font-semibold text-foreground">
                            {t('columns.permission')}
                        </h2>
                        <span className="text-sm text-muted-foreground">
                            {selectedPermissions.length} {t('selected')}
                        </span>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {groupedPermissions.map(([module, permissions]) => (
                            <div key={module} className="space-y-4">
                                <div className="flex items-center gap-3">
                                    <div className="h-8 w-1 bg-primary rounded-full"></div>
                                    <h3 className="text-base font-medium text-foreground">
                                        {module}
                                    </h3>
                                </div>
                                <div className="space-y-3 ml-4">
                                    {permissions.map((permission) => (
                                        <div key={permission.id} className="flex items-center">
                                            <Checkbox
                                                label={permission.name}
                                                checked={selectedPermissions.includes(permission.id)}
                                                onChange={() => handlePermissionToggle(permission.id)}
                                                className="peer"
                                            />
                                        </div>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Footer with Actions */}
            <div className="rounded-b-xl p-6 shadow-sm border border-gray-200 rounded-2xl dark:border-gray-800 ">
                {error && (
                    <div className="mb-4 text-destructive text-sm">{error}</div>
                )}
                <div className="flex justify-end gap-3">
                    <Button type="button" size="sm" variant="outline" onClick={() => router.back()}>
                        {commonT('back')}
                    </Button>
                    <Button
                        disabled={isSubmitting}
                    >
                        {isSubmitting ? (
                            <>
                                <svg className="animate-spin h-4 w-4 text-current" xmlns="http://www.w3.org/2000/svg"
                                     fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor"
                                            strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor"
                                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                                Processing...
                            </>
                        ) : role ? t('update') : t('create')}
                    </Button>
                </div>
            </div>
        </form>
    );
}