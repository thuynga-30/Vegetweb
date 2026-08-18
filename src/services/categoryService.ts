import api from "@/lib/axios";
import type { Category } from "@/types/category";

export const categoryService = {
    getAll: () =>
        api.get("/categories") as Promise<Category[]>,
};