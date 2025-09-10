'use client';

import * as React from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';
import { Save, X } from 'lucide-react';
import { Separator } from '@/components/ui/separator';
import type { Resolver } from 'react-hook-form';

// Zod schema for form validation
const productSchema = z.object({
    name: z.string().min(3, { message: "يجب أن يكون الاسم 3 أحرف على الأقل." }),
    sku: z.string().min(3, { message: "يجب أن يكون SKU 3 أحرف على الأقل." }),
    barcode: z.string().optional(),
    price: z.coerce.number().positive({ message: "يجب أن يكون السعر رقمًا موجبًا." }),
    cost: z.coerce.number().positive({ message: "يجب أن تكون التكلفة رقمًا موجبًا." }),
    category: z.enum(['Drinks', 'Snacks', 'Electronics', 'Apparel', 'Books']),
    unit: z.enum(['piece', 'kg', 'liter']),
    stock: z.coerce.number().min(0, { message: "لا يمكن أن يكون المخزون سالبًا." }),
});

type ProductFormData = z.infer<typeof productSchema>;

export default function NewProductPage() {
    const router = useRouter();
    const resolver = zodResolver(productSchema) as Resolver<ProductFormData>;

    const form = useForm<ProductFormData>({
        resolver,
        defaultValues: {
            name: '',
            sku: '',
            barcode: '',
            price: 0,
            cost: 0,
            stock: 0,
            category: 'Snacks',
            unit: 'piece',
        }
    });

    const onSubmit = async (data: ProductFormData) => {
        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/products`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data),
            });

            if (!response.ok) {
                throw new Error('Failed to create product');
            }

            const newProduct = await response.json();
            toast.success("تم إنشاء المنتج بنجاح!", {
                description: `تمت إضافة ${newProduct.name} إلى المنتجات.`,
            });
            router.push('/admin/products');
            router.refresh(); // To show the new product in the table
        } catch (error) {
            console.error("Creation failed:", error);
            toast.error("خطأ", {
                description: "فشل إنشاء المنتج. الرجاء المحاولة مرة أخرى.",
            });
        }
    };

    const handleCancel = () => {
        router.push('/admin/products');
    }

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="w-full space-y-6">
                <div className="flex justify-between items-center mb-6">
                    <h1 className="text-3xl font-bold">إضافة منتج جديد</h1>
                    <div className='flex gap-2'>
                        <Button type="button" variant="outline" onClick={handleCancel}>
                            <X className="ml-2 h-4 w-4" />
                            إلغاء
                        </Button>
                        <Button type="submit">
                            <Save className="ml-2 h-4 w-4" />
                            حفظ المنتج
                        </Button>
                    </div>
                </div>

                <Card>
                    <CardHeader>
                        <CardTitle>تفاصيل المنتج</CardTitle>
                        <CardDescription>
                            املأ الحقول أدناه لإنشاء منتج جديد.
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            <FormField control={form.control} name="name" render={({ field }) => (
                                <FormItem className="md:col-span-2 lg:col-span-3">
                                    <FormLabel>اسم المنتج</FormLabel>
                                    <FormControl><Input {...field} placeholder="مثال: قهوة" /></FormControl>
                                    <FormMessage />
                                </FormItem>
                            )} />
                        </div>
                        <Separator />
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            <FormField control={form.control} name="sku" render={({ field }) => (
                                <FormItem>
                                    <FormLabel>SKU</FormLabel>
                                    <FormControl><Input {...field} /></FormControl>
                                    <FormMessage />
                                </FormItem>
                            )} />
                            <FormField control={form.control} name="barcode" render={({ field }) => (
                                <FormItem>
                                    <FormLabel>الباركود</FormLabel>
                                    <FormControl><Input {...field} /></FormControl>
                                    <FormMessage />
                                </FormItem>
                            )} />
                            <FormField control={form.control} name="category" render={({ field }) => (
                                <FormItem>
                                    <FormLabel>الفئة</FormLabel>
                                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                                        <FormControl>
                                            <SelectTrigger><SelectValue /></SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            <SelectItem value="Drinks">مشروبات</SelectItem>
                                            <SelectItem value="Snacks">وجبات خفيفة</SelectItem>
                                            <SelectItem value="Electronics">إلكترونيات</SelectItem>
                                            <SelectItem value="Apparel">ملابس</SelectItem>
                                            <SelectItem value="Books">كتب</SelectItem>
                                        </SelectContent>
                                    </Select>
                                    <FormMessage />
                                </FormItem>
                            )} />
                        </div>
                        <Separator />
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <FormField control={form.control} name="price" render={({ field }) => (
                                <FormItem>
                                    <FormLabel>السعر (SAR)</FormLabel>
                                    <FormControl><Input type="number" step="0.01" {...field} /></FormControl>
                                    <FormMessage />
                                </FormItem>
                            )} />
                            <FormField control={form.control} name="cost" render={({ field }) => (
                                <FormItem>
                                    <FormLabel>التكلفة (SAR)</FormLabel>
                                    <FormControl><Input type="number" step="0.01" {...field} /></FormControl>
                                    <FormMessage />
                                </FormItem>
                            )} />
                            <FormField control={form.control} name="stock" render={({ field }) => (
                                <FormItem>
                                    <FormLabel>المخزون</FormLabel>
                                    <FormControl><Input type="number" {...field} /></FormControl>
                                    <FormMessage />
                                </FormItem>
                            )} />
                            <FormField control={form.control} name="unit" render={({ field }) => (
                                <FormItem>
                                    <FormLabel>وحدة القياس</FormLabel>
                                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                                        <FormControl>
                                            <SelectTrigger><SelectValue /></SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            <SelectItem value="piece">قطعة</SelectItem>
                                            <SelectItem value="kg">كجم</SelectItem>
                                            <SelectItem value="liter">لتر</SelectItem>
                                        </SelectContent>
                                    </Select>
                                    <FormMessage />
                                </FormItem>
                            )} />
                        </div>
                    </CardContent>
                </Card>
            </form>
        </Form>
    );
}


