import type { RegisterFormValues } from "@/lib/types";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
    try {
        const body: RegisterFormValues = await request.json();

        // 1️⃣ اعمل request للـ backend
        const backendResponse = await fetch("http://localhost:5005/api/auth/register", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                name: body.name,
                email: body.email,
                password: body.password,
                organizationName: body.organizationName,
                mobileNumber: body.mobileNumber,
            }),
        });

        // 2️⃣ اقرأ JSON response
        const data = await backendResponse.json();

        // 3️⃣ لو فشل backend رجع نفس status
        if (!backendResponse.ok) {
            return NextResponse.json(
                { error: data.error || data.message || "Registration failed" },
                { status: backendResponse.status }
            );
        }



        // لو مش عايز auto-login
        return NextResponse.json(data, { status: backendResponse.status });
    } catch (error: unknown) {
        console.error("Register route error:", error);
        return NextResponse.json(
            { error: error instanceof Error ? error.message : "Server error" },
            { status: 500 }
        );
    }
}