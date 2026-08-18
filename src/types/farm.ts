// import type { ApprovalStatus } from "./batch";

export interface Certification {
    name: string;
    verified: boolean;
    image?: string;
    issued_date?: string;
}

export interface TrustMetric {
    label: string;
    percent: number;
}

export interface Farm {
    id: number;

    farmName: string;
    ownerName?: string;

    address?: string;
    description?: string;

    areaHa?: number;
    farmingMethod?: string;

    latitude?: number;
    longitude?: number;

    trustLevel?: "Low" | "Medium" | "High";

    coverImage?: string | null;

    createdAt?: string;
}
export interface FarmListItem {
    id: number;
    farmName: string;
    ownerName?: string;
    address?: string;
    description?: string;
    areaHa?: number;
    farmingMethod?: string;
    latitude?: number;
    longitude?: number;
    trustLevel?: "Low" | "Medium" | "High";
    coverImage: string | null;
}

export interface FarmDetail {
    id: number;
    farmName: string;
    ownerName?: string;
    address?: string;
    description?: string;
    areaHa?: number;
    farmingMethod?: string;
    trustLevel?: "Low" | "Medium" | "High";
    images: string[];
    totalProducts: number;
}