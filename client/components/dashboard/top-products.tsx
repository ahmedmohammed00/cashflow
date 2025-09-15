
'use client';

import * as React from 'react';
import Link from 'next/link';
import type { Product } from '@/lib/types';
import { Skeleton } from '@/components/ui/skeleton';
import { Badge } from '@/components/ui/badge';

// In a real app, this data would come from an API based on sales data
async function getTopProducts(): Promise<(Product & { sales: number })[]> {
    await new Promise((resolve) => setTimeout(resolve, 50));
    /*
    return mockProducts
        .slice(0, 5)
        .map((p, i) => ({ ...p, sales: Math.floor(Math.random() * (100 - i * 10)) + 10 }))
        .sort((a, b) => b.sales - a.sales);

     */
    return []
}

export function TopProducts() {
    const [topProducts, setTopProducts] = React.useState<(Product & { sales: number })[]>([]);
    const [isLoading, setIsLoading] = React.useState(true);

    React.useEffect(() => {
        const fetchProducts = async () => {
            setIsLoading(true);
            const products = await getTopProducts();
            setTopProducts(products);
            setIsLoading(false);
        };
        fetchProducts();
    }, []);

    if (isLoading) {
        return (
            <div className="space-y-6">
                {[...Array(5)].map((_, i) => (
                    <div className="flex items-center" key={i}>
                        <div className="space-y-2">
                            <Skeleton className="h-4 w-[150px]" />
                            <Skeleton className="h-3 w-[100px]" />
                        </div>
                        <Skeleton className="mr-auto h-6 w-12 rounded-full" />
                    </div>
                ))}
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {topProducts.map((product) => (
                <div className="flex items-center" key={product.id}>
                    <div className="space-y-1">
                        <Link href={`/admin/products/${product.id}`} className="text-sm font-medium leading-none hover:underline">
                            {product.name}
                        </Link>
                        <p className="text-sm text-muted-foreground">{product.sku}</p>
                    </div>
                    <div className="mr-auto font-medium">
                        <Badge variant="secondary">{product.sales} مبيعات</Badge>
                    </div>
                </div>
            ))}
        </div>
    );
}
