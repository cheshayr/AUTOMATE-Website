import React from 'react';
import '../../features/appointments/AppointmentsPage.css';

const Tabs = ({ tabs, activeTab, onTabChange }) => {
    return (
        <div className="tabs">
        {tabs.map((tab) => (
            <button
                key={tab}
                onClick={() => onTabChange(tab)}
                className={`px-4 py-2 rounded-t-lg font-medium transition-all duration-200 ${
                    activeTab === tab
                    ? "bg-blue-800 text-white shadow-md"
                    : "bg-white border border-gray-300 text-gray-700"
                }`}
            >
                {tab}
            </button>
        ))}
        </div>
    );
};

export default Tabs;
