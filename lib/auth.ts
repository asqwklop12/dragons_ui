export interface LoginResponse {
    email: string;
    name: string;
    loginTime: string;
}

export interface RegisterResponse {
    name: string;
    email: string;
}

export interface ApiError {
    message: string;
    status: number;
}

async function handleResponse<T>(response: Response): Promise<T> {
    if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        // Backend returns: { meta: { message: "..." }, data: null }
        const message = errorData.meta?.message || errorData.message || '알 수 없는 오류가 발생했습니다.';

        throw {
            message,
            status: response.status,
        } as ApiError;
    }

    const data = await response.json();
    // The backend wraps responses in ApiResponse<T>, so we might need to unwrap it
    // Assuming structure: { result: "SUCCESS", data: ... , message: ... }
    // Based on typical patterns. Let's inspect the controller again if needed.
    // Controller returns ApiResponse.success(...).
    // Let's assume ApiResponse has a `data` field.

    return data.data as T;
}

export const authApi = {
    login: async (email: string, password: string): Promise<LoginResponse> => {
        const response = await fetch('/api/auth/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ email, password }),
        });
        return handleResponse<LoginResponse>(response);
    },

    register: async (name: string, email: string, password: string): Promise<RegisterResponse> => {
        const response = await fetch('/api/auth/register', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ name, email, password }),
        });
        return handleResponse<RegisterResponse>(response);
    },

    getGoogleLoginUrl: async (): Promise<string> => {
        const response = await fetch('/api/auth/google/url');
        return handleResponse<string>(response); // Backend returns ApiResponse<String>
    },

    loginWithGoogle: async (code: string): Promise<LoginResponse> => {
        const response = await fetch('/api/auth/google/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ code }),
        });
        return handleResponse<LoginResponse>(response);
    },
};
