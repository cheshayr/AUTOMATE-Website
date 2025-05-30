// components/Spinner.jsx
import React from 'react';
import './Spinner.css';

const Spinner = ({ message = "Loading..." }) => {
  return (
    <div className="spinner-wrapper">
      <div className="spinner" />
      <p>{message}</p>
    </div>
  );
};

export default Spinner;
