export interface Currency {
    id: number;
    createdAt: string | Date;  // Can be string (ISO format) or Date object
    updatedAt: string | Date;
    version: number;
    deleted: string | null;    // Assuming this is a timestamp or null
    code: string;             // Currency code (e.g., "$", "USD")
    name: string;             // Currency name (e.g., "Dollar")
    rate: number;             // Exchange rate (e.g., 4020.0)
}