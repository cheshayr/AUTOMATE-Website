import React, { useState } from 'react';
import './SignupPage.css';
import { useNavigate } from 'react-router-dom';
import { useAuthContext } from '../../context/AuthContext';

const SignupPage = () => {
  const navigate = useNavigate();
  const { login } = useAuthContext();
  const [formData, setFormData] = useState({
    firstName: '', middleName: '', lastName: '', suffix: '',
    age: '', sex: '', birthdate: '', address: '',
    username: '', password: '', email: '', position: '', role: 'staff'
  });
  const [error, setError] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    // Validate required fields (except middleName and suffix)
    for (const [key, value] of Object.entries(formData)) {
      if (!value && key !== 'middleName' && key !== 'suffix') {
        setError(`Please fill out the "${key}" field.`);
        return;
      }
    }

    try {
      const response = await fetch('http://localhost:5000/api/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || JSON.stringify(data) || 'Failed to sign up');
      }

      alert('Account created successfully!');
      
      // Auto-login after signup
      await login(formData.email, formData.password);
      navigate('/dashboard');
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="create-background">
      <div className="create-container">
        <h2>Create Account</h2>
        <form className="create-form" onSubmit={handleSubmit}>
          <div className="row">
            <input
              type="text"
              name="firstName"
              placeholder="First Name"
              value={formData.firstName}
              onChange={handleChange}
            />
            <input
              type="text"
              name="middleName"
              placeholder="Middle Name"
              value={formData.middleName}
              onChange={handleChange}
            />
            <input
              type="text"
              name="lastName"
              placeholder="Last Name"
              value={formData.lastName}
              onChange={handleChange}
            />
            <select name="suffix" value={formData.suffix} onChange={handleChange}>
              <option value="">Select Prefix</option>
              <option value="Jr.">Mr.</option>
              <option value="Sr.">Ms.</option>
              <option value="III">Mrs.</option>
            </select>
          </div>

          <div className="row">
            <input
              type="number"
              name="age"
              placeholder="Age"
              value={formData.age}
              onChange={handleChange}
            />
            <select name="sex" value={formData.sex} onChange={handleChange}>
              <option value="">Select Sex</option>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
              <option value="Non-Binary">Non-Binary</option>
            </select>
            <input
              type="date"
              name="birthdate"
              value={formData.birthdate}
              onChange={handleChange}
            />
          </div>

          <input
            type="text"
            name="address"
            placeholder="Address"
            value={formData.address}
            onChange={handleChange}
          />

          <div className="row">
            <input
              type="text"
              name="username"
              placeholder="Username"
              value={formData.username}
              onChange={handleChange}
            />
            <input
              type="password"
              name="password"
              placeholder="Password"
              value={formData.password}
              onChange={handleChange}
            />
            <input
              type="email"
              name="email"
              placeholder="Email"
              value={formData.email}
              onChange={handleChange}
            />
          </div>

          <input
            type="text"
            name="position"
            placeholder="Position"
            value={formData.position}
            onChange={handleChange}
          />

          <div className="row" style={{ justifyContent: 'flex-end', gap: '10px' }}>
            <button type="button" onClick={() => navigate('/login')} style={{ backgroundColor: '#ccc' }}>
              Back
            </button>
            <button type="submit">Create</button>
          </div>

          {/* Show error if any */}
          {error && <p className="error-message">{error}</p>}
        </form>
      </div>
    </div>
  );
};

export default SignupPage;
