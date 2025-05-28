import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthContext } from '../../context/AuthContext';
import AppointmentRow from './AppointmentRow';

const AppointmentsTable = ({ appointments, onDelete, onStatusChange }) => {
    const navigate = useNavigate();
    const { user } = useAuthContext();
    const isAdmin = user?.role === 'Admin';

    const handleViewDetails = (id) => {
        navigate(`/appointments/${id}`);
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
                        {isAdmin && <th className="text-center">Action</th>}
                    </tr>
                </thead>
                <tbody>
                    {appointments.length > 0 ? (
                        appointments.map((item) => (
                            <AppointmentRow
                                key={item.id}
                                item={item}
                                onViewDetails={handleViewDetails}
                                onDelete={onDelete}
                                onStatusChange={onStatusChange}
                                isAdmin={isAdmin}
                            />
                        ))
                    ) : (
                        <tr>
                            <td colSpan={isAdmin ? "6" : "5"} className="text-center text-gray-400 py-6">
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
