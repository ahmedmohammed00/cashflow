'use client'

import { columns } from './columns';
import { DataTable } from './data-table';
import { fetchProducts } from '../../../lib/products';
import { useEffect, useState } from "react";

export default function ProductAdminPage() {
    const [token, setToken] = useState<string | null>(null);
    const [data, setData] = useState<any[]>([]);

    // Get token from localStorage
    useEffect(() => {
        const storedToken = localStorage.getItem("token");
        if (!storedToken) {
            console.error("No access token found.");
            return;
        }
        setToken(storedToken);
    }, []);

    // Fetch products when token is available
    useEffect(() => {
        if (!token) return;

        const fetchData = async () => {
            try {
                const products = await fetchProducts(token);
                setData(products);
            } catch (err) {
                console.error("Failed to fetch products:", err);
            }
        }

        fetchData();
    }, [token]);

    return (
        <div className="w-full">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold">إدارة المنتجات</h1>
            </div>
            <DataTable columns={columns} data={data} />
        </div>
    );
}
