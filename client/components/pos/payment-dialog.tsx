
"use client";

import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
    DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { CreditCard, DollarSign } from 'lucide-react';
import type { CartItem } from '@/lib/types';

interface PaymentDialogProps {
    isOpen: boolean;
    onOpenChange: (isOpen: boolean) => void;
    totalAmount: number;
    cartItems: CartItem[];
    orderNotes?: string;
    onPaymentSuccess: () => void;
}

export function PaymentDialog({
                                  isOpen,
                                  onOpenChange,
                                  totalAmount,
                                  cartItems,
                                  orderNotes,
                                  onPaymentSuccess,
                              }: PaymentDialogProps) {

    const handlePayment = (method: 'Cash' | 'Card') => {
        // In a real app, this would integrate with a payment processor and save the sale to the DB
        console.log(`Processing payment of $${totalAmount.toFixed(2)} via ${method}`);
        console.log('Cart Items:', cartItems);
        console.log('Order Notes:', orderNotes);

        onPaymentSuccess();
        onOpenChange(false);

        toast.success('تم الدفع بنجاح!', {
            description: `تم إنشاء إيصال للطلب رقم #${Math.floor(
                Math.random() * 10000
            )}.`,
            action: {
                label: "عرض الإيصال",
                onClick: () => console.log('View receipt'),
            },
        });
    };

    return (
        <Dialog open={isOpen} onOpenChange={onOpenChange}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>إتمام الدفع</DialogTitle>
                    <DialogDescription>
                        اختر طريقة الدفع لإنهاء المعاملة.
                    </DialogDescription>
                </DialogHeader>
                <div className="my-6 text-center">
                    <p className="text-muted-foreground">المبلغ الإجمالي</p>
                    <p className="text-5xl font-bold text-primary">
                        {totalAmount.toLocaleString('ar-SA', { style: 'currency', currency: 'SAR' })}
                    </p>
                </div>
                <DialogFooter className="grid grid-cols-2 gap-4">
                    <Button
                        variant="outline"
                        size="lg"
                        onClick={() => handlePayment('Cash')}
                    >
                        <DollarSign className="ml-2 h-5 w-5" />
                        نقداً
                    </Button>
                    <Button size="lg" onClick={() => handlePayment('Card')}>
                        <CreditCard className="ml-2 h-5 w-5" />
                        بطاقة
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
