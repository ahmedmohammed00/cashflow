import type { Coupon } from "./types";

/** Fetch all coupons */
export async function fetchCoupons(token: string): Promise<Coupon[]> {
    try {
        const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5005";

        const response = await fetch(`${API_URL}/api/coupons`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                ...(token ? { Authorization: `Bearer ${token}` } : {}),
            },
            credentials: "include",
        });

        if (!response.ok) {
            throw new Error(`Failed to fetch coupons: ${response.status} ${response.statusText}`);
        }

        const result = await response.json();
        if (Array.isArray(result)) {
            return result as Coupon[];
        } else if (result.success && Array.isArray(result.data)) {
            return result.data as Coupon[];
        } else {
            console.error("Unexpected API response:", result);
            return [];
        }
    } catch (error) {
        console.error("Error fetching coupons:", error);
        return [];
    }
}
export async function addCoupon(data: Coupon, token: string) {
    try {
        const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5005";

        const res = await fetch(`${API_URL}/api/coupons`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify(data),
            credentials: "include",
        });

        if (!res.ok) {
            const errorData = await res.json();
            throw new Error(errorData.error || "Failed to create coupon");
        }

        return await res.json();
    } catch (error) {
        console.error("Error adding coupon:", error);
        throw error;
    }
}
