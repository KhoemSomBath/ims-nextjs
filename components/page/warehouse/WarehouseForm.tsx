'use client';
import {useForm} from 'react-hook-form';
import {useRouter} from "next/navigation";
import type {ApiResponse} from "@/types/BaseRespond";
import {useToast} from "@/hooks/useToast";
import Button from "@/components/ui/button/Button";
import Input from "@/components/form/input/InputField";
import {useTranslations} from "next-intl";
import type {Warehouse} from "@/types/Warehouse";

interface WarehouseFormProps {
    warehouse?: Warehouse;
    onSubmitAction: (data: Omit<Warehouse, 'id' | 'version' | 'createdAt' | 'updatedAt'>) => Promise<ApiResponse<Warehouse | null>>;
}

export default function WarehouseForm({warehouse, onSubmitAction}: WarehouseFormProps) {
    const {
        register,
        handleSubmit,
        formState: {errors, isSubmitting}
    } = useForm({
        defaultValues: {
            name: warehouse?.name || '',
            location: warehouse?.location || ''
        }
    });

    const t = useTranslations('Warehouse');
    const {showToast} = useToast();
    const router = useRouter();

    const onFormSubmit = async (data: Omit<Warehouse, 'id' | 'version' | 'createdAt' | 'updatedAt'>) => {
        try {
            const result = await onSubmitAction({
                ...data,
            });

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
            showToast('An error occurred while processing your request', 'error');
        }
    };

    return (
        <form onSubmit={handleSubmit(onFormSubmit)} className="flex flex-col h-[80dvh] max-h-[80dvh]">
            {/* Header and Warehouse Details */}
            <div className="bg-background rounded-t-xl p-6 border border-gray-200 rounded-2xl dark:border-gray-800">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Warehouse Name */}
                    <div className="space-y-2">
                        <label htmlFor="name" className="block text-sm font-medium text-muted-foreground">
                            {t('columns.name')}
                        </label>
                        <Input
                            {...register('name', {
                                required: t('validation.name'),
                            })}
                            error={!!errors.name}
                            hint={errors.name?.message}
                            id="name"
                            name="name"
                            placeholder="e.g. Main Warehouse, Regional Storage"
                            className="w-full"
                        />
                    </div>

                    {/* Warehouse Location */}
                    <div className="space-y-2">
                        <label htmlFor="location" className="block text-sm font-medium text-muted-foreground">
                            {t('columns.location')}
                        </label>
                        <Input
                            {...register('location', {required: t('validation.location')})}
                            error={!!errors.location}
                            hint={errors.location?.message}
                            id="location"
                            name="location"
                            placeholder="e.g. Building A, 123 Main St"
                            className="w-full"
                        />
                    </div>
                </div>

                <div className="flex justify-end gap-3 mt-4">
                    <Button
                        type="button"
                        size="sm"
                        variant="outline"
                        onClick={() => router.back()}
                    >
                        Back
                    </Button>
                    <Button
                        type="submit"
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
                        ) : warehouse ? 'Update Warehouse' : 'Create Warehouse'}
                    </Button>
                </div>
            </div>
        </form>
    );
}