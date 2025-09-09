

"use client";

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Logo } from '@/components/icons';
import { LayoutGrid, PanelLeft, ShoppingBag, User } from 'lucide-react';
import { usePathname } from 'next/navigation';
import {
    Sheet,
    SheetContent,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from "@/components/ui/sheet"


export function Header() {
    const pathname = usePathname();
    const isAdminPath = pathname.startsWith('/admin');
    const isPosPath = pathname.startsWith('/pos');
    const isAuthPath = pathname.startsWith('/auth');

    // A real app would have a user session from a hook like useUser()
    const isAuthenticated = false;

    return (
        <header className="sticky top-0 z-50 w-full border-b bg-card shadow-sm">
            <div className="container flex h-16 items-center px-4 md:px-6">
                {isAdminPath && (
                    <div className="lg:hidden mr-4">
                        <Sheet>
                            <SheetTrigger asChild>
                                <Button variant="outline" size="icon">
                                    <PanelLeft className="h-5 w-5" />
                                    <span className="sr-only">Toggle Menu</span>
                                </Button>
                            </SheetTrigger>
                            <SheetContent side="right" className="w-[250px] sm:w-[300px] p-0">
                                <SheetHeader>
                                    <SheetTitle className="sr-only">قائمة الإدارة</SheetTitle>
                                </SheetHeader>
                            </SheetContent>
                        </Sheet>
                    </div>
                )}
                <Link href="/" className="mr-6 flex items-center space-x-2">
                    <Logo className="h-6 w-6 text-primary" />
                    <span className="font-bold sm:inline-block">CashFlow POS</span>
                </Link>
                <div className="flex flex-1 items-center justify-end space-x-1 sm:space-x-4">
                    <nav className="hidden sm:flex items-center space-x-1">
                        {isPosPath ? (
                            <Link href="/admin/dashboard">
                                <Button variant="ghost">
                                    <LayoutGrid className="ml-2 h-4 w-4" />
                                    لوحة التحكم
                                </Button>
                            </Link>
                        ) : isAdminPath ? (
                            <Link href="/pos">
                                <Button variant="ghost">
                                    <ShoppingBag className="ml-2 h-4 w-4" />
                                    الذهاب إلى نقاط البيع
                                </Button>
                            </Link>
                        ) : (
                            <Link href="/admin/dashboard">
                                <Button variant="ghost">
                                    <LayoutGrid className="ml-2 h-4 w-4" />
                                    لوحة تحكم المسؤول
                                </Button>
                            </Link>
                        )
                        }
                    </nav>
                    {!isAuthenticated && !isAuthPath && (
                        <Link href="/auth/login">
                            <Button>
                                <User className="ml-2 h-4 w-4" />
                                تسجيل الدخول
                            </Button>
                        </Link>
                    )}
                </div>
            </div>
        </header>
    );
}

