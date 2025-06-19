import React, { useState, useEffect } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import {
  FiArrowLeft,
  FiEdit2,
  FiX,
  FiSave,
  FiUpload,
  FiImage,
} from "react-icons/fi";
import DashboardLayout from "../../features/DashboardLayout";
import Spinner from "../../components/constants/spinner/Spinner";
import { useAuthContext } from "../../context/AuthContext";
import "./AppointmentDetailsPage.css";

const AppointmentDetailsPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuthContext();
  const isAdmin = user?.role === "Admin";

  // Check query param edit=true for staff editing
  const queryParams = new URLSearchParams(location.search);
  const editParam = queryParams.get("edit");

  const [appointment, setAppointment] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(!isAdmin && editParam === "true");
  const [editedAppointment, setEditedAppointment] = useState(null);
  const [selectedImage, setSelectedImage] = useState(null);

  useEffect(() => {
    fetch(`http://192.168.1.5:5000/api/appointments/${id}`)
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch appointment");
        return res.json();
      })
      .then((data) => {
        setAppointment(data);
        setEditedAppointment(data);
      })
      .catch((error) => {
        console.error("Error loading appointment:", error);
        navigate("/appointments");
      })
      .finally(() => setLoading(false));
  }, [id, navigate]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditedAppointment((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setAppointment(editedAppointment);
    setIsEditing(false);
    alert("Appointment updated successfully!");
  };

  const handleImageUpload = (e) => {
    console.log("Image upload functionality to be implemented");
  };

  if (loading) return <Spinner message="Loading appointment details..." />;
  if (!appointment) return null;

  return (
    <DashboardLayout>
      <div className="min-h-screen bg-[#f5f7ff] p-6">
        <div className="bg-white rounded-2xl shadow-md p-6">
          {/* Header */}
          <div className="flex items-center mb-8">
            <button
              onClick={() => navigate("/appointments")}
              className="flex items-center text-gray-600 hover:text-gray-900 mr-4"
            >
              <FiArrowLeft className="mr-2" />
              Back to Appointments
            </button>
            <div className="h-6 w-px bg-gray-300 mx-4"></div>
            <h1 className="text-2xl font-bold text-gray-800">
              Appointment Details
            </h1>
          </div>

          {/* Status Badge */}
          <div className="mb-8">
            <span
              className={`status-badge ${appointment.status
                .toLowerCase()
                .replace(" ", "-")}`}
            >
              {appointment.status}
            </span>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end mb-8">
            {!isAdmin && !isEditing && (
              <button
                onClick={() => setIsEditing(true)}
                className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                <FiEdit2 className="mr-2" />
                Edit Details
              </button>
            )}
            {isEditing && (
              <div className="space-x-4">
                <button
                  onClick={() => {
                    setIsEditing(false);
                    setEditedAppointment(appointment);
                  }}
                  className="flex items-center px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors"
                >
                  <FiX className="mr-2" />
                  Cancel
                </button>
                <button
                  onClick={handleSubmit}
                  className="flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                >
                  <FiSave className="mr-2" />
                  Save Changes
                </button>
              </div>
            )}
          </div>

          {/* Details Form */}
          <form className="space-y-6 mb-8" onSubmit={handleSubmit}>
            <div className="grid grid-cols-2 gap-8">
              <div className="form-group">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Appointment ID
                </label>
                <input
                  type="text"
                  name="id"
                  value={isEditing ? editedAppointment.id : appointment.id}
                  disabled
                  className="form-input"
                />
              </div>

              <div className="form-group">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Status
                </label>
                <select
                  name="status"
                  value={
                    isEditing ? editedAppointment.status : appointment.status
                  }
                  onChange={handleInputChange}
                  disabled={!isEditing}
                  className="form-input"
                >
                  <option value="Pending Visit">Pending Visit</option>
                  <option value="Ongoing Repair">Ongoing Repair</option>
                  <option value="Billing">Billing</option>
                  <option value="Completed">Completed</option>
                  <option value="Cancelled">Cancelled</option>
                </select>
              </div>

              <div className="form-group">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Client Name
                </label>
                <input
                  type="text"
                  name="client"
                  value={
                    isEditing ? editedAppointment.client : appointment.client
                  }
                  onChange={handleInputChange}
                  disabled={!isEditing}
                  className="form-input"
                />
              </div>

              <div className="form-group">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Contact Number
                </label>
                <input
                  type="text"
                  name="contact"
                  value={
                    isEditing ? editedAppointment.contact : appointment.contact
                  }
                  onChange={handleInputChange}
                  disabled={!isEditing}
                  className="form-input"
                />
              </div>

              <div className="form-group">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Contact Method
                </label>
                <input
                  type="text"
                  name="contactMethod"
                  value={
                    isEditing
                      ? editedAppointment.contactMethod || ""
                      : appointment.contactMethod || ""
                  }
                  onChange={handleInputChange}
                  disabled={!isEditing}
                  className="form-input"
                />
              </div>

              <div className="form-group">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Car Make
                </label>
                <input
                  type="text"
                  name="carMake"
                  value={
                    isEditing
                      ? editedAppointment.carMake || ""
                      : appointment.carMake || ""
                  }
                  onChange={handleInputChange}
                  disabled={!isEditing}
                  className="form-input"
                />
              </div>

              <div className="form-group">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Car Model
                </label>
                <input
                  type="text"
                  name="carModel"
                  value={
                    isEditing
                      ? editedAppointment.carModel || ""
                      : appointment.carModel || ""
                  }
                  onChange={handleInputChange}
                  disabled={!isEditing}
                  className="form-input"
                />
              </div>

              <div className="form-group">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Car Year
                </label>
                <input
                  type="text"
                  name="carYear"
                  value={
                    isEditing
                      ? editedAppointment.carYear || ""
                      : appointment.carYear || ""
                  }
                  onChange={handleInputChange}
                  disabled={!isEditing}
                  className="form-input"
                />
              </div>

              <div className="form-group col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Selected Services
                </label>
                <textarea
                  name="selectedServices"
                  value={
                    isEditing
                      ? editedAppointment.selectedServices || ""
                      : appointment.selectedServices || ""
                  }
                  onChange={handleInputChange}
                  disabled={!isEditing}
                  className="form-input"
                  rows={2}
                />
              </div>

              <div className="form-group">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Booking Date
                </label>
                <input
                  type="date"
                  name="bookingDate"
                  value={
                    isEditing
                      ? editedAppointment.bookingDate?.substring(0, 10) || ""
                      : appointment.bookingDate?.substring(0, 10) || ""
                  }
                  onChange={handleInputChange}
                  disabled={!isEditing}
                  className="form-input"
                />
              </div>

              <div className="form-group">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Booking Time
                </label>
                <input
                  type="time"
                  name="bookingTime"
                  value={
                    isEditing
                      ? editedAppointment.bookingTime || ""
                      : appointment.bookingTime || ""
                  }
                  onChange={handleInputChange}
                  disabled={!isEditing}
                  className="form-input"
                />
              </div>

              <div className="form-group col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Assigned Mechanics
                </label>
                <div className="mt-2 flex flex-wrap gap-2">
                  {appointment.mechanics.map((mechanic, index) => (
                    <span
                      key={index}
                      className="px-4 py-2 bg-blue-100 text-blue-800 text-sm rounded-full font-medium"
                    >
                      {mechanic}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </form>

          {/* Image Upload Section */}
          <div className="border-t pt-8">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">
              Receipt
            </h2>
            <div className="grid grid-cols-4 gap-4 max-w-2xl">
              <div className="image-upload-container">
                <input
                  type="file"
                  id="image-upload"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                  disabled={!isEditing}
                />
                <label
                  htmlFor="image-upload"
                  className={`image-upload-label ${
                    !isEditing
                      ? "cursor-not-allowed opacity-50"
                      : "cursor-pointer"
                  }`}
                >
                  <FiUpload className="text-xl mb-1" />
                  <span className="text-xs text-gray-600">Upload</span>
                  <span className="text-xs text-gray-500">(Max 5MB)</span>
                </label>
              </div>

              {[1, 2, 3].map((index) => (
                <div key={index} className="image-preview-container">
                  <div className="image-preview-placeholder">
                    <FiImage className="text-2xl text-gray-400" />
                    <span className="text-xs text-gray-500 mt-1">No image</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default AppointmentDetailsPage;
