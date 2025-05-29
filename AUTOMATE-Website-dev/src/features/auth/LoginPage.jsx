import React, { useState } from 'react';
import './LoginPage.css';
import { login as loginApi } from '../../api/authApi';
import { useAuthContext } from '../../context/AuthContext';
import Spinner from '../../components/constants/spinner/Spinner';

const LoginPage = ({ onLoginSuccess, onSignupClick }) => {
    const { login } = useAuthContext();
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = (e) => {
        e.preventDefault();
        handleLogin();
    }

    const handleLogin = async () => {
        setLoading(true);
        try {
            if (username === 'Admin' && password === '12345') {
                const adminUser = {
                    username: 'Admin',
                    fullName: 'Sophia',
                    role: 'Admin',
                };
                const dummyToken = 'admin-token';
                login(adminUser, dummyToken);
                setError('');
                onLoginSuccess(adminUser);
                return;
            }

            const res = await loginApi({ username, password });
            login(res.user, res.token);
            setError('');
            onLoginSuccess(res.user);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    if (loading) return <Spinner message="Logging in..." />;

    return (
        <div className="login-container">
            <div className="login-left">
                <img src="/tierodman.png" alt="Tierodman Auto Center" className="bg-image" />
            </div>
            <div className="login-right">
                <img src="/logo.png" alt="Tierodman Logo" className="logo" />
                <form className="login-form" onSubmit={handleSubmit}>
                    <label>Username</label>
                    <input
                        type="text"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        placeholder="Enter username"
                    />

                    <label>Password</label>
                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="Enter password"
                    />

                    <button type="submit">Log In</button>
                </form>
                {error && <p className="error-message">{error}</p>}
                <p className="signup-text">
                    New to the team?{' '}
                    <button onClick={onSignupClick}>Sign Up Here!</button>
                </p>
            </div>
        </div>
    )
}

export default LoginPage;
