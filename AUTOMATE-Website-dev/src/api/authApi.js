export const login = async ({ username, password }) => {
    const accounts = JSON.parse(localStorage.getItem('accounts')) || [];
    const user = accounts.find(acc => acc.username === username && acc.password === password);
    if (!user) throw new Error('Invalid credentials');
    return {
        user: {
            username: user.username,
            role: user.role,
            fullName: user.fullName || 'User'
        },
        token: 'mock-token', // Simulate a token
    };
};
  
export const signup = async (userData) => {
    const accounts = JSON.parse(localStorage.getItem('accounts')) || [];
    
    const exists = accounts.find(acc => acc.username === userData.username);
    if (exists) throw new Error('Username already exists');

    accounts.push({
        ...userData,
        fullName: `${userData.firstName} ${userData.lastName}`,
    });
    localStorage.setItem('accounts', JSON.stringify(accounts));

    return { success: true };
};
  