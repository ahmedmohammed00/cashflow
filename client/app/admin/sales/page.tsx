
import { columns } from './columns';
import { DataTable } from './data-table';
import type {Product, Sale} from '@/lib/types';

async function getSales(): Promise<Sale[]> {
    try {
        const response = await fetch('http://localhost:5005/api/sales', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
            credentials: 'include' // ✅ Send cookies with request
        });
        console.log(response);

        if (!response.ok) {
            throw new Error(`Failed to fetch products: ${response.status} ${response.statusText}`);
        }

        const result = await response.json();

        if (result.success && Array.isArray(result.data)) {
            return result.data as Sale[];
        } else {
            console.error('Unexpected API response:', result);
            return [];
        }

    } catch (error) {
        console.error('Error fetching products:', error);
        return [];
    }

}

export default async function SalesAdminPage() {
    const data = await getSales();

    return (
        <div className="w-full">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold">سجل المبيعات</h1>
            </div>
            <DataTable columns={columns} data={data} />
        </div>
    );
}
