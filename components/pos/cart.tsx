
"use client";

import * as React from 'react';
import type { CartItem } from '@/lib/types';
import { CartItem as CartItemComponent } from './cart-item';
import { Button } from '@/components/ui/button';
import {
    Card,
    CardContent,
    CardFooter,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { CreditCard, ShoppingCart, Tag } from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { PaymentDialog } from './payment-dialog';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';
import { Textarea } from '../ui/textarea';

interface CartProps {
    cartItems: CartItem[];
    onUpdateCart: (items: CartItem[]) => void;
    onClearCart: () => void;
}

export function Cart({ cartItems, onUpdateCart, onClearCart }: CartProps) {
    const [isPaymentDialogOpen, setIsPaymentDialogOpen] = React.useState(false);
    const [couponCode, setCouponCode] = React.useState('');
    const [couponDiscount, setCouponDiscount] = React.useState(0);
    const [orderNotes, setOrderNotes] = React.useState('');

    const handleQuantityChange = (productId: string, quantity: number) => {
        const item = cartItems.find((item) => item.product.id === productId);
        if (!item) return;

        if (quantity <= 0) {
            onUpdateCart(cartItems.filter((i) => i.product.id !== productId));
        } else if (quantity > item.product.stock) {
            toast.error("الكمية غير متوفرة", {
                description: `يتوفر فقط ${item.product.stock} من ${item.product.name} في المخزون.`,
            });
            onUpdateCart(
                cartItems.map((i) =>
                    i.product.id === productId ? { ...i, quantity: item.product.stock } : i
                )
            );
        } else {
            onUpdateCart(
                cartItems.map((i) =>
                    i.product.id === productId ? { ...i, quantity } : i
                )
            );
        }
    };

    const handleRemoveItem = (productId: string) => {
        onUpdateCart(cartItems.filter((item) => item.product.id !== productId));
    };

    const subtotal = React.useMemo(() => {
        return cartItems.reduce(
            (acc, item) => acc + item.product.price * item.quantity,
            0
        );
    }, [cartItems]);

    const itemDiscounts = React.useMemo(() => {
        return cartItems.reduce(
            (acc, item) => acc + (item.product.price * item.quantity * item.discount) / 100,
            0
        );
    }, [cartItems]);

    const totalDiscount = itemDiscounts + (subtotal * couponDiscount / 100);

    const total = subtotal - totalDiscount;

    const handleApplyCoupon = () => {
        // In a real app, you'd look this up from a DB
        if (couponCode.toUpperCase() === 'SAVE10') {
            setCouponDiscount(10);
            toast.success("تم تطبيق الكوبون!", {
                description: "لقد وفرت 10% على طلبك."
            })
        } else {
            setCouponDiscount(0);
            toast.error("كوبون غير صالح", {
                description: "رمز الكوبون الذي أدخلته غير صالح."
            })
        }
    };

    const handleClear = () => {
        onClearCart();
        setOrderNotes('');
        setCouponCode('');
        setCouponDiscount(0);
    }


    return (
        <>
            <Card className="flex flex-col h-full rounded-none border-0 border-r shadow-none">
                <CardHeader className="flex-shrink-0">
                    <CardTitle className="flex items-center gap-2">
                        <ShoppingCart className="h-6 w-6" />
                        الطلب الحالي
                    </CardTitle>
                </CardHeader>
                <ScrollArea className="flex-grow">
                    <CardContent className="p-4">
                        {cartItems.length > 0 ? (
                            <ul className="space-y-4">
                                {cartItems.map((item) => (
                                    <li key={item.product.id}>
                                        <CartItemComponent
                                            item={item}
                                            onQuantityChange={handleQuantityChange}
                                            onRemove={handleRemoveItem}
                                        />
                                    </li>
                                ))}
                            </ul>
                        ) : (
                            <div className="text-center text-muted-foreground py-16">
                                <p>عربة التسوق فارغة.</p>
                                <p className="text-sm">أضف المنتجات للبدء.</p>
                            </div>
                        )}
                    </CardContent>
                </ScrollArea>
                <CardFooter className="flex-col items-stretch gap-4 p-4 bg-background/50 flex-shrink-0">
                    <div className="space-y-2">
                        <Textarea
                            placeholder="إضافة ملاحظة على الطلب..."
                            value={orderNotes}
                            onChange={(e) => setOrderNotes(e.target.value)}
                            rows={2}
                        />
                    </div>
                    <div className="flex gap-2">
                        <Input
                            placeholder="أدخل رمز الكوبون"
                            value={couponCode}
                            onChange={(e) => setCouponCode(e.target.value)}
                            className="h-10"
                        />
                        <Button onClick={handleApplyCoupon} variant="outline" className="h-10">
                            <Tag className="ml-2 h-4 w-4"/>
                            تطبيق
                        </Button>
                    </div>
                    <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                            <span>المجموع الفرعي</span>
                            <span>{subtotal.toLocaleString('ar-SA', { style: 'currency', currency: 'SAR' })}</span>
                        </div>
                        <div className="flex justify-between text-red-500">
                            <span>الخصم</span>
                            <span>-{totalDiscount.toLocaleString('ar-SA', { style: 'currency', currency: 'SAR' })}</span>
                        </div>
                        <Separator />
                        <div className="flex justify-between font-bold text-lg">
                            <span>الإجمالي</span>
                            <span>{total.toLocaleString('ar-SA', { style: 'currency', currency: 'SAR' })}</span>
                        </div>
                    </div>
                    <Button
                        size="lg"
                        disabled={cartItems.length === 0}
                        onClick={() => setIsPaymentDialogOpen(true)}
                        className="flex items-center justify-center gap-2"
                    >
                        <CreditCard className="h-5 w-5" />
                        إتمام الدفع
                    </Button>
                </CardFooter>
            </Card>
            <PaymentDialog
                isOpen={isPaymentDialogOpen}
                onOpenChange={setIsPaymentDialogOpen}
                totalAmount={total}
                cartItems={cartItems}
                orderNotes={orderNotes}
                onPaymentSuccess={handleClear}
            />
        </>
    );
}
