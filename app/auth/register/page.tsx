
'use client';

import * as React from 'react';
import Link from 'next/link';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

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


const registerSchema = z.object({
    name: z.string().min(2, { message: 'يجب أن يكون الاسم من حرفين على الأقل.' }),
    email: z.string().email({ message: 'الرجاء إدخال بريد إلكتروني صالح.' }),
    password: z.string().min(6, { message: 'يجب أن تكون كلمة المرور من 6 أحرف على الأقل.' }),
});

type RegisterFormValues = z.infer<typeof registerSchema>;

export default function RegisterPage() {
    const [isLoading, setIsLoading] = React.useState(false);

    const form = useForm<RegisterFormValues>({
        resolver: zodResolver(registerSchema),
        defaultValues: {
            name: '',
            email: '',
            password: '',
        },
    });

    function onSubmit(values: RegisterFormValues) {
        setIsLoading(true);
        console.log('Registration form submitted:', values);

        setTimeout(() => {
            setIsLoading(false);
            // Simulate failure if email already exists
            if (values.email === 'exists@example.com') {
                toast.error("فشل التسجيل", {
                    description: "هذا البريد الإلكتروني مستخدم بالفعل. يرجى استخدام بريد آخر.",
                })
            } else {
                toast.success("تم إنشاء الحساب بنجاح", {
                    description: "تم إرسال بريد إلكتروني للتحقق."
                })
            }
        }, 1500)
    }

    return (
        <>
            <div className="grid gap-2 text-center">
                <h1 className="text-3xl font-bold">إنشاء حساب</h1>
                <p className="text-balance text-muted-foreground">
                    أدخل معلوماتك أدناه لإنشاء حساب
                </p>
            </div>
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="grid gap-4">
                    <FormField
                        control={form.control}
                        name="name"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>الاسم</FormLabel>
                                <FormControl>
                                    <Input placeholder="الاسم الكامل" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="email"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>البريد الإلكتروني</FormLabel>
                                <FormControl>
                                    <Input
                                        placeholder="m@example.com"
                                        {...field}
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="password"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>كلمة المرور</FormLabel>
                                <FormControl>
                                    <Input type="password" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <Button type="submit" className="w-full" disabled={isLoading}>
                        {isLoading && <Loader2 className="ml-2 h-4 w-4 animate-spin" />}
                        إنشاء حساب
                    </Button>
                    <Button variant="outline" className="w-full">
                        <GoogleIcon className="ml-2 h-4 w-4" />
                        التسجيل باستخدام جوجل
                    </Button>
                </form>
            </Form>
            <div className="mt-4 text-center text-sm">
                لديك حساب بالفعل؟{' '}
                <Link href="/auth/login" className="underline">
                    تسجيل الدخول
                </Link>
            </div>
        </>
    );
}
