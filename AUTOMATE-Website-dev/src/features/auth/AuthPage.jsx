import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import LoginPage from './LoginPage';
import SignupPage from './SignupPage';
import { useAuthContext } from '../../context/AuthContext';

const AuthPage = () => {
    const [isLogin, setIsLogin] = useState(true);
    const navigate = useNavigate();
    const { user } = useAuthContext();

    useEffect(() => {
        if (user) {
            navigate('/dashboard');
        }
    }, [user, navigate]);

    const handleLoginSuccess = (user) => {
        // localStorage.setItem('authUser', JSON.stringify(user));
        alert(`Logged in as ${user.role}`);
        navigate('/dashboard');
    };

    const switchToSignup = () => setIsLogin(false);
    const switchToLogin = () => setIsLogin(true);

    return (
        <div>
            {isLogin ? (
                <LoginPage
                    onLoginSuccess={handleLoginSuccess}
                    onSignupClick={switchToSignup}
                />
            ) : (
                <SignupPage
                    onSignupSuccess={switchToLogin}
                    onLoginClick={switchToLogin}
                />
            )}
        </div>
    )
}

export default AuthPage