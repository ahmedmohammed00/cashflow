
import type { RegisterFormValues } from "@/lib/types";
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
    const body: RegisterFormValues = await request.json();

    const response = await fetch('http://localhost:5005/api/auth/register', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            name: body.name,
            email: body.email,
            password: body.password,
            organizationName: body.organizationName,
            mobileNumber: body.mobileNumber,
        }),
    });

    const data = await response.json();

    return new NextResponse(JSON.stringify(data), {
        status: response.status,
        headers: { 'Content-Type': 'application/json' },
    });
}