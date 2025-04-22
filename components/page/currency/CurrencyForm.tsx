'use client';
import {useForm} from 'react-hook-form';
import {useRouter} from "next/navigation";
import type {ApiResponse} from "@/types/BaseRespond";
import {useToast} from "@/hooks/useToast";
import Button from "@/components/ui/button/Button";
import Input from "@/components/form/input/InputField";
import {useTranslations} from "next-intl";

interface Currency {
    id?: number;
    code: string;
    name: string;
    rate: number;
}

interface CurrencyFormProps {
    currency?: Currency;
    onSubmitAction: (data: Currency) => Promise<ApiResponse<Currency | null>>;
}

export default function CurrencyForm({currency, onSubmitAction}: CurrencyFormProps) {
    const {
        register,
        handleSubmit,
        formState: {errors, isSubmitting}
    } = useForm({
        defaultValues: {
            code: currency?.code || '',
            name: currency?.name || '',
            rate: currency?.rate || 0
        }
    });

    const t = useTranslations('Currencies');
    const {showToast} = useToast();
    const router = useRouter();

    const onFormSubmit = async (data: Currency) => {
        try {
            const result = await onSubmitAction({
                ...data,
                id: currency?.id,
                rate: Number(data.rate) // Ensure rate is a number
            });

            if (result.status !== 200) {
                showToast(result.message, 'error');
            } else {
                showToast(
                    currency
                        ? 'Currency updated successfully'
                        : 'Currency created successfully',
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
            {/* Header and Currency Details */}
            <div className="bg-background rounded-t-xl p-6 border border-gray-200 rounded-2xl dark:border-gray-800">

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {/* Currency Code */}
                    <div className="space-y-2">
                        <label htmlFor="code" className="block text-sm font-medium text-muted-foreground">
                            {t('columns.symbol')}
                        </label>
                        <Input
                            {...register('code', {
                                required: t('validation.code'),
                            })}
                            error={!!errors.code}
                            hint={errors.code?.message}
                            id="code"
                            name="code"
                            placeholder="e.g. $, ៛"
                            className="w-full"
                        />
                    </div>

                    {/* Currency Name */}
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
                            placeholder="e.g. US Dollar, Euro"
                            className="w-full"
                        />
                    </div>

                    {/* Exchange Rate */}
                    <div className="space-y-2">
                        <label htmlFor="rate" className="block text-sm font-medium text-muted-foreground">
                            {t('columns.rate')}
                        </label>
                        <Input
                            {...register('rate', {
                                required: t('enter.rate'),
                                min: {
                                    value: 0.1,
                                    message: t('validation.rate')
                                },
                                valueAsNumber: true
                            })}
                            error={!!errors.rate}
                            hint={errors.rate?.message}
                            id="rate"
                            name="rate"
                            type="number"
                            step="0.0001"
                            placeholder="e.g. 4020.00"
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
                        ) : currency ? 'Update Currency' : 'Create Currency'}
                    </Button>
                </div>

            </div>
        </form>
    );
}