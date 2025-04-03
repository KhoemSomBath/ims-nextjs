// Define a type for the API response
export interface ApiResponse<T> {
    data: T;
    status: number;
    message: string;
    paging: Paging
}

export interface Paging {
    page: number;
    size: number;
    totals: number;
    totalPage: number;
}

const defaultPaging: Paging = {
    page: 1,
    size: 10,
    totals: 0,
    totalPage: 0
};


export function initApiResponse<T>(
    data: T | null | undefined,
    message: string = '',
    status: number = 0,
    paging: Paging = defaultPaging
): ApiResponse<T | null> {
    return {
        data: data ?? null, // Convert undefined to null
        status,
        message,
        paging
    };
}