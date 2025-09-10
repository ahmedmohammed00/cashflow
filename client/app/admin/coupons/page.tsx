import { columns } from './columns';
import { DataTable } from './data-table';
import type { Coupon } from '@/lib/types';


async function getCoupons(): Promise<Coupon[]> {

    await new Promise(resolve => setTimeout(resolve, 100));
    return []

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
