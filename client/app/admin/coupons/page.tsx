'use client';

import { useEffect, useState } from 'react';
import { columns } from './columns';
import { DataTable } from './data-table';
import type { Coupon } from '@/lib/types';
import { fetchCoupons } from '@/lib/coupon';
import { toast } from 'sonner';

export default function CouponAdminPage() {
    const [data, setData] = useState<Coupon[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadCoupons = async () => {
            const token = localStorage.getItem("token");
            if (!token) {
                toast.error("لا يوجد توكن. الرجاء تسجيل الدخول.");
                setLoading(false);
                return;
            }

            const coupons = await fetchCoupons(token);
            setData(coupons);
            setLoading(false);
        };

        loadCoupons();
    }, []);

    return (
        <div className="w-full">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold">إدارة الكوبونات</h1>
            </div>

            {loading ? (
                <p>جارٍ التحميل...</p>
            ) : (
                <DataTable columns={columns} data={data} />
            )}
        </div>
    );
}
