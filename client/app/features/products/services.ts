import type { Product } from "@/lib/types";
import { cookies } from "next/headers";

export async function getProducts(): Promise<Product[]> {
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;

    if (!token) {
        throw new Error("Unauthorized");
    }

    const res = await fetch("http://localhost:5005/api/products", {
        headers: {
            Authorization: `Bearer ${token}`,
        },
        cache: "no-store",
    });

    if (!res.ok) {
        throw new Error("Failed to fetch products");
    }

    const json = await res.json();
    console.log(json); // check if this is an array or { data: [...] }
    return Array.isArray(json) ? json : (json.data ?? json.products ?? []);}