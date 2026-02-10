import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Sidebar from "../../components/sidebar/Sidebar";
import "./EditServicePage.css";

const EditServicePage = () => {
  const { serviceName } = useParams();
  const decodedServiceName = decodeURIComponent(serviceName);

  const [title, setTitle] = useState(decodedServiceName);
  const [description, setDescription] = useState("");
  // ✅ Changed state name to match backend schema
  const [rangeMin, setRangeMin] = useState(0); 
  const [image, setImage] = useState(null);
  const [error, setError] = useState("");

  const navigate = useNavigate();

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) setImage(file);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setError("");

    // ✅ Validation: Allow 0, but reject negative numbers
    if (rangeMin === "" || Number(rangeMin) < 0) {
      setError("Price must be 0 or greater.");
      return;
    }

    // Usually you'd use an API call here with FormData
    const formData = new FormData();
    formData.append("name", title);
    formData.append("description", description);
    formData.append("rangeMin", rangeMin); // ✅ Use rangeMin
    if (image) formData.append("image", image);

    console.log("Saving to Backend:", {
      name: title,
      description,
      rangeMin: Number(rangeMin),
      image,
    });

    // Replace with your actual update API call
    // await updateService(formData);

    navigate("/services");
  };

  return (
    <div className="service-config-wrapper">
      <Sidebar role="admin" onLogout={() => console.log("Logout")} />

      <main className="service-main">
        <div className="service-header">
          <h1>Edit Service</h1>
        </div>

        <form onSubmit={handleSubmit} style={{ maxWidth: "500px" }}>
          {/* Service Title */}
          <div style={{ marginBottom: "1rem" }}>
            <label>Service Title</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              className="input"
            />
          </div>

          {/* Description */}
          <div style={{ marginBottom: "1rem" }}>
            <label>Description</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={4}
              className="input"
            />
          </div>

          {/* Price Starts At (mapped to rangeMin) */}
          <div style={{ marginBottom: "1rem" }}>
            <label>Price Starts At (₱)</label>
            <input
              type="number"
              min="0"
              step="1"
              value={rangeMin}
              onChange={(e) => setRangeMin(e.target.value)}
              placeholder="0"
              className={`input ${error ? 'border-red-500' : ''}`}
            />
            {error && <p style={{ color: "red", fontSize: "0.8rem", marginTop: "4px" }}>{error}</p>}
          </div>

          {/* Upload Image */}
          <div style={{ marginBottom: "1rem" }}>
            <label>Upload Image</label>
            <input type="file" accept="image/*" onChange={handleImageChange} />
          </div>

          <button type="submit" className="save-btn">
            Save Changes
          </button>
        </form>
      </main>
    </div>
  );
};

export default EditServicePage;
