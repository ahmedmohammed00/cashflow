

import type { RegisterFormValues } from './types';

import type { LoginFormValues } from './types';

export async function registerUserApi(data: RegisterFormValues) {
    const response = await fetch('http://localhost:5005/api/auth/register', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            name: data.name,
            email: data.email,
            password: data.password,
            organizationName: data.organizationName,
            mobileNumber: data.mobileNumber,
        }),
    });

    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Registration failed');
    }

    return response.json();
}

export async function loginUserApi(data: LoginFormValues) {
    const response = await fetch('http://localhost:5005/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
    });

    const result = await response.json();

    if (!response.ok) {
        throw new Error(result?.message || 'فشل تسجيل الدخول');
    }

    // Store token in localStorage
    if (result.token) {
        localStorage.setItem('token', result.token);
    }

    return result;
}

