import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthContext } from '../../context/AuthContext';
import { FiEye } from 'react-icons/fi';

const AppointmentsTable = ({ appointments }) => {
    const navigate = useNavigate();
    const { user } = useAuthContext();
    const isAdmin = user?.role === 'Admin';

    const handleViewDetails = (id) => {
        // Pass query param edit=true only if staff (not admin)
        navigate(`/appointments/${id}${isAdmin ? '' : '?edit=true'}`);
    };

    return (
        <div className="table-wrapper">
            <table className="appointments-table">
                <thead className="bg-gray-100">
                    <tr>
                        <th>ID</th>
                        <th>Client</th>
                        <th>Contact</th>
                        <th>Status</th>
                        <th>Mechanic</th>
                        <th className="text-center">Action</th>
                    </tr>
                </thead>
                <tbody>
                    {appointments.length > 0 ? (
                        appointments.map((item) => (
                            <tr key={item.id}>
                                <td>{item.id}</td>
                                <td>{item.client}</td>
                                <td>{item.contact}</td>
                                <td>{item.status}</td>
                                <td>{item.mechanics.join(', ')}</td>
                                <td className="text-center">
                                    <button
                                        onClick={() => handleViewDetails(item.id)}
                                        title="View Details"
                                        className="text-blue-600 hover:text-blue-800"
                                    >
                                        <FiEye size={18} />
                                    </button>
                                </td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan="6" className="text-center text-gray-400 py-6">
                                No appointments found.
                            </td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
    );
};

export default AppointmentsTable;
