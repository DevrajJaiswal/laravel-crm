export function getAuthToken() {
    return localStorage.getItem('auth_token');
}

export async function apiFetch(path, options = {}) {
    const token = getAuthToken();
    const isFormData = options.body instanceof FormData;
    const headers = {
        Accept: 'application/json',
        ...(!isFormData && options.body ? { 'Content-Type': 'application/json' } : {}),
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
        ...(options.headers || {}),
    };

    return fetch(path, {
        credentials: 'include',
        ...options,
        headers,
    });
}

