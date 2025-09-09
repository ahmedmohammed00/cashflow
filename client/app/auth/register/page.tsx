
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
    organizationName: z.string().min(5,{ message: 'يجب أن تكون اسم منظومه من 5 أحرف على الأقل.' }),
    mobileNumber :z.string().min(8,{message:"at least 8 digit number"})
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
            organizationName:'',
            mobileNumber: '' ,
        },
    });


    const onSubmit = async (values: RegisterFormValues) => {
        setIsLoading(true);
        console.log('Registration form submitted:', values);
        try {
            const res = await fetch('http://localhost:5005/api/auth/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: 'include',
                body: JSON.stringify(values),
            });

            if (!res.ok) {
                // Try to parse error message or fallback
                let errorMsg = "حاول تسجيل مره اخري لاحقا";
                try {
                    const errorData = await res.json();
                    errorMsg = errorData.message || errorMsg;
                } catch {
                    // ignore JSON parse errors
                }

                setIsLoading(false);
                toast.error("فشل التسجيل", { description: errorMsg });
                return;
            }

            const data = await res.json();
            console.log(data);
            setIsLoading(false);
            toast.success("تم إنشاء الحساب بنجاح", {
                description: "تم إرسال بريد إلكتروني للتحقق.",
            });
        } catch (err) {
            console.error(err);
            setIsLoading(false);
            toast.error("حدث خطأ في الشبكة", {
                description: "يرجى المحاولة مرة أخرى لاحقًا.",
            });
        }
    };

        /*
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
        */



    return (
        <>
            <div className="min-h-screen flex items-center justify-center px-4 sm:px-6 lg:px-8 bg-background">
                <div className="w-full max-w-lg space-y-8">{/* Insert the form here */}
                    <>
                        <div className="mb-6 text-center">
                            <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
                                إنشاء حساب
                            </h1>
                            <p className="mt-2 text-muted-foreground text-sm sm:text-base">
                                أدخل معلوماتك أدناه لإنشاء حساب جديد
                            </p>
                        </div>

                        <Form {...form}>
                            <form
                                onSubmit={form.handleSubmit(onSubmit)}
                                className="grid gap-4 w-full max-w-md mx-auto"
                            >
                                {/* Full Name */}
                                <FormField
                                    control={form.control}
                                    name="name"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>الاسم الكامل</FormLabel>
                                            <FormControl>
                                                <Input placeholder="أدخل اسمك الكامل" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                {/* Email */}
                                <FormField
                                    control={form.control}
                                    name="email"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>البريد الإلكتروني</FormLabel>
                                            <FormControl>
                                                <Input type="email" placeholder="example@email.com" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                {/* Organization */}
                                <FormField
                                    control={form.control}
                                    name="organizationName"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>اسم المؤسسة</FormLabel>
                                            <FormControl>
                                                <Input placeholder="اسم المؤسسة" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                {/* Mobile Number */}
                                <FormField
                                    control={form.control}
                                    name="mobileNumber"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>رقم الهاتف</FormLabel>
                                            <FormControl>
                                                <Input
                                                    type="tel"
                                                    inputMode="numeric"
                                                    placeholder="05XXXXXXXX"
                                                    {...field}
                                                />
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
                                            <FormLabel>كلمة المرور</FormLabel>
                                            <FormControl>
                                                <Input type="password" placeholder="••••••••" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                {/* Submit Button */}
                                <Button type="submit" className="w-full" disabled={isLoading}>
                                    {isLoading ? (
                                        <>
                                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                            جاري التسجيل...
                                        </>
                                    ) : (
                                        'إنشاء حساب'
                                    )}
                                </Button>

                                {/* OR Divider */}
                                <div className="relative my-2">
                                    <div className="absolute inset-0 flex items-center">
                                        <span className="w-full border-t border-border" />
                                    </div>
                                    <div className="relative flex justify-center text-xs uppercase text-muted-foreground bg-background px-2">
                                        أو
                                    </div>
                                </div>

                                {/* Google Auth Button */}
                                <Button type="button" variant="outline" className="w-full">
                                    <GoogleIcon className="mr-2 h-4 w-4" />
                                    التسجيل باستخدام جوجل
                                </Button>
                            </form>
                        </Form>

                        {/* Link to Login */}
                        <div className="mt-6 text-center text-sm">
                            لديك حساب بالفعل؟{' '}
                            <Link href="/auth/login" className="underline hover:text-primary">
                                تسجيل الدخول
                            </Link>
                        </div>
                    </>





                </div>
            </div>

        </>
    );
}
