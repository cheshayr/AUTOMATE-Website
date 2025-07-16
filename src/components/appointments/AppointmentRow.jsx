import React from 'react';
import { FiEye } from 'react-icons/fi';

const getMechanicColor = (mechanic) => {
  const colors = {
    Mike: { bg: '#dbeafe', text: '#1e40af' },
    Anna: { bg: '#fef3c7', text: '#92400e' },
    Tom: { bg: '#dcfce7', text: '#166534' },
    Luis: { bg: '#f3e8ff', text: '#6b21a8' },
    default: { bg: '#fee2e2', text: '#991b1b' },
  };
  return colors[mechanic] || colors.default;
};

const AppointmentRow = ({ item, onViewDetails, onDelete, onStatusChange, isAdmin }) => {
  return (
    <tr className="border-t">
      <td className="px-4 py-2 text-sm">{item.id}</td>
      <td className="px-4 py-2 text-sm">{item.client}</td>
      <td className="px-4 py-2 text-sm">{item.contact}</td>
      <td className="px-4 py-2 text-sm">
        <span
          className={`px-3 py-1 rounded-full text-xs ${
            item.status === 'Completed'
              ? 'bg-green-100 text-green-800'
              : item.status === 'In Progress'
              ? 'bg-blue-100 text-blue-800'
              : item.status === 'Cancelled'
              ? 'bg-red-100 text-red-800'
              : 'bg-yellow-100 text-yellow-800'
          }`}
        >
          {item.status}
        </span>
      </td>
      <td className="px-4 py-2 text-sm">
        <div className="flex flex-wrap gap-2">
          {item.mechanics.map((mech, i) => {
            const colors = getMechanicColor(mech);
            return (
              <span
                key={i}
                className="text-xs font-medium"
                style={{
                  backgroundColor: colors.bg,
                  color: colors.text,
                  border: `1px solid ${colors.text}20`,
                  padding: '0.2rem 0.4rem',
                  borderRadius: '9999px',
                }}
              >
                {mech}
              </span>
            );
          })}
        </div>
      </td>
      {isAdmin && (
        <td className="px-4 py-2 text-center">
          <button onClick={() => onViewDetails(item.id)} className="text-gray-600 hover:text-black text-xl">
            <FiEye />
          </button>
        </td>
      )}
    </tr>
  );
};

export default AppointmentRow;
