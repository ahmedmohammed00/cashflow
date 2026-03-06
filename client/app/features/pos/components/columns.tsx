'use client';

import { ColumnDef } from '@tanstack/react-table';
import type { Product, CartItem } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ArrowUpDown, PlusCircle } from 'lucide-react';
import { formatSAR } from '@/lib/utils';
import { CATEGORY_LABELS } from '../types';

interface ColumnsConfig {
    onAddToCart: (product: Product) => void;
    cartItems: CartItem[];
}

function SortableHeader({ label, column, align = 'left' }: { label: string; column: any; align?: 'left' | 'right' | 'center' }) {
    return (
        <div className={`text-${align}`}>
            <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}>
                {label}
                <ArrowUpDown className="mr-2 h-4 w-4" />
            </Button>
        </div>
    );
}

function StockBadge({ stock }: { stock: number }) {
    const variant = stock === 0 ? 'destructive' : stock < 10 ? 'secondary' : 'default';
    return (
        <div className="text-center">
            <Badge variant={variant} className={variant === 'default' ? 'bg-green-100 text-green-800' : ''}>
                {stock}
            </Badge>
        </div>
    );
}

function AddToCartButton({ product, cartItems, onAddToCart }: { product: Product; cartItems: CartItem[]; onAddToCart: (product: Product) => void }) {
    const cartItem = cartItems.find((item) => item.product.id === product.id);
    const isOutOfStock = product.stock <= (cartItem?.quantity ?? 0);
    return (
        <div className="text-center">
            <Button variant="outline" size="sm" onClick={() => onAddToCart(product)} disabled={isOutOfStock}>
                <PlusCircle className="ml-2 h-4 w-4" />
                إضافة
            </Button>
        </div>
    );
}

export const columns = ({ onAddToCart, cartItems }: ColumnsConfig): ColumnDef<Product>[] => [
    {
        accessorKey: 'name',
        header: ({ column }) => <SortableHeader label="الاسم" column={column} />,
    },
    {
        accessorKey: 'categoryId',
        header: 'الفئة',
        cell: ({ row }) => <Badge variant="outline">{CATEGORY_LABELS[row.original.categoryId] ?? row.original.categoryId}</Badge>,
        filterFn: (row, id, value: string[]) => value.includes(row.getValue(id)),
    },
    {
        accessorKey: 'stock',
        header: ({ column }) => <SortableHeader label="المخزون" column={column} align="center" />,
        cell: ({ row }) => <StockBadge stock={row.original.stock} />,
    },
    {
        accessorKey: 'price',
        header: ({ column }) => <SortableHeader label="السعر" column={column} align="right" />,
        cell: ({ row }) => <div className="text-right font-medium">{formatSAR(parseFloat(row.getValue('price')))}</div>,
    },
    {
        id: 'actions',
        cell: ({ row }) => <AddToCartButton product={row.original} cartItems={cartItems} onAddToCart={onAddToCart} />,
    },
];