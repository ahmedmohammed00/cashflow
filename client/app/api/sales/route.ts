import { NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function POST(req: Request) {
    try {
        const cookiestore = await cookies();
        const token = cookiestore.get("token")?.value;

        const body = await req.json();

        const backendRes = await fetch(
            "http://localhost:5005/api/sales",
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify(body),
            }
        );

        const data = await backendRes.json();

        return NextResponse.json(data, {
            status: backendRes.status,
        });
    } catch (error) {
        return NextResponse.json(
            { success: false, error: "Server Error" },
            { status: 500 }
        );
    }
}