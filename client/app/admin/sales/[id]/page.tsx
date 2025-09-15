
import type { Sale } from '@/lib/types';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { notFound } from 'next/navigation';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { ArrowRight, CreditCard, DollarSign, StickyNote } from 'lucide-react';
import { format } from 'date-fns';
import { ar } from 'date-fns/locale';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Separator } from '@/components/ui/separator';

async function getSale(id: string): Promise<Sale | undefined> {
    await new Promise(resolve => setTimeout(resolve, 100));
    return mockSales.find(s => s.id === id);
}


// Mock function to get items for a sale
async function getSaleItems(saleId: string) {
    await new Promise(resolve => setTimeout(resolve, 100));
    // In a real app, you would fetch this from your database based on the saleId.
    // For this mock, we'll just return a few random products.
    return [
        { product: mockProducts[0], quantity: 2, price: mockProducts[0].price },
        { product: mockProducts[2], quantity: 1, price: mockProducts[2].price },
    ];
}


export default async function SaleDetailsPage({ params }: { params: { id: string } }) {
    const sale = await getSale(params.id);

    if (!sale) {
        notFound();
    }

    const items = await getSaleItems(params.id);

    const statusTranslations: Record<Sale['status'], string> = {
        Completed: "مكتمل",
        Pending: "قيد الانتظار",
        Refunded: "مسترد",
    };
    const statusVariant = {
        Completed: "default",
        Pending: "secondary",
        Refunded: "destructive",
    }[sale.status] as "default" | "secondary" | "destructive" | "outline" | null | undefined;

    const subtotal = items.reduce((acc, item) => acc + item.price * item.quantity, 0);


    return (
        <div className="w-full">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold">تفاصيل البيع</h1>
                <Button asChild>
                    <Link href="/admin/sales">
                        <ArrowRight className="ml-2 h-4 w-4" />
                        العودة إلى المبيعات
                    </Link>
                </Button>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 space-y-6">
                    <Card>
                        <CardHeader>
                            <CardTitle>المنتجات المباعة</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>المنتج</TableHead>
                                        <TableHead className="text-center">الكمية</TableHead>
                                        <TableHead className="text-center">السعر</TableHead>
                                        <TableHead className="text-right">الإجمالي</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {items.map(item => (
                                        <TableRow key={item.product.id}>
                                            <TableCell>{item.product.name}</TableCell>
                                            <TableCell className="text-center">{item.quantity}</TableCell>
                                            <TableCell className="text-center">{item.price.toLocaleString('ar-SA', { style: 'currency', currency: 'SAR' })}</TableCell>
                                            <TableCell className="text-right">{(item.price * item.quantity).toLocaleString('ar-SA', { style: 'currency', currency: 'SAR' })}</TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                            <Separator className="my-4" />
                            <div className="space-y-2 text-sm pr-4">
                                <div className="flex justify-end gap-16">
                                    <span>المجموع الفرعي</span>
                                    <span>{subtotal.toLocaleString('ar-SA', { style: 'currency', currency: 'SAR' })}</span>
                                </div>
                                <div className="flex justify-end gap-16">
                                    <span>الخصومات</span>
                                    <span>-{(subtotal - sale.total).toLocaleString('ar-SA', { style: 'currency', currency: 'SAR' })}</span>
                                </div>
                                <div className="flex justify-end gap-16 font-bold text-lg">
                                    <span>الإجمالي</span>
                                    <span>{sale.total.toLocaleString('ar-SA', { style: 'currency', currency: 'SAR' })}</span>
                                </div>
                            </div>

                        </CardContent>
                    </Card>
                    {sale.notes && (
                        <Card>
                            <CardHeader>
                                <CardTitle className='flex items-center gap-2'>
                                    <StickyNote className="h-5 w-5" />
                                    ملاحظات الطلب
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p className="text-muted-foreground">{sale.notes}</p>
                            </CardContent>
                        </Card>
                    )}
                </div>
                <div className="lg:col-span-1 space-y-6">
                    <Card>
                        <CardHeader>
                            <CardTitle>ملخص البيع</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4 text-sm">
                            <div className="flex justify-between">
                                <span className="text-muted-foreground">معرف البيع</span>
                                <span className="font-mono">{sale.id}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-muted-foreground">التاريخ</span>
                                <span>{format(sale.date, "PPP p", { locale: ar })}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-muted-foreground">الحالة</span>
                                <Badge variant={statusVariant}>{statusTranslations[sale.status]}</Badge>
                            </div>
                            <div className="flex justify-between items-center">
                                <span className="text-muted-foreground">طريقة الدفع</span>
                                <div className="flex items-center gap-1">
                                    {sale.paymentMethod === 'Card' ? <CreditCard className="h-4 w-4" /> : <DollarSign className="h-4 w-4" />}
                                    <span>{sale.paymentMethod === 'Card' ? 'بطاقة' : 'نقداً'}</span>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}
