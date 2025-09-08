
"use client";

import { ColumnDef, Row, Column } from '@tanstack/react-table';
import type { Product, CartItem } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { ArrowUpDown, PlusCircle } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

type ColumnsProps = {
    onAddToCart: (product: Product) => void;
    cartItems: CartItem[];
};

export const columns = ({ onAddToCart, cartItems }: ColumnsProps): ColumnDef<Product>[] => [
    {
        accessorKey: 'name',
        header: ({ column }: { column: Column<Product> }) => {
            return (
                <Button
                    variant="ghost"
                    onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
                >
                    الاسم
                    <ArrowUpDown className="mr-2 h-4 w-4" />
                </Button>
            );
        },
    },
    {
        accessorKey: 'category',
        header: 'الفئة',
        cell: ({ row }: { row: Row<Product> }) => {
            return <Badge variant="outline">{row.original.category}</Badge>;
        },
        filterFn: (row: Row<Product>, id: string, value: string[]) => {
            return value.includes(row.getValue(id));
        },
    },
    {
        accessorKey: 'stock',
        header: ({ column }: { column: Column<Product> }) => (
            <div className="text-center">
                <Button
                    variant="ghost"
                    onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
                >
                    المخزون
                    <ArrowUpDown className="mr-2 h-4 w-4" />
                </Button>
            </div>
        ),
        cell: ({ row }: { row: Row<Product> }) => {
            const stock = row.original.stock;
            const variant = stock === 0 ? "destructive" : stock < 10 ? "secondary" : "default";
            return <div className="text-center"><Badge variant={variant} className={variant === 'default' ? 'bg-green-100 text-green-800' : ''}>{stock}</Badge></div>
        },
    },
    {
        accessorKey: 'price',
        header: ({ column }: { column: Column<Product> }) => {
            return (
                <div className="text-right">
                    <Button
                        variant="ghost"
                        onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
                    >
                        السعر
                        <ArrowUpDown className="mr-2 h-4 w-4" />
                    </Button>
                </div>
            );
        },
        cell: ({ row }: { row: Row<Product> }) => {
            const amount = parseFloat(row.getValue('price'));
            const formatted = new Intl.NumberFormat('ar-SA', {
                style: 'currency',
                currency: 'SAR',
            }).format(amount);

            return <div className="text-right font-medium">{formatted}</div>;
        },
    },
    {
        id: 'actions',
        cell: ({ row }: { row: Row<Product> }) => {
            const product = row.original;
            const cartItem = cartItems.find(item => item.product.id === product.id);
            const isOutOfStock = product.stock <= (cartItem?.quantity ?? 0);

            return (
                <div className="text-center">
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => onAddToCart(product)}
                        disabled={isOutOfStock}
                    >
                        <PlusCircle className="ml-2 h-4 w-4" />
                        إضافة
                    </Button>
                </div>
            );
        },
    },
];
