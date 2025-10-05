import type { Product } from "./types";
/** Fetch all products */
export async function fetchProducts(token: string, baseUrl?: string): Promise<Product[]> {
    const apiUrl = baseUrl ?? "http://localhost:5005/api/products";

    try {
        const response = await fetch(apiUrl, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                ...(token ? { Authorization: `Bearer ${token}` } : {}),
            },
            credentials: "include",
        });

        if (!response.ok) throw new Error(`Failed to fetch products: ${response.status} ${response.statusText}`);

        const result = await response.json();
        if (result.success && Array.isArray(result.data)) return result.data as Product[];
        console.error("Unexpected API response:", result);
        return [];
    } catch (error) {
        console.error("Error fetching products:", error);
        return [];
    }
}

/** Add a new product */

export async function addProduct(
    product: Omit<Product, 'id'>,
    token: string
): Promise<Product | null> {
    try {
        const response = await fetch('http://localhost:5005/api/products', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify(product),
        });

        if (!response.ok) throw new Error('Failed to add product');
        const result = await response.json();
        return result.data || result; // handle both API styles
    } catch (error) {
        console.error('Error adding product:', error);
        return null;
    }
}


/** Update an existing product */
export async function updateProduct(
    productId: string,
    updatedData: Partial<Omit<Product, "id">>,
    token: string,
    baseUrl?: string
): Promise<Product | null> {
    const apiUrl = baseUrl ?? `http://localhost:5005/api/products/${productId}`;

    try {
        const response = await fetch(apiUrl, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                ...(token ? { Authorization: `Bearer ${token}` } : {}),
            },
            body: JSON.stringify(updatedData),
        });

        if (!response.ok) throw new Error(`Failed to update product: ${response.statusText}`);
        return await response.json();
    } catch (error) {
        console.error("Error updating product:", error);
        return null;
    }
}

/** Delete a product */
export async function deleteProduct(
    productId: string,
    token: string,
    baseUrl?: string
): Promise<boolean> {
    const apiUrl = baseUrl ?? `http://localhost:5005/api/products/${productId}`;

    try {
        const response = await fetch(apiUrl, {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json",
                ...(token ? { Authorization: `Bearer ${token}` } : {}),
            },
        });

        if (!response.ok) throw new Error(`Failed to delete product: ${response.statusText}`);
        return true;
    } catch (error) {
        console.error("Error deleting product:", error);
        return false;
    }
}
