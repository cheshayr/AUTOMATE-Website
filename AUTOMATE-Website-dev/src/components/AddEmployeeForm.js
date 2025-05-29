import React, { useState } from 'react';
import './AddEmployeeForm.css';

function AddEmployeeForm({ setShowAddEmployee }) {
  const [newEmployee, setNewEmployee] = useState({
    name: '',
    role: '',
    email: '',
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewEmployee((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();

    const storedEmployees = JSON.parse(localStorage.getItem('employees')) || [];

    const updatedEmployees = [...storedEmployees, newEmployee];

    localStorage.setItem('employees', JSON.stringify(updatedEmployees));

    console.log('New employee added:', newEmployee);
    setShowAddEmployee(false); 
  };

  return (
    <div className="add-employee-form-container">
      <div className="form-overlay" onClick={() => setShowAddEmployee(false)}></div>
      <div className="form-content">
        <h3>Add New Employee</h3>
        <form onSubmit={handleFormSubmit}>
          <div className="form-group">
            <label htmlFor="name">Name:</label>
            <input
              type="text"
              id="name"
              name="name"
              value={newEmployee.name}
              onChange={handleInputChange}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="role">Role:</label>
            <input
              type="text"
              id="role"
              name="role"
              value={newEmployee.role}
              onChange={handleInputChange}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="email">Email:</label>
            <input
              type="email"
              id="email"
              name="email"
              value={newEmployee.email}
              onChange={handleInputChange}
              required
            />
          </div>

          <div className="form-buttons">
            <button type="submit">Add Employee</button>
            <button type="button" onClick={() => setShowAddEmployee(false)}>
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default AddEmployeeForm;


