"use client";

import * as React from "react";
import { CreditCard, DollarSign, Loader2 } from "lucide-react";
import { toast } from "sonner";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import type { CartItem } from "@/lib/types";
import { formatSAR } from "@/lib/utils";

type PaymentMethod = "Cash" | "Card";

interface PaymentDialogProps {
    isOpen: boolean;
    onOpenChange: (isOpen: boolean) => void;
    totalAmount: number;
    cartItems: CartItem[];
    orderNotes?: string;
    onPaymentSuccess: () => void;
}

// ─── Sub-components ───────────────────────────────────────────────────────────

function AmountDisplay({ amount }: { amount: number }) {
    return (
        <div className="my-6 text-center">
            <p className="text-muted-foreground">المبلغ الإجمالي</p>
            <p
                className="text-5xl font-bold text-primary"
                aria-live="polite"
                aria-atomic="true"
            >
                {formatSAR(amount)}
            </p>
        </div>
    );
}

interface PaymentButtonProps {
    method: PaymentMethod;
    isProcessing: boolean;
    onClick: () => void;
}

function PaymentButton({ method, isProcessing, onClick }: PaymentButtonProps) {
    const isCash = method === "Cash";
    const label = isCash ? "نقداً" : "بطاقة";
    const Icon = isCash ? DollarSign : CreditCard;

    return (
        <Button
            variant={isCash ? "outline" : "default"}
            size="lg"
            onClick={onClick}
            disabled={isProcessing}
            aria-label={`الدفع ${label}`}
        >
            {isProcessing ? (
                <Loader2 className="rtl:mr-2 h-5 w-5 animate-spin" />
            ) : (
                <Icon className="rtl:mr-2 h-5 w-5" />
            )}
            {label}
        </Button>
    );
}

// ─── PaymentDialog ────────────────────────────────────────────────────────────

export function PaymentDialog({
                                  isOpen,
                                  onOpenChange,
                                  totalAmount,
                                  cartItems,
                                  orderNotes,
                                  onPaymentSuccess,
                              }: PaymentDialogProps) {
    const [isProcessing, setIsProcessing] = React.useState(false);

    const handleOpenChange = (open: boolean) => {
        if (isProcessing && !open) {
            if (!window.confirm("عملية الدفع جارية. هل أنت متأكد من الإلغاء؟")) return;
        }
        onOpenChange(open);
    };

    const handlePayment = async (method: PaymentMethod) => {
        setIsProcessing(true);
        try {
            await new Promise((resolve) => setTimeout(resolve, 1500));

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

                <AmountDisplay amount={totalAmount} />

                <DialogFooter className="grid grid-cols-2 gap-4">
                    <PaymentButton method="Cash" isProcessing={isProcessing} onClick={() => handlePayment("Cash")} />
                    <PaymentButton method="Card" isProcessing={isProcessing} onClick={() => handlePayment("Card")} />
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}