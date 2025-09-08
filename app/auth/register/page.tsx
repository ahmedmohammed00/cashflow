'use client';

import Link from 'next/link';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

import { Button } from '@/components/ui/button';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';


const registerSchema = z.object({
    name: z.string().min(2, { message: 'يجب أن يكون الاسم من حرفين على الأقل.' }),
    email: z.string().email({ message: 'الرجاء إدخال بريد إلكتروني صالح.' }),
    password: z.string().min(6, { message: 'يجب أن تكون كلمة المرور من 6 أحرف على الأقل.' }),
})

type RegisterFormValues = z.infer<typeof registerSchema>;

export default function RegisterPage () {
    const form = useForm<RegisterFormValues>({
        resolver : zodResolver(registerSchema),
        defaultValues : {
            name : '',
            email: '',
            password: '',
        },
    });

    const onSubmit = async (values: RegisterFormValues)=> {
        const res = await fetch("http://localhost:5005/api/auth/register",{
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(values),
        })
        // UI only, no server logic
        if (!res.ok) {
            const data = await res.json()
            console.log("server failed")
            return
        }


    }

    return (
        <Card className="mx-auto max-w-sm w-full">
            <CardHeader>
                <CardTitle className="text-2xl">إنشاء حساب</CardTitle>
                <CardDescription>
                    أدخل معلوماتك لإنشاء حساب جديد
                </CardDescription>
            </CardHeader>
            <CardContent>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                        <div className="space-y-4">
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
                            <Button type="submit" className="w-full">
                                إنشاء حساب
                            </Button>
                        </div>
                        <Separator className="my-4" />
                        <Button variant="outline" className="w-full">
                            {/* <GoogleIcon className="ml-2 h-4 w-4" /> */}
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
            </CardContent>
        </Card>
    );


}