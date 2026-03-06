// features/pos/types.ts

export interface CartItem {
    id: string;
    quantity: number;
}

export interface CreateSalePayload {
    items: CartItem[];
    customer: {
        id: string;
    };
    paymentMethod: "cash" | "card" | "e-wallet";
    notes?: string;
    couponCode?: string;
}

export interface CreateSaleResponse {
    success: boolean;
    data?: {
        _id: string;
        orderId: string;
        total: number;
    };
    error?: string;
}