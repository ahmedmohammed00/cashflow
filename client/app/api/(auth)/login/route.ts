import { NextResponse } from 'next/server';

export async function POST(req: Request) {
    const body = await req.json();

    // call backend
    const backendResponse = await fetch('http://localhost:5005/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
    });

    const data = await backendResponse.json();

    if (!backendResponse.ok) {
        return NextResponse.json({ error: data.error || 'Login failed' }, { status: backendResponse.status });
    }

    // ✅ create Next.js response and set cookie manually
    const response = NextResponse.json(data, { status: backendResponse.status });

    // backend token
    const token = data.token;

    // set cookie so server components can read it
    response.cookies.set('token', token, {
        httpOnly: true,
        secure: false, // true in production with HTTPS
        sameSite: 'lax',
        path: '/',
    });

    return response;
}