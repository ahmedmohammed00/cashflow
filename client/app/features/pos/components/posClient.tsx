'use client';

import * as React from 'react';
import { Smartphone } from 'lucide-react';
import { toast } from 'sonner';
import { DataTable } from '@/components/pos/product-table/data-table';
import { columns } from '@/components/pos/product-table/columns';
import { Cart } from '@/components/pos/cart';
import type { CartItem, Product } from '@/lib/types';

interface PosClientProps {
    products: Product[];
}

export function PosClient({ products }: PosClientProps) {
    const [cartItems, setCartItems] = React.useState<CartItem[]>([]);

    const handleAddToCart = (product: Product) => {
        setCartItems((prev) => {
            const existing = prev.find((i) => i.product.id === product.id);

            if (existing) {
                if (existing.quantity < product.stock) {
                    return prev.map((i) =>
                        i.product.id === product.id ? { ...i, quantity: i.quantity + 1 } : i
                    );
                }
                toast.error('نفذ المخزون', { description: `لا يمكن إضافة المزيد من ${product.name}.` });
                return prev;
            }

            if (product.stock > 0) return [...prev, { product, quantity: 1, discount: 0 }];

            toast.error('نفذ المخزون', { description: `${product.name} غير متوفر في المخزون.` });
            return prev;
        });
    };

    const handleUpdateQuantity = (productId: string, quantity: number) => {
        setCartItems((prev) => {
            const item = prev.find((i) => i.product.id === productId);
            if (!item) return prev;

            if (quantity <= 0) return prev.filter((i) => i.product.id !== productId);

            if (quantity > item.product.stock) {
                toast.error('الكمية غير متوفرة', {
                    description: `يتوفر فقط ${item.product.stock} من ${item.product.name} في المخزون.`,
                });
                return prev.map((i) =>
                    i.product.id === productId ? { ...i, quantity: item.product.stock } : i
                );
            }

            return prev.map((i) =>
                i.product.id === productId ? { ...i, quantity } : i
            );
        });
    };

    const handleRemoveItem = (productId: string) =>
        setCartItems((prev) => prev.filter((i) => i.product.id !== productId));

    const handleClearCart = () => setCartItems([]);

    return (
        <>
            <div className="flex-1">
                <div className="flex items-center justify-between mb-4">
                    <h1 className="text-2xl font-bold">نقطة البيع</h1>
                    <div className="flex items-center gap-2">
                        <Smartphone className="h-5 w-5" />
                        <span className="text-sm font-medium">POS</span>
                    </div>
                </div>

                <DataTable
                    columns={columns({ onAddToCart: handleAddToCart, cartItems })}
                    data={products}
                />
            </div>

            <div className="md:col-span-1 xl:col-span-1 border-l bg-card">
                <Cart
                    cartItems={cartItems}
                    onUpdateQuantity={handleUpdateQuantity}
                    onRemoveItem={handleRemoveItem}
                    onClearCart={handleClearCart}
                />
            </div>
        </>
    );
}