"use client";

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Minus, Plus, Trash2 } from 'lucide-react';
import type { CartItem } from '@/lib/types';
import { formatSAR } from "@/lib/utils";

interface CartItemProps {
    item: CartItem;
    onQuantityChange: (productId: string, quantity: number) => void;
    onRemove: (productId: string) => void;
}

function QuantityControl({
                             item,
                             onQuantityChange,
                         }: Pick<CartItemProps, 'item' | 'onQuantityChange'>) {
    const { product, quantity } = item;

    return (
        <div className="flex items-center gap-2 mt-2">
            <Button
                variant="outline"
                size="icon"
                className="h-8 w-8"
                onClick={() => onQuantityChange(product.id, quantity - 1)}
            >
                <Minus className="h-4 w-4" />
            </Button>

            <Input
                type="number"
                value={quantity}
                onChange={(e) => onQuantityChange(product.id, parseInt(e.target.value) || 0)}
                onBlur={(e) => {
                    if (parseInt(e.target.value) < 1) onQuantityChange(product.id, 1);
                }}
                max={product.stock}
                className="w-14 h-8 text-center"
            />

            <Button
                variant="outline"
                size="icon"
                className="h-8 w-8"
                onClick={() => onQuantityChange(product.id, quantity + 1)}
                disabled={quantity >= product.stock}
            >
                <Plus className="h-4 w-4" />
            </Button>
        </div>
    );
}

export function CartItem({ item, onQuantityChange, onRemove }: CartItemProps) {
    const lineTotal = item.product.price * item.quantity;

    return (
        <div className="flex items-start gap-4">
            <div className="flex-grow">
                <p className="font-semibold leading-tight">{item.product.name}</p>
                <p className="text-sm text-muted-foreground">
                    {formatSAR(item.product.price)}
                </p>
                <QuantityControl item={item} onQuantityChange={onQuantityChange} />
            </div>

            <div className="text-right flex flex-col items-end">
                <p className="font-semibold">{formatSAR(lineTotal)}</p>
                <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 text-muted-foreground hover:text-destructive"
                    onClick={() => onRemove(item.product.id)}
                >
                    <Trash2 className="h-4 w-4" />
                </Button>
            </div>
        </div>
    );
}