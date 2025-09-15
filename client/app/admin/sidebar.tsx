'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { LayoutDashboard, Package, Tag, ShoppingCart, Shapes, Menu, X } from 'lucide-react';
import { Logo } from '@/components/icons';

const links = [
    { href: '/admin/dashboard', label: 'لوحة التحكم', icon: LayoutDashboard },
    { href: '/admin/products', label: 'المنتجات', icon: Package },
    { href: '/admin/categories', label: 'الفئات', icon: Shapes },
    { href: '/admin/coupons', label: 'الكوبونات', icon: Tag },
    { href: '/admin/sales', label: 'المبيعات', icon: ShoppingCart },
];

export function AdminSidebar() {
    const pathname = usePathname();
    const [isOpen, setIsOpen] = React.useState(false);

    // Close sidebar on navigation (optional)
    React.useEffect(() => {
        setIsOpen(false);
    }, [pathname]);

    return (
        <>
            {/* Mobile header with toggle button */}
            <div className="md:hidden flex items-center justify-between p-4 border-b bg-card fixed top-0 left-0 right-0 z-30">
                <Link href="/admin/dashboard" className="flex items-center space-x-2 rtl:space-x-reverse">
                    <Logo className="h-6 w-6 text-primary" />
                    <span className="font-bold">CashFlow POS</span>
                </Link>
                <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setIsOpen((prev) => !prev)}
                    aria-label={isOpen ? 'إغلاق القائمة' : 'فتح القائمة'}
                >
                    {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
                </Button>
            </div>

            {/* Sidebar overlay for mobile */}
            <div
                className={`fixed inset-0 bg-black bg-opacity-40 z-20 transition-opacity duration-300 md:hidden ${
                    isOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
                }`}
                onClick={() => setIsOpen(false)}
                aria-hidden={!isOpen}
            />

            {/* Sidebar */}
            <aside
                className={`
          fixed top-0 bottom-0 left-0 z-30 w-64 bg-card border-l
          transform transition-transform duration-300
          md:static md:translate-x-0
          ${isOpen ? 'translate-x-0' : '-translate-x-full'}
          pt-16 md:pt-0
          flex flex-col
        `}
                aria-label="شريط التنقل الجانبي"
            >
                <div className="flex flex-col h-full">
                    {/* Logo for md+ */}
                    <div className="hidden md:flex p-4 border-b">
                        <Link href="/admin/dashboard" className="flex items-center space-x-2 rtl:space-x-reverse">
                            <Logo className="h-6 w-6 text-primary" />
                            <span className="font-bold">CashFlow POS</span>
                        </Link>
                    </div>

                    {/* Navigation links */}
                    <nav className="flex-1 space-y-1 p-2 overflow-y-auto">
                        {links.map((link) => {
                            const isActive = pathname.startsWith(link.href);
                            return (
                                <Link href={link.href} key={link.href} tabIndex={isOpen || window.innerWidth >= 768 ? 0 : -1}>
                                    <Button
                                        variant={isActive ? 'secondary' : 'ghost'}
                                        className="w-full justify-start text-base"
                                        size="lg"
                                        onClick={() => setIsOpen(false)} // close on mobile after click
                                    >
                                        <link.icon className="ml-2 h-4 w-4" />
                                        {link.label}
                                    </Button>
                                </Link>
                            );
                        })}
                    </nav>
                </div>
            </aside>
        </>
    );
}
