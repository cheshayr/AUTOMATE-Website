import React, { useState } from 'react';
import './LoginPage.css';

function LoginPage({ onLoginSuccess, onSignupClick }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();

    const accounts = JSON.parse(localStorage.getItem('accounts')) || [];
    const user = accounts.find(
      (acc) => acc.username === username && acc.password === password
    );

    if (user) {
      setError('');
      onLoginSuccess(user.role);
    } else {
      setError('Invalid username or password');
    }
  };

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
  );
}

export default LoginPage;







