import React, { useState } from 'react';
import './CreateAccount.css';

function CreateAccount({ onBackClick, onAccountCreated }) {
  const [formData, setFormData] = useState({
    firstName: '', middleName: '', lastName: '', suffix: '',
    age: '', sex: '', birthdate: '', address: '',
    username: '', password: '', email: '', position: '',
    role: ''
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Validate all fields
    for (const key in formData) {
      if (!formData[key]) {
        alert('Please fill out the ${key} field.');
        return;
      }
    }

    const accounts = JSON.parse(localStorage.getItem('accounts')) || [];
    accounts.push({
      username: formData.username,
      password: formData.password,
      role: formData.role
    });
    localStorage.setItem('accounts', JSON.stringify(accounts));

    alert('Account created successfully!');
    onAccountCreated(); // Go back to login
  };

  return (
    <div className="create-background">
      <div className="create-container">
        <h2>Create Account</h2>
        <form className="create-form" onSubmit={handleSubmit}>
          <div className="row">
            <input type="text" name="firstName" placeholder="First Name" onChange={handleChange} />
            <input type="text" name="middleName" placeholder="Middle Name" onChange={handleChange} />
            <input type="text" name="lastName" placeholder="Last Name" onChange={handleChange} />
            <select name="suffix" value={formData.suffix} onChange={handleChange}>
              <option value="">Select Suffix</option>
              <option value="Mr.">Mr.</option>
              <option value="Ms.">Ms.</option>
              <option value="Mrs.">Mrs.</option>
            </select>
          </div>

          <div className="row">
            <input type="number" name="age" placeholder="Age" onChange={handleChange} />
            <select name="sex" value={formData.sex} onChange={handleChange}>
              <option value="">Select Sex</option>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
              <option value="Non-Binary">Non-Binary</option>
            </select>
            <input type="date" name="birthdate" onChange={handleChange} />
          </div>

          <input type="text" name="address" placeholder="Address" onChange={handleChange} />

          <div className="row">
            <input type="text" name="username" placeholder="Username" onChange={handleChange} />
            <input type="password" name="password" placeholder="Password" onChange={handleChange} />
            <input type="email" name="email" placeholder="Email" onChange={handleChange} />
          </div>

          <input type="text" name="position" placeholder="Position" onChange={handleChange} />

          <select name="role" value={formData.role} onChange={handleChange}>
            <option value="">Select Role</option>
            <option value="Admin">Admin</option>
            <option value="Supervisor">Supervisor</option>
            <option value="Office Staff">Office Staff</option>
          </select>

          <div className="row" style={{ justifyContent: 'flex-end', gap: '10px' }}>
            <button type="button" onClick={onBackClick} style={{ backgroundColor: '#ccc' }}>Back</button>
            <button type="submit">Create</button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default CreateAccount;







