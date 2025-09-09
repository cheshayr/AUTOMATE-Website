export const login = async ({ username, password }) => {
    const response = await fetch('${import.meta.env.VITE_API_URL}/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
    });

    if (!response.ok) {
        const err = await response.json();
        throw new Error(err.message || 'Login failed');
    }

    return await response.json(); // Will include { user, token }
};

export const signup = async (userData) => {
    const response = await fetch('${import.meta.env.VITE_API_URL}/api/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(userData),
    });

    if (!response.ok) {
        const err = await response.json();
        throw new Error(err.message || 'Signup failed');
    }

    return await response.json(); // optional: { success: true }
};
  