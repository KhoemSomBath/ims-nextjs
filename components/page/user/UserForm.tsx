'use client';

import {useForm} from 'react-hook-form';
import type {Role} from "@/types/Role";
import type {User} from "@/types/User";
import {useRouter} from "next/navigation";
import type {ApiResponse} from "@/types/BaseRespond";
import {useToast} from "@/hooks/useToast";
import Button from "@/components/ui/button/Button";
import Input from "@/components/form/input/InputField";
import Select from "@/components/form/Select";
import {useTranslations} from "next-intl";

interface UserFormProps {
    user?: User;
    allRoles: Role[];
    onSubmitAction: (data: {
        username: string;
        name: string;
        password?: string;
        roleId: number;
        status: boolean;
    }) => Promise<ApiResponse<User | null>>;
}

export default function UserForm({user, allRoles, onSubmitAction}: UserFormProps) {

    const t = useTranslations('Users');
    const commonT = useTranslations('Common');

    const {register, handleSubmit, formState: {errors, isSubmitting}} = useForm({
        defaultValues: {
            username: user?.username || '',
            name: user?.name || '',
            password: '',
            roleId: user?.role.id || '',
            status: user?.status ?? true
        }
    });

    const {showToast} = useToast();
    const router = useRouter();
    const isEditing = !!user;

    const onFormSubmit = async (data: {
        username: string;
        name: string;
        password: string;
        roleId: string | number;
        status: boolean;
    }) => {
        try {
            const submitData = {
                username: data.username,
                name: data.name,
                roleId: Number(data.roleId),
                status: data.status,
                // Only include password if it's a new user or if password field isn't empty
                ...(!isEditing || data.password ? {password: data.password} : {})
            };

            const result = await onSubmitAction(submitData);

            if (result.status !== 200) {
                showToast(result.message, 'error');
            } else {
                showToast(
                    result.message,
                    'success'
                );
                router.back();
            }
        } catch (err) {
            console.log(err)
        }
    };

    return (
        <form onSubmit={handleSubmit(onFormSubmit)} className="flex flex-col h-[80dvh] max-h-[80dvh]">
            {/* Header and Basic Info */}
            <div
                className="bg-background rounded-t-xl p-6 shadow-sm border border-gray-200 rounded-2xl dark:border-gray-800">

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                        <label htmlFor="username" className="block text-sm font-medium text-muted-foreground">
                            {t('columns.username')}
                        </label>
                        <Input
                            {...register('username', {
                                required: t('validation.username'),
                            })}
                            error={!!errors.username}
                            hint={errors.username?.message}
                            id="username"
                            name="username"
                            placeholder={t('enter.username')}
                            className="w-full"
                            disabled={isEditing}
                        />
                    </div>

                    <div className="space-y-2">
                        <label htmlFor="name" className="block text-sm font-medium text-muted-foreground">
                            {t('columns.name')}
                        </label>
                        <Input
                            {...register('name', {required: t('validation.name')})}
                            error={!!errors.name}
                            hint={errors.name?.message}
                            id="name"
                            name="name"
                            placeholder={t('enter.name')}
                            className="w-full"
                        />
                    </div>

                    {!isEditing && (
                        <div className="space-y-2">
                            <label htmlFor="password" className="block text-sm font-medium text-muted-foreground">
                                {t('columns.password')}
                            </label>
                            <Input
                                {...register('password', {
                                    required: !isEditing ? t('validation.password') : false,
                                })}
                                error={!!errors.password}
                                hint={errors.password?.message}
                                id="password"
                                name="password"
                                type="password"
                                placeholder={t('enter.password')}
                                className="w-full"
                            />
                        </div>
                    )}

                    {isEditing && (
                        <div className="space-y-2">
                            <label htmlFor="password" className="block text-sm font-medium text-muted-foreground">
                                {t('enter.new-password')}
                            </label>
                            <Input
                                {...register('password')}
                                error={!!errors.password}
                                hint={errors.password?.message}
                                id="password"
                                name="password"
                                type="password"
                                placeholder={t('enter.password')}
                                className="w-full"
                            />
                        </div>
                    )}

                    <div className="space-y-2">
                        <label htmlFor="roleId" className="block text-sm font-medium text-muted-foreground">
                            {t('columns.role')}
                        </label>

                        <Select
                            options={allRoles.map(role => ({
                                value: role.id.toString(),
                                label: role.name
                            }))}
                            defaultValue={user?.role.id.toString()}
                            placeholder={t('enter.role')}
                            register={register("roleId", {required: t('validation.role')})}
                            error={!!errors.roleId}
                            hint={errors.roleId?.message}
                        />

                    </div>
                </div>

                <div className="flex justify-end gap-3 mt-4">
                    <Button type="button" size="sm" variant="outline" onClick={() => router.back()}>
                        {commonT('back')}
                    </Button>
                    <Button type="submit" disabled={isSubmitting}>
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
                        ) : user ? t('update') : t('create')}
                    </Button>
                </div>
            </div>

        </form>
    );
}