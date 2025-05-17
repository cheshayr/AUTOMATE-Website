import React from 'react';
import { FiEye } from "react-icons/fi";

const AppointmentRow = ({ item }) => {
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
                <div className="flex flex-wrap gap-1">
                    {item.mechanics.map((mech, i) => (
                        <span
                            key={i}
                            className="px-3 py-1 bg-blue-800 text-white text-xs rounded-full"
                        >
                            {mech}
                        </span>
                    ))}
                </div>
            </td>
            <td className="px-4 py-2 text-center">
                <button className="text-gray-600 hover:text-black text-xl">
                    <FiEye />
                </button>
            </td>
        </tr>
    );
};

export default AppointmentRow;
