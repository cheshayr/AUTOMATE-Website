// EditServicePage.jsx
import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Sidebar from '../../components/sidebar/Sidebar';
import './EditServicePage.css';

const EditServicePage = () => {
  const { serviceName } = useParams();
  const decodedServiceName = decodeURIComponent(serviceName);
  const [title, setTitle] = useState(decodedServiceName);
  const [description, setDescription] = useState('');
  const [image, setImage] = useState(null);
  const navigate = useNavigate();

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) setImage(file);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Saving:', { title, description, image });
    navigate('/services');
  };

  return (
    <div className="service-config-wrapper">
      <Sidebar role="admin" onLogout={() => console.log('Logout')} />
      <main className="service-main">
        <div className="service-header">
          <h1>Edit Service</h1>
        </div>

        <form onSubmit={handleSubmit} style={{ maxWidth: '500px' }}>
          <div style={{ marginBottom: '1rem' }}>
            <label>Service Title</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              className="input"
            />
          </div>

          <div style={{ marginBottom: '1rem' }}>
            <label>Description</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={4}
              className="input"
            />
          </div>

          <div style={{ marginBottom: '1rem' }}>
            <label>Upload Image</label>
            <input type="file" accept="image/*" onChange={handleImageChange} />
          </div>

          <button type="submit" className="save-btn">Save Changes</button>
        </form>
      </main>
    </div>
  );
};

export default EditServicePage;
