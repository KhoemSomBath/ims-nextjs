'use client';

import {useForm} from 'react-hook-form';
import {useRouter} from "next/navigation";
import type {ApiResponse} from "@/types/BaseRespond";
import {useToast} from "@/hooks/useToast";
import Button from "@/components/ui/button/Button";
import Input from "@/components/form/input/InputField";
import {Category} from "@/types/Category";
import {useTranslations} from "use-intl";

interface CategoryFormProps {
    category?: Category;
    onSubmitAction: (data: {
        name: string;
        description: string;
    }) => Promise<ApiResponse<Category | null>>;
}

export default function CategoryForm({category, onSubmitAction}: CategoryFormProps) {
    const {register, handleSubmit, formState: {errors, isSubmitting}} = useForm({
        defaultValues: {
            name: category?.name || '',
            description: category?.description || '',
        }
    });

    const {showToast} = useToast();
    const router = useRouter();
    const t = useTranslations('Categories');
    const commonT = useTranslations('Common');

    const onFormSubmit = async (data: {
        name: string;
        description: string;
    }) => {
        try {
            const result = await onSubmitAction(data);

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
            console.log(err);
            showToast('An unexpected error occurred', 'error');
        }
    };

    return (
        <form onSubmit={handleSubmit(onFormSubmit)} className="flex flex-col h-[80dvh] max-h-[80dvh]">
            <div
                className="bg-background rounded-t-xl p-6 shadow-sm border border-gray-200 rounded-2xl dark:border-gray-800">
                <div className="grid grid-cols-1 gap-6">
                    <div className="space-y-2">
                        <label htmlFor="name" className="block text-sm font-medium text-muted-foreground">
                            {t('columns.name')}
                        </label>
                        <Input
                            {...register('name', {
                                required: t('validation.name_required'),
                            })}
                            error={!!errors.name}
                            hint={errors.name?.message}
                            id="name"
                            name="name"
                            placeholder="Enter category name"
                            className="w-full"
                        />
                    </div>

                    <div className="space-y-2">
                        <label htmlFor="description" className="block text-sm font-medium text-muted-foreground">
                            {t('columns.description')}
                        </label>
                        <Input
                            {...register('description', {
                                required: t('validation.description_required')
                            })}
                            error={!!errors.description}
                            hint={errors.description?.message}
                            id="description"
                            name="description"
                            placeholder="Enter category description"
                            className="w-full"
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
                        ) : category ? t('update') : t('create')}
                    </Button>
                </div>
            </div>
        </form>
    );
}