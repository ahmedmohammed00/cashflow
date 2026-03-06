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

export const CATEGORY_LABELS: Record<string, string> = {
    Drinks: 'مشروبات',
    Snacks: 'وجبات خفيفة',
    Electronics: 'إلكترونيات',
    Apparel: 'ملابس',
    Books: 'كتب',
};

export const COLUMN_LABELS: Record<string, string> = {
    name: 'الاسم',
    category: 'الفئة',
    stock: 'المخزون',
    price: 'السعر',
};

export const VALID_COUPONS: Record<string, number> = {
    SAVE10: 10,
};