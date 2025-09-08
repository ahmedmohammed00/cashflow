
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

const loginSchema = z.object({
    email: z.string().email({ message: 'الرجاء إدخال بريد إلكتروني صالح.' }),
    password: z.string().min(1, { message: 'كلمة المرور مطلوبة.' }),
});

type LoginFormValues = z.infer<typeof loginSchema>;

export default function LoginPage() {
    const [isLoading, setIsLoading] = React.useState(false);

    const form = useForm<LoginFormValues>({
        resolver: zodResolver(loginSchema),
        defaultValues: {
            email: '',
            password: '',
        },
    });

    function onSubmit(values: LoginFormValues) {
        setIsLoading(true);
        console.log('Login form submitted:', values);

        // Simulate server delay and potential failure
        setTimeout(() => {
            setIsLoading(false);
            // Simulate a failure for a specific email for demonstration
            if (values.email === 'fail@example.com') {
                toast.error("فشل تسجيل الدخول", {
                    description: "البريد الإلكتروني أو كلمة المرور غير صحيحة. يرجى المحاولة مرة أخرى.",
                })
            } else {
                toast.success("تم تسجيل الدخول بنجاح", {
                    description: "مرحباً بعودتك!"
                })
            }
        }, 1500)
    }

    return (
        <>
            <div className="grid gap-2 text-center">
                <h1 className="text-3xl font-bold">تسجيل الدخول</h1>
                <p className="text-balance text-muted-foreground">
                    أدخل بريدك الإلكتروني أدناه لتسجيل الدخول إلى حسابك
                </p>
            </div>
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="grid gap-4">
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
                                <div className="flex items-center">
                                    <FormLabel>كلمة المرور</FormLabel>
                                    <Link
                                        href="#"
                                        className="mr-auto inline-block text-sm underline"
                                    >
                                        هل نسيت كلمة المرور؟
                                    </Link>
                                </div>
                                <FormControl>
                                    <Input type="password" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <Button type="submit" className="w-full" disabled={isLoading}>
                        {isLoading && <Loader2 className="ml-2 h-4 w-4 animate-spin" />}
                        تسجيل الدخول
                    </Button>
                    <Button variant="outline" className="w-full">
                        <GoogleIcon className="ml-2 h-4 w-4" />
                        تسجيل الدخول باستخدام جوجل
                    </Button>
                </form>
            </Form>
            <div className="mt-4 text-center text-sm">
                ليس لديك حساب؟{' '}
                <Link href="/auth/register" className="underline">
                    إنشاء حساب
                </Link>
            </div>
        </>
    );
}
