
'use client';

import * as React from 'react';
import { Cart } from '@/components/pos/cart';
import type { CartItem, Product } from '@/lib/types';
import { DataTable } from '@/components/pos/product-table/data-table';
import { columns } from '@/components/pos/product-table/columns';
import { Smartphone, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { Skeleton } from '@/components/ui/skeleton';

async function getProducts(): Promise<Product[]> {
    try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/products`, { cache: 'no-store' });
        if (!res.ok) {
            throw new Error('Failed to fetch products');
        }
        return await res.json();
    } catch (error) {
        console.error(error);
        return [];
    }
}

function ProductTableSkeleton() {
    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between">
                <div className="flex flex-1 items-center space-x-2">
                    <Skeleton className="h-8 w-[150px] lg:w-[250px]" />
                    <Skeleton className="h-8 w-[150px]" />
                </div>
                <Skeleton className="h-8 w-20" />
            </div>
            <div className="rounded-md border">
                <div className="p-4 space-y-3">
                    <Skeleton className="h-8 w-full" />
                    <Skeleton className="h-8 w-full" />
                    <Skeleton className="h-8 w-full" />
                    <Skeleton className="h-8 w-full" />
                    <Skeleton className="h-8 w-full" />
                </div>
            </div>
        </div>
    )
}

export default function PosPage() {
    const [products, setProducts] = React.useState<Product[]>([]);
    const [cartItems, setCartItems] = React.useState<CartItem[]>([]);
    const [isLoading, setIsLoading] = React.useState(true);

    React.useEffect(() => {
        const fetchProducts = async () => {
            setIsLoading(true);
            const fetchedProducts = await getProducts();
            setProducts(fetchedProducts);
            setIsLoading(false);
        };
        fetchProducts();
    }, []);

    const handleAddToCart = (product: Product) => {
        setCartItems((prevItems) => {
            const existingItem = prevItems.find(
                (item) => item.product.id === product.id
            );

            if (existingItem) {
                if (existingItem.quantity < product.stock) {
                    return prevItems.map((item) =>
                        item.product.id === product.id
                            ? { ...item, quantity: item.quantity + 1 }
                            : item
                    );
                } else {
                    toast.error("نفذ المخزون", {
                        description: `لا يمكن إضافة المزيد من ${product.name}.`,
                    });
                    return prevItems;
                }
            } else {
                if (product.stock > 0) {
                    return [...prevItems, { product, quantity: 1, discount: 0 }];
                } else {
                    toast.error("نفذ المخزون", {
                        description: `${product.name} غير متوفر في المخزون.`,
                    });
                    return prevItems;
                }
            }
        });
    };

    const handleUpdateCart = (updatedItems: CartItem[]) => {
        setCartItems(updatedItems);
    };

    const handleClearCart = () => {
        setCartItems([]);
    };

    return (
        <>
            <div className="hidden md:grid md:grid-cols-3 xl:grid-cols-4 h-[calc(100vh-4rem)]">
                <div className="md:col-span-2 xl:col-span-3 p-4 md:p-6 overflow-y-auto">
                    {isLoading ? (
                        <ProductTableSkeleton />
                    ) : (
                        <DataTable columns={columns({ onAddToCart: handleAddToCart, cartItems })} data={products} />
                    )}
                </div>
                <div className="md:col-span-1 xl:col-span-1 border-l bg-card">
                    <Cart
                        cartItems={cartItems}
                        onUpdateCart={handleUpdateCart}
                        onClearCart={handleClearCart}
                    />
                </div>
            </div>
            <div className="md:hidden flex flex-col items-center justify-center h-[calc(100vh-4rem)] text-center p-4">
                <Smartphone className="h-16 w-16 mb-4 text-muted-foreground" />
                <h2 className="text-2xl font-bold mb-2">
                    واجهة نقاط البيع غير متاحة على الهاتف المحمول
                </h2>
                <p className="text-muted-foreground">
                    يرجى استخدام جهاز لوحي أو كمبيوتر مكتبي للوصول إلى هذه الصفحة.
                </p>
            </div>
        </>
    );
}
