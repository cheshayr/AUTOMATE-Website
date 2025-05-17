import React from 'react';
import AppointmentRow from './AppointmentRow';

const AppointmentsTable = ({ appointments }) => {
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
            appointments.map((item) => <AppointmentRow key={item.id} item={item} />)
          ) : (
            <tr>
              <td colSpan="6" className="px-4 py-6 text-center text-gray-400">
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
