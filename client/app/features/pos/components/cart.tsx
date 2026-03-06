"use client";

import * as React from 'react';
import { CreditCard, ShoppingCart, Tag } from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { Textarea } from '@/components/ui/textarea';
import type { CartItem } from '@/lib/types';
import { CartItem as CartItemComponent } from './cartItem';
import { PaymentDialog } from './paymentDialog';
import { VALID_COUPONS } from '../types';
import { formatSAR } from "@/lib/utils";

// ─── Sub-components ───────────────────────────────────────────────────────────

function EmptyCartMessage() {
    return (
        <div className="text-center text-muted-foreground py-16">
            <p>عربة التسوق فارغة.</p>
            <p className="text-sm">أضف المنتجات للبدء.</p>
        </div>
    );
}

interface OrderSummaryProps {
    subtotal: number;
    totalDiscount: number;
    total: number;
}

function OrderSummary({ subtotal, totalDiscount, total }: OrderSummaryProps) {
    return (
        <div className="space-y-2 text-sm">
            <div className="flex justify-between">
                <span>المجموع الفرعي</span>
                <span>{formatSAR(subtotal)}</span>
            </div>
            <div className="flex justify-between text-red-500">
                <span>الخصم</span>
                <span>-{formatSAR(totalDiscount)}</span>
            </div>
            <Separator />
            <div className="flex justify-between font-bold text-lg">
                <span>الإجمالي</span>
                <span>{formatSAR(total)}</span>
            </div>
        </div>
    );
}

interface CouponInputProps {
    code: string;
    onChange: (value: string) => void;
    onApply: () => void;
}

function CouponInput({ code, onChange, onApply }: CouponInputProps) {
    return (
        <div className="flex gap-2">
            <Input
                placeholder="أدخل رمز الكوبون"
                value={code}
                onChange={(e) => onChange(e.target.value)}
                className="h-10"
            />
            <Button onClick={onApply} variant="outline" className="h-10">
                <Tag className="ml-2 h-4 w-4" />
                تطبيق
            </Button>
        </div>
    );
}

// ─── Cart ─────────────────────────────────────────────────────────────────────

interface CartProps {
    cartItems: CartItem[];
    onUpdateQuantity: (productId: string, quantity: number) => void;
    onRemoveItem: (productId: string) => void;
    onClearCart: () => void;
}

export function Cart({ cartItems, onUpdateQuantity, onRemoveItem, onClearCart }: CartProps) {
    const [isPaymentOpen, setIsPaymentOpen] = React.useState(false);
    const [orderNotes, setOrderNotes] = React.useState('');
    const [couponCode, setCouponCode] = React.useState('');
    const [couponDiscount, setCouponDiscount] = React.useState(0);

    const subtotal = React.useMemo(
        () => cartItems.reduce((acc, item) => acc + item.product.price * item.quantity, 0),
        [cartItems]
    );

    const itemDiscounts = React.useMemo(
        () => cartItems.reduce((acc, item) => acc + (item.product.price * item.quantity * item.discount) / 100, 0),
        [cartItems]
    );

    const totalDiscount = itemDiscounts + (subtotal * couponDiscount) / 100;
    const total = subtotal - totalDiscount;

    const handleApplyCoupon = () => {
        const discount = VALID_COUPONS[couponCode.toUpperCase()];
        if (discount !== undefined) {
            setCouponDiscount(discount);
            toast.success('تم تطبيق الكوبون!', { description: `لقد وفرت ${discount}% على طلبك.` });
        } else {
            setCouponDiscount(0);
            toast.error('كوبون غير صالح', { description: 'رمز الكوبون الذي أدخلته غير صالح.' });
        }
    };

    const handlePaymentSuccess = () => {
        onClearCart();
        setOrderNotes('');
        setCouponCode('');
        setCouponDiscount(0);
    };

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
                                {cartItems.map((item, index) => (
                                    <li key={`${item.product.id}-${index}`}>
                                        <CartItemComponent
                                            item={item}
                                            onQuantityChange={onUpdateQuantity}
                                            onRemove={onRemoveItem}
                                        />
                                    </li>
                                ))}
                            </ul>
                        ) : (
                            <EmptyCartMessage />
                        )}
                    </CardContent>
                </ScrollArea>

                <CardFooter className="flex-col items-stretch gap-4 p-4 bg-background/50 flex-shrink-0">
                    <Textarea
                        placeholder="إضافة ملاحظة على الطلب..."
                        value={orderNotes}
                        onChange={(e) => setOrderNotes(e.target.value)}
                        rows={2}
                    />

                    <CouponInput
                        code={couponCode}
                        onChange={setCouponCode}
                        onApply={handleApplyCoupon}
                    />

                    <OrderSummary subtotal={subtotal} totalDiscount={totalDiscount} total={total} />

                    <Button
                        size="lg"
                        disabled={cartItems.length === 0}
                        onClick={() => setIsPaymentOpen(true)}
                        className="flex items-center justify-center gap-2"
                    >
                        <CreditCard className="h-5 w-5" />
                        إتمام الدفع
                    </Button>
                </CardFooter>
            </Card>

            <PaymentDialog
                isOpen={isPaymentOpen}
                onOpenChange={setIsPaymentOpen}
                totalAmount={total}
                cartItems={cartItems}
                orderNotes={orderNotes}
                onPaymentSuccess={handlePaymentSuccess}
            />
        </>
    );
}