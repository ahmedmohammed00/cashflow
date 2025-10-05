'use client';

import * as React from 'react';
import Link from 'next/link';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useRouter } from 'next/navigation';

import { Button } from '@/components/ui/button';
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { GoogleIcon } from '@/components/icons';
import { Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { loginUserApi } from '../../../lib/auth'; // create this API function

// Validation schema
const loginSchema = z.object({
    email: z.string().email({ message: 'الرجاء إدخال بريد إلكتروني صالح.' }),
    password: z.string().min(1, { message: 'كلمة المرور مطلوبة.' }),
});

type LoginFormValues = z.infer<typeof loginSchema>;

export default function LoginPage() {
    const router = useRouter();
    const [isLoading, setIsLoading] = React.useState(false);

    const form = useForm<LoginFormValues>({
        resolver: zodResolver(loginSchema),
        defaultValues: { email: '', password: '' },
    });

    const onSubmit = async (values: LoginFormValues) => {
        setIsLoading(true);
        try {
            await loginUserApi(values); // calls backend
            toast.success('تم تسجيل الدخول بنجاح', { description: 'مرحباً بعودتك!' });
            router.push('/pos');
        } catch (error: unknown) {
            if (error instanceof Error) {
                toast.error('فشل تسجيل الدخول', { description: error.message });
            } else {
                toast.error('فشل تسجيل الدخول', { description: 'حصل خطأ غير معروف' });
            }
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div dir="rtl" className="min-h-screen flex flex-col justify-center items-center px-4 py-12 bg-background">
            <div className="w-full max-w-md">
                <div className="mb-6 text-center">
                    <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">تسجيل الدخول</h1>
                    <p className="mt-2 text-muted-foreground text-sm sm:text-base">
                        أدخل بريدك الإلكتروني أدناه لتسجيل الدخول إلى حسابك
                    </p>
                </div>

                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="grid gap-6 w-full" noValidate>
                        {/* Email */}
                        <FormField
                            control={form.control}
                            name="email"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>البريد الإلكتروني</FormLabel>
                                    <FormControl>
                                        <Input type="email" placeholder="example@email.com" {...field} autoComplete="email" className="text-right" />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        {/* Password */}
                        <FormField
                            control={form.control}
                            name="password"
                            render={({ field }) => (
                                <FormItem>
                                    <div className="flex items-center justify-between">
                                        <FormLabel>كلمة المرور</FormLabel>
                                        <Link href="#" className="text-sm underline hover:text-primary">
                                            هل نسيت كلمة المرور؟
                                        </Link>
                                    </div>
                                    <FormControl>
                                        <Input type="password" placeholder="••••••••" {...field} autoComplete="current-password" className="text-right" />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        {/* Submit */}
                        <Button type="submit" className="w-full" disabled={isLoading} aria-busy={isLoading}>
                            {isLoading ? (
                                <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" /> جاري تسجيل الدخول...
                                </>
                            ) : (
                                'تسجيل الدخول'
                            )}
                        </Button>

                        {/* OR Divider */}
                        <div className="relative my-4">
                            <div className="absolute inset-0 flex items-center" aria-hidden="true">
                                <span className="w-full border-t border-border" />
                            </div>
                            <div className="relative flex justify-center text-xs uppercase text-muted-foreground bg-background px-2">أو</div>
                        </div>

                        {/* Google Login */}
                        <Button type="button" variant="outline" className="w-full flex items-center justify-center gap-2">
                            <GoogleIcon className="h-5 w-5" />
                            تسجيل الدخول باستخدام جوجل
                        </Button>
                    </form>
                </Form>

                <div className="mt-6 text-center text-sm">
                    ليس لديك حساب؟{' '}
                    <Link href="/auth/register" className="underline hover:text-primary">
                        إنشاء حساب
                    </Link>
                </div>
            </div>
        </div>
    );
}
