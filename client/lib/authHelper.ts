import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import jwt from "jsonwebtoken";
const JWT_SECRET='Z2VuZXJhdGVkLXNlY3JldC1mcm9tLW9wZW5zaXN0ZW0tMTIzNDU2'

export async function requireUser() {
    const cookieStore = await cookies(); // await the promise if cookies() returns a Promise
    const token = cookieStore.get("token")?.value;

    if (!token) redirect("/auth/login");

    try {
        const user = jwt.verify(token, JWT_SECRET!);
        return user;
    } catch {

        redirect("/login");
    }
}