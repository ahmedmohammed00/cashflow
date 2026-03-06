// features/pos/services.ts

import { CreateSalePayload, CreateSaleResponse } from "./types";

export async function createSale(
    payload: CreateSalePayload
): Promise<CreateSaleResponse> {
    const res = await fetch("/api/sales", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify(payload),
    });

    const data = await res.json();

    if (!res.ok) {
        throw new Error(data.error || "Failed to create sale");
    }

    return data;
}
