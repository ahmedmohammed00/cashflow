import { NextResponse } from 'next/server';

export async function POST(req: Request) {
    const body = await req.json();

    const backendResponse = await fetch('http://localhost:5005/api/auth/login', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(body)
    });

    const data = await backendResponse.json();

    if (!backendResponse.ok) {
        return NextResponse.json({ error: data.message }, { status: 401 });
    }

    //  create response
    const response = NextResponse.json({ success: true });

    //  set cookie HERE
    response.cookies.set('token', data.token, {
        httpOnly: true,
        secure: true,
        sameSite: 'strict',
        path: '/',
    });

    return response;
}