'use client'

import Link from "next/link";
import { useForm } from 'react-hook-form';
import {zodResolver} from "@hookform/resolvers/zod";
import z from 'zod'

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


/* Login Schema */
const loginSchema = z.object({
    email: z.string().email({ message: 'الرجاء إدخال بريد إلكتروني صالح.' }),
    password: z.string().min(1, { message: 'كلمة المرور مطلوبة.' }),
})

type LoginFormValues = z.infer<typeof loginSchema>;

export default function LoginPage(){

    const form = useForm<LoginFormValues>({
        resolver: zodResolver(loginSchema),
        defaultValues: {
            email: '',
            password: '',
        },
    })
    function onSubmit(values: LoginFormValues){
        console.log('Login form submitted:', values);
    }

    return (
        <Card className="mx-auto max-w-sm w-full">
            <CardHeader>
                <CardTitle className="text-2xl">تسجيل الدخول</CardTitle>
                <CardDescription>
                    أدخل بريدك الإلكتروني أدناه لتسجيل الدخول إلى حسابك
                </CardDescription>
            </CardHeader>
            <CardContent>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                        <div className="space-y-4">
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
                            <Button type="submit" className="w-full">
                                تسجيل الدخول
                            </Button>
                        </div>
                        <Separator className="my-4" />
                        <Button variant="outline" className="w-full">
                            {/* <GoogleIcon className="ml-2 h-4 w-4" /> */}
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
            </CardContent>
        </Card>
    );

}