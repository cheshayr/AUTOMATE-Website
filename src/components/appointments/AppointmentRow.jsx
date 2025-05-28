import React from 'react';
import { FiEye } from "react-icons/fi";
import { useNavigate } from 'react-router-dom';

const AppointmentRow = ({ item }) => {
    const navigate = useNavigate();

    const handleViewClick = () => {
        navigate(`/appointments/${item.id}`);
    };

    // Function to get consistent pastel color for each mechanic
    const getMechanicColor = (mechanicName) => {
        const colorMap = {
            'Mike': { bg: '#dbeafe', text: '#1e40af' },    // Pastel Blue
            'Anna': { bg: '#fef3c7', text: '#92400e' },    // Pastel Yellow
            'Tom': { bg: '#dcfce7', text: '#166534' },     // Pastel Green
            'Luis': { bg: '#f3e8ff', text: '#6b21a8' },    // Pastel Purple
            'default': { bg: '#fee2e2', text: '#991b1b' }  // Pastel Red
        };

        return colorMap[mechanicName] || colorMap.default;
    };

    return (
        <tr className="border-t">
            <td className="px-4 py-2 text-sm">{item.id}</td>
            <td className="px-4 py-2 text-sm">{item.client}</td>
            <td className="px-4 py-2 text-sm">{item.contact}</td>
            <td className="px-4 py-2 text-sm">
                <span className="px-3 py-1 bg-gray-200 text-gray-800 rounded-full text-xs">
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
                                    borderRadius: '9999px'
                                }}
                            >
                                {mech}
                            </span>
                        );
                    })}
                </div>
            </td>
            <td className="px-4 py-2 text-center">
                <button 
                    onClick={handleViewClick}
                    className="text-gray-600 hover:text-black text-xl"
                >
                    <FiEye />
                </button>
            </td>
        </tr>
    );
};

export default AppointmentRow;
