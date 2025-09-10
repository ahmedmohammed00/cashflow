import { columns } from './columns';
import { DataTable } from './data-table';
import type { Product } from '@/lib/types';

export async function getProducts(): Promise<Product[]> {
    try {
        const response = await fetch('http://localhost:5005/api/products', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
            credentials: 'include' // ✅ Send cookies with request
        });

        if (!response.ok) {
            throw new Error(`Failed to fetch products: ${response.status} ${response.statusText}`);
        }

        const result = await response.json();

        if (result.success && Array.isArray(result.data)) {
            return result.data as Product[];
        } else {
            console.error('Unexpected API response:', result);
            return [];
        }

    } catch (error) {
        console.error('Error fetching products:', error);
        return [];
    }
}
export default async function ProductAdminPage() {
    const data = await getProducts();

    return (
        <div className="w-full">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold">إدارة المنتجات</h1>
            </div>
            <DataTable columns={columns} data={data} />
        </div>
    );
}
