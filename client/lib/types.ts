
export type RegisterFormValues = {

    name: string;
    email: string;
    password: string;
    organizationName: string;
    mobileNumber: string;

};
export type LoginFormValues = {
    email: string;
    password: string;
};

export type ProductCategory = {
    id: string;
    name: string;
    productCount: number;
}

export interface Product {
    id: string;
    name: string;
    sku: string;
    price: number;
    cost: number;
    stock: number;
    categoryId: string;
    supplier: string;
}


export type CartItem = {
    product: Product;
    quantity: number;
    discount: number; // as a percentage, e.g., 10 for 10%
};

    export type Coupon = {
        id: string;
        code: string;
        discount: number; // as a percentage
        active: boolean;
        expiresAt: Date | null;
        usageLimit: number | null;
        usageCount: number;
    };

type CouponFormData = {
    code: string;
    discount: number;
    active: boolean;
    expiresAt?: Date | null;
    usageLimit?: number | null;
};


export type SaleItem = {
    productId: string;
    productName: string;
    quantity: number;
    priceAtSale: number;
}

export type Sale = {
    id: string;
    date: Date;
    itemCount: number;
    items: SaleItem[];
    subtotal: number;
    discountAmount: number;
    total: number;
    status: 'Completed' | 'Pending' | 'Refunded';
    paymentMethod: 'Card' | 'Cash';
    notes?: string;
};
