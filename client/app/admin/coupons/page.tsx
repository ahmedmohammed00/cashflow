import { columns } from './columns';
import { DataTable } from './data-table';
import type { Coupon } from '@/lib/types';


async function getCoupons(): Promise<Coupon[]> {
    try {
        const res = await fetch('http://localhost:5005/api/coupons', {
            method: 'GET',
            credentials:'include',
            headers: {
                Cookie: '__Security_access_token=my_secret_token'
            }
        });

        if (!res.ok) {
            console.error('Fetch failed with status:', res.status);
            return [];
        }

        const data = await res.json();
        return data;
    } catch (error) {
        console.error('Error fetching coupons:', error);
        return [];
    }
}

export default async function CouponAdminPage() {

    const data = await getCoupons();

    return (
        <div className="w-full">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold">إدارة الكوبونات</h1>
            </div>
            <DataTable columns={columns} data={data} />
        </div>
    );
}
