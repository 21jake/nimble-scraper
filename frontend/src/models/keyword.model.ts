import { IBatch } from "./batch.model";

export interface IKeyword {
    id: number;
    name: string;
    fileName?: string | null;
    success: boolean | null;
    proxy: string | null;
    error: string | null;
    totalLinks: string | null;
    totalAds: string | null;
    totalResults: string | null;
    searchTime: string | null;
    // createdDate: Date 
    createdDate: Date | string;
    // batchId: number;
    // batch: IBatch;
}