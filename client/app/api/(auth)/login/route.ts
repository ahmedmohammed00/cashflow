import { NextResponse } from 'next/server';

export async function POST(req: Request) {
    const body = await req.json();

    const backendResponse = await fetch('http://localhost:5005/api/auth/login', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(body),
    });

    const data = await backendResponse.json();
    console.log(data);

    if (!backendResponse.ok) {
        return NextResponse.json(
            { error: data.error || 'Login failed' },
            { status: backendResponse.status }
        );
    }
    else{
        return NextResponse.json(data, { status: backendResponse.status });
    }

}