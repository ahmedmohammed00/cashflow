
'use client';

import * as React from 'react';
import type { Coupon } from '@/lib/types';
import { notFound, useRouter, useParams } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage, FormDescription } from '@/components/ui/form';
import { toast } from 'sonner';
import { ArrowRight, Edit, Save, X, Calendar as CalendarIcon } from 'lucide-react';
import { Switch } from '@/components/ui/switch';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { format } from 'date-fns';
import { ar } from 'date-fns/locale';
import { cn } from '@/lib/utils';
import { Checkbox } from '@/components/ui/checkbox';

// Zod schema for form validation
const couponSchema = z.object({
    code: z.string().min(3, { message: "يجب أن يكون الرمز 3 أحرف على الأقل." }).toUpperCase(),
    discount: z.coerce.number().min(0, "لا يمكن أن يكون الخصم سالبًا.").max(100, "لا يمكن أن يتجاوز الخصم 100٪."),
    active: z.boolean().default(true),
    expiresAt: z.date().nullable(),
    usageLimit: z.coerce.number().positive().nullable(),
});

type CouponFormData = z.infer<typeof couponSchema>;

async function getCoupon(id: string): Promise<Coupon | undefined> {
    // In a real app, you would fetch from a database.
    await new Promise(resolve => setTimeout(resolve, 50));
    return []
}

export default function CouponDetailsPage() {
    const params = useParams();
    const id = Array.isArray(params.id) ? params.id[0] : params.id;
    const [coupon, setCoupon] = React.useState<Coupon | null>(null);
    const [isEditing, setIsEditing] = React.useState(false);
    const [isLoading, setIsLoading] = React.useState(true);
    const router = useRouter();

    const [noExpiry, setNoExpiry] = React.useState(true);
    const [unlimitedUsage, setUnlimitedUsage] = React.useState(true);

    const form = useForm<CouponFormData>({
        resolver: zodResolver(couponSchema),
        defaultValues: {
            code: '',
            discount: 0,
            active: false,
            expiresAt: null,
            usageLimit: null,
        }
    });

    React.useEffect(() => {
        const fetchCoupon = async () => {
            if (!id) return;
            setIsLoading(true);
            const fetchedCoupon = await getCoupon(id);
            if (fetchedCoupon) {
                setCoupon(fetchedCoupon);
                form.reset({
                    ...fetchedCoupon,
                });
                setNoExpiry(fetchedCoupon.expiresAt === null);
                setUnlimitedUsage(fetchedCoupon.usageLimit === null);
            }
            setIsLoading(false);
        };
        fetchCoupon();
    }, [id, form]);

    if (isLoading) {
        return <div>جاري التحميل...</div>;
    }

    if (!coupon) {
        notFound();
    }

    const onSubmit = (data: CouponFormData) => {
        const finalData = {
            ...data,
            expiresAt: noExpiry ? null : data.expiresAt,
            usageLimit: unlimitedUsage ? null : data.usageLimit
        }
        console.log("Updated Coupon Data:", finalData);
        // In a real app, you'd send this to your API to update the database
        toast.success("تم حفظ الكوبون بنجاح!", {
            description: `تم تحديث تفاصيل ${data.code}.`,
        });
        setIsEditing(false);
        // You might want to update the local state to reflect the saved data
        setCoupon(prev => prev ? { ...prev, ...finalData, usageCount: prev.usageCount } : null);
    };

    const handleCancel = () => {
        if (coupon) {
            form.reset({ ...coupon });
            setNoExpiry(coupon.expiresAt === null);
            setUnlimitedUsage(coupon.usageLimit === null);
        }
        setIsEditing(false);
    }

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="w-full space-y-6">
                <div className="flex justify-between items-center mb-6">
                    <h1 className="text-3xl font-bold">
                        {isEditing ? 'تعديل الكوبون' : 'تفاصيل الكوبون'}
                    </h1>
                    <div className='flex gap-2'>
                        {isEditing ? (
                            <>
                                <Button type="button" variant="outline" onClick={handleCancel}>
                                    <X className="ml-2 h-4 w-4" />
                                    إلغاء
                                </Button>
                                <Button type="submit">
                                    <Save className="ml-2 h-4 w-4" />
                                    حفظ التغييرات
                                </Button>
                            </>
                        ) : (
                            <Button type="button" onClick={() => setIsEditing(true)}>
                                <Edit className="ml-2 h-4 w-4" />
                                تعديل الكوبون
                            </Button>
                        )}
                        <Button type="button" variant="ghost" onClick={() => router.push('/admin/coupons')}>
                            <ArrowRight className="ml-2 h-4 w-4" />
                            العودة للكوبونات
                        </Button>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <div className='lg:col-span-2 space-y-6'>
                        <Card>
                            <CardHeader>
                                <CardTitle>
                                    تفاصيل الكوبون
                                </CardTitle>
                                <CardDescription>
                                    معرف الكوبون: {coupon.id}
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-6">
                                <FormField control={form.control} name="code" render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>رمز الكوبون</FormLabel>
                                        <FormControl><Input {...field} readOnly={!isEditing} className="text-lg font-mono"/></FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )} />

                                <FormField control={form.control} name="discount" render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>قيمة الخصم (%)</FormLabel>
                                        <FormControl><Input type="number" {...field} readOnly={!isEditing} /></FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )} />
                            </CardContent>
                        </Card>
                        <Card>
                            <CardHeader>
                                <CardTitle>القيود</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-6">
                                <FormField
                                    control={form.control}
                                    name="expiresAt"
                                    render={({ field }) => (
                                        <FormItem className="flex flex-col">
                                            <FormLabel>تاريخ انتهاء الصلاحية</FormLabel>
                                            {isEditing ? (
                                                <>
                                                    <div className="flex items-center space-x-2 space-x-reverse">
                                                        <Checkbox
                                                            id="no-expiry"
                                                            checked={noExpiry}
                                                            onCheckedChange={(checked) => {
                                                                setNoExpiry(!!checked);
                                                                if (!!checked) form.setValue('expiresAt', null);
                                                            }}
                                                        />
                                                        <label htmlFor="no-expiry" className="text-sm font-medium">لا تنتهي أبدا</label>
                                                    </div>
                                                    <Popover>
                                                        <PopoverTrigger asChild>
                                                            <FormControl>
                                                                <Button variant={"outline"} className={cn("w-full pl-3 text-right font-normal", !field.value && "text-muted-foreground")} disabled={noExpiry}>
                                                                    {field.value ? format(field.value, "PPP", { locale: ar }) : <span>اختر تاريخاً</span>}
                                                                    <CalendarIcon className="mr-auto h-4 w-4 opacity-50" />
                                                                </Button>
                                                            </FormControl>
                                                        </PopoverTrigger>
                                                        <PopoverContent className="w-auto p-0" align="start">
                                                            <Calendar mode="single" selected={field.value} onSelect={field.onChange} disabled={(date) => date < new Date("1900-01-01")} initialFocus locale={ar}/>
                                                        </PopoverContent>
                                                    </Popover>
                                                </>
                                            ) : (
                                                <Input value={coupon.expiresAt ? format(coupon.expiresAt, "PPP", { locale: ar }) : "لا تنتهي أبدا"} readOnly />
                                            )}
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField control={form.control} name="usageLimit" render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>حد الاستخدام</FormLabel>
                                        {isEditing ? (
                                            <>
                                                <div className="flex items-center space-x-2 space-x-reverse">
                                                    <Checkbox
                                                        id="unlimited-usage"
                                                        checked={unlimitedUsage}
                                                        onCheckedChange={(checked) => {
                                                            setUnlimitedUsage(!!checked);
                                                            if (!!checked) form.setValue('usageLimit', null);
                                                        }}
                                                    />
                                                    <label htmlFor="unlimited-usage" className="text-sm font-medium">غير محدود</label>
                                                </div>
                                                <FormControl><Input type="number" {...field} value={field.value ?? ""} disabled={unlimitedUsage} /></FormControl>
                                            </>
                                        ) : (
                                            <Input value={coupon.usageLimit ?? "غير محدود"} readOnly />
                                        )}
                                        <FormDescription>
                                            تم استخدامه {coupon.usageCount} مرات.
                                        </FormDescription>
                                        <FormMessage />
                                    </FormItem>
                                )} />
                            </CardContent>
                        </Card>
                    </div>
                    <div className='lg:col-span-1'>
                        <Card>
                            <CardHeader>
                                <CardTitle>الحالة</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <FormField control={form.control} name="active" render={({ field }) => (
                                    <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                                        <div className="space-y-0.5">
                                            <FormLabel className="text-base">نشط</FormLabel>
                                            <FormDescription>هل هذا الكوبون متاح للاستخدام؟</FormDescription>
                                        </div>
                                        <FormControl>
                                            <Switch
                                                checked={field.value}
                                                onCheckedChange={field.onChange}
                                                disabled={!isEditing}
                                                aria-readonly={!isEditing}
                                            />
                                        </FormControl>
                                    </FormItem>
                                )} />
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </form>
        </Form>
    );
}
