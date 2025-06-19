import React, { useState } from "react";
import "../pages/dashboard/Dashboard.css";
import { FiEye } from "react-icons/fi";

const tabs = ["For Approval", "Ongoing Repair", "Completed"];

const AppointmentPage = ({ data }) => {
  const [activeTab, setActiveTab] = useState("For Approval");

  const filteredData = data.filter((item) => item.status === activeTab);

  return (
    <div className="p-6 bg-[#f5f7ff] min-h-screen">
      <h1 className="text-2xl font-bold mb-4">Appointments</h1>

      {}
      <div className="flex space-x-2 mb-6">
        {tabs.map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
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

      {}
      <div className="bg-white rounded-lg shadow-md overflow-x-auto">
        <table className="w-full text-left table-auto">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-4 py-2 text-sm">ID</th>
              <th className="px-4 py-2 text-sm">Client</th>
              <th className="px-4 py-2 text-sm">Contact</th>
              <th className="px-4 py-2 text-sm">Status</th>
              <th className="px-4 py-2 text-sm">Mechanic</th>
              <th className="px-4 py-2 text-sm text-center">Action</th>
            </tr>
          </thead>
          <tbody>
            {filteredData.length > 0 ? (
              filteredData.map((item, index) => (
                <tr key={index} className="border-t">
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
              ))
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
    </div>
  );
};

export default AppointmentPage;
