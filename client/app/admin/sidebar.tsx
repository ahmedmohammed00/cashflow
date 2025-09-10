
'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { LayoutDashboard, Package, Tag, ShoppingCart, Shapes } from 'lucide-react';
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

    return (
        <aside className="w-64 flex-shrink-0 border-l bg-card h-full">
            <div className="flex h-full flex-col">
                <div className="p-4 border-b">
                    <Link href="/admin/dashboard" className="flex items-center space-x-2">
                        <Logo className="h-6 w-6 text-primary" />
                        <span className="font-bold sm:inline-block">CashFlow POS</span>
                    </Link>
                </div>
                <nav className="flex-1 space-y-1 p-2">
                    {links.map((link) => {
                        const isActive = pathname.startsWith(link.href);
                        return (
                            <Link href={link.href} key={link.href}>
                                <Button
                                    variant={isActive ? 'secondary' : 'ghost'}
                                    className="w-full justify-start text-base"
                                    size="lg"
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
    );
}
