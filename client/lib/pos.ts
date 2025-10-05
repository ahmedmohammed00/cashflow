import {Sale} from './types'

function  getTokenFromLocalStorage(): string | null {
    try {
        return localStorage.getItem("token");
    } catch {
        return null;
    }
}


export async function CreateSale(
    sale: Omit<Sale, "id">,
    baseUrl?: string
): Promise<Sale | null> {
    const apiUrl = baseUrl ?? "https://localhost:5005/api/products";
    const token = getTokenFromLocalStorage();

    try {
        const response = await fetch(apiUrl, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                ...(token ? { "Authorization": `Bearer ${token}` } : {}),
            },
            body: JSON.stringify(sale),
        });

        if (!response.ok) {
            throw new Error(response.statusText);
        }

        const data: Sale = await response.json();
        return data;
    } catch (error) {
        console.error("Error creating sale:", error);
        return null;
    }
}
