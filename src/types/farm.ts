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
    sellerId?: number | null;
    farmName: string;
    ownerName?: string;

    address?: string;
    description?: string;
    areaHa?: number;
    farmingMethod?: string;
    latitude?: number;
    longitude?: number;
    trustLevel?: "Low" | "Medium" | "High";
    status?: "pending" | "approved" | "rejected";
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
    status?: "pending" | "approved" | "rejected";
    createdAt?: string;
    farmImages?: string[];
    certificates?: string[];
}
export interface AdminFarmListResponse {
    data: {
        id: number;
        farm_name: string;
        address?: string;
        description?: string;
        status: "pending" | "approved" | "rejected";
        image: string | null;
        seller_id: number | null;
        area_ha: number | null;
    }[];

    total: number;
    page: number;
    limit: number;
    totalPages: number;
}
export interface MyCertification {
    id: number;
    name: string;
    image: string;
    verified: boolean;
}

export interface MyFarm {
    id: number;
    farm_name: string;
    owner_name?: string | null;
    address?: string | null;
    description?: string | null;
    area_ha?: number | null;
    farming_method?: string | null;
    status: "pending" | "approved" | "rejected";
    image: string | null;
    certifications: MyCertification[];
}

export interface FarmPayload {
    farm_name: string;
    owner_name?: string;
    address?: string;
    description?: string;
    area_ha?: number;
    farming_method?: string;
}
export interface FarmImageItem {
    id: number;
    url: string;
    type: "Farm" | "Certifi";
}

export interface MyFarmProfile {
    id: number;
    farm_name: string;
    owner_name: string;
    address: string;
    description: string;
    area_ha: number | null;
    farming_method: string;
    status: "pending" | "approved" | "rejected";
    cover: FarmImageItem | null;
    certificates: FarmImageItem[];
}