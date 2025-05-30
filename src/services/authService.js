export const getUserFromToken = () => {
    const token = localStorage.getItem('authToken');
    if (!token) return null;
  
    try {
        // Example: decode JWT (replace with your logic)
        const payload = JSON.parse(atob(token.split('.')[1]));
        return payload.user;
    } catch (e) {
        return null;
    }
};
