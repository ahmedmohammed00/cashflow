"use client";

import * as React from "react";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
    DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { CreditCard, DollarSign } from "lucide-react";
import type { CartItem } from "@/lib/types";

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
    const [isProcessing, setIsProcessing] = React.useState(false);

    // Prevent closing dialog while processing payment
    const handleOpenChange = (open: boolean) => {
        if (isProcessing && !open) {
            // Optionally confirm with user before closing
            if (!window.confirm("عملية الدفع جارية. هل أنت متأكد من الإلغاء؟")) {
                return;
            }
        }
        onOpenChange(open);
    };

    const handlePayment = async (method: "Cash" | "Card") => {
        setIsProcessing(true);
        try {
            // Simulate async payment processing delay
            await new Promise((resolve) => setTimeout(resolve, 1500));

            // Replace with real payment integration here
            console.log(`Processing payment of ${totalAmount.toFixed(2)} SAR via ${method}`);
            console.log("Cart Items:", cartItems);
            console.log("Order Notes:", orderNotes);

            onPaymentSuccess();
            onOpenChange(false);

            toast.success("تم الدفع بنجاح!", {
                description: `تم إنشاء إيصال للطلب رقم #${Math.floor(Math.random() * 10000)}.`,
                action: {
                    label: "عرض الإيصال",
                    onClick: () => {
                        // Replace with real receipt view logic
                        console.log("View receipt");
                        toast.dismiss();
                    },
                },
            });
        } catch (error) {
            console.error("Payment failed:", error);
            toast.error("فشل الدفع. يرجى المحاولة مرة أخرى.");
        } finally {
            setIsProcessing(false);
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={handleOpenChange} aria-busy={isProcessing}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle tabIndex={-1}>إتمام الدفع</DialogTitle>
                    <DialogDescription>اختر طريقة الدفع لإنهاء المعاملة.</DialogDescription>
                </DialogHeader>
                <div className="my-6 text-center">
                    <p className="text-muted-foreground">المبلغ الإجمالي</p>
                    <p className="text-5xl font-bold text-primary" aria-live="polite" aria-atomic="true">
                        {totalAmount.toLocaleString("ar-SA", { style: "currency", currency: "SAR" })}
                    </p>
                </div>
                <DialogFooter className="grid grid-cols-2 gap-4">
                    <Button
                        variant="outline"
                        size="lg"
                        onClick={() => handlePayment("Cash")}
                        disabled={isProcessing}
                        aria-label="الدفع نقداً"
                    >
                        <DollarSign className="rtl:mr-2 h-5 w-5" />
                        نقداً
                    </Button>
                    <Button
                        size="lg"
                        onClick={() => handlePayment("Card")}
                        disabled={isProcessing}
                        aria-label="الدفع ببطاقة"
                    >
                        <CreditCard className="rtl:mr-2 h-5 w-5" />
                        بطاقة
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}

