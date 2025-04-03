// hooks/useToast.ts
"use client";

import {CustomToast} from "@/components/common/CustomToas";
import {toast} from "react-hot-toast";

export function useToast() {

    const showToast = (
        message: string,
        type: 'success' | 'error' = 'success',
        duration?: number
    ) => {
        toast.custom((t) => (
            <CustomToast
                id={t.id}
                message={message}
                type={type}
                duration={duration || 5000}
            />
        ), {
            duration: duration || 5000,
        });
    };

    return { showToast };
}