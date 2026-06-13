export function getAuthToken() {
    return localStorage.getItem('auth_token');
}

export async function apiFetch(path, options = {}) {
    const token = getAuthToken();
    const headers = {
        Accept: 'application/json',
        ...(options.body ? { 'Content-Type': 'application/json' } : {}),
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
        ...(options.headers || {}),
    };

    return fetch(path, {
        credentials: 'include',
        ...options,
        headers,
    });
}

