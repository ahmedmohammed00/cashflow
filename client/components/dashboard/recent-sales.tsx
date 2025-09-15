
'use client';

import * as React from 'react';
import Link from 'next/link';
// import { sales as mockSales } from '@/lib/data';
import type { Sale } from '@/lib/types';
import { Skeleton } from '@/components/ui/skeleton';

async function getRecentSales(): Promise<Sale[]> {
    await new Promise((resolve) => setTimeout(resolve, 50));
    // return mockSales.sort((a, b) => b.date.getTime() - a.date.getTime()).slice(0, 5);
    return [];
}

export function RecentSales() {
    const [recentSales, setRecentSales] = React.useState<Sale[]>([]);
    const [isLoading, setIsLoading] = React.useState(true);

    React.useEffect(() => {
        const fetchSales = async () => {
            setIsLoading(true);
            const sales = await getRecentSales();
            setRecentSales(sales);
            setIsLoading(false);
        };
        fetchSales();
    }, []);

    if (isLoading) {
        return (
            <div className="space-y-6">
                {[...Array(5)].map((_, i) => (
                    <div className="flex items-center" key={i}>
                        <div className="ml-4 space-y-2">
                            <Skeleton className="h-4 w-[100px]" />
                            <Skeleton className="h-3 w-[150px]" />
                        </div>
                        <Skeleton className="mr-auto h-4 w-[50px]" />
                    </div>
                ))}
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {recentSales.map((sale) => (
                <div className="flex items-center" key={sale.id}>
                    <div className="ml-4 space-y-1">
                        <Link href={`/admin/sales/${sale.id}`} className="text-sm font-medium leading-none hover:underline font-mono">
                            {sale.id}
                        </Link>
                        <p className="text-sm text-muted-foreground">{new Date(sale.date).toLocaleDateString('ar-SA')}</p>
                    </div>
                    <div className="mr-auto font-medium">
                        {sale.total.toLocaleString('ar-SA', {
                            style: 'currency',
                            currency: 'SAR',
                        })}
                    </div>
                </div>
            ))}
        </div>
    );
}
