

export type ProductCategory = {
    id: string;
    name: string;
    productCount: number;
}

export type Product = {
    id: string;
    name: string;
    sku: string;
    barcode?: string;
    price: number;
    cost: number;
    stock: number;
    category: 'Drinks' | 'Snacks' | 'Electronics' | 'Apparel' | 'Books';
    unit: 'piece' | 'kg' | 'liter';
    imageUrl: string;
    'data-ai-hint'?: string;
};

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
