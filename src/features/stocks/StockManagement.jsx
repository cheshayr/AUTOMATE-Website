import React from 'react';
import DashboardLayout from '../DashboardLayout';
import '../dashboard/Dashboard.css';

const stocks = [
    { name: 'Prestone Super Heavy Duty Break Fluid 150mL', category: "brake fluid", quantity: '4', status: 'in stock', price: '₱139' },
    { name: 'Little Trees Car Air Freshener (Black Ice)', category: "air freshener", quantity: '0', status: 'out stock', price: '₱69' },
    { name: 'Eneos Synthetic Motor Oil SAE 10W-40 4L', category: "motor oil", quantity: '2', status: 'in stock', price: '₱1,699' },
];

const StockManagement = () => {
    return (
        <DashboardLayout>
            <div className='min-h-screen bg-[#f5f7ff] p-6'>
                <div className='bg-white rounded-2xl shadow-mp p-6'>
                    <h1 className='text-2xl font-bold mb-4 text-gray-800'>Stock Management</h1>
                </div>
                <div className="table-wrapper">
                <table className="appointments-table">
                <thead className="bg-gray-100">
                    <tr>
                    <th className="px-4 py-2 text-sm">Name</th>
                    <th className="px-4 py-2 text-sm">Category</th>
                    <th className="px-4 py-2 text-sm">Quantity</th>
                    <th className="px-4 py-2 text-sm">Status</th>
                    <th className="px-4 py-2 text-sm">Retail Price</th>
                    </tr>
                </thead>
                <tbody>
                    {stocks.length > 0 ? (
                    stocks.map((item, index) => (
                        <tr key={index} className="border-t">
                        <td className="px-4 py-2 text-sm">{item.name}</td>
                        <td className="px-4 py-2 text-sm">{item.category}</td>
                        <td className="px-4 py-2 text-sm">{item.quantity}</td>
                        <td className="px-4 py-2 text-sm">
                            <span className="px-3 py-1 bg-gray-200 text-gray-800 rounded-full text-xs">
                            {item.status}
                            </span>
                        </td>
                        <td className="px-4 py-2 text-sm">{item.price}</td>
                        </tr>
                    ))
                    ) : (
                    <tr>
                        <td colSpan="6" className="px-4 py-6 text-center text-gray-400">
                        No stocks found. 
                        </td>
                    </tr>
                    )}
                </tbody>
                </table>
            </div>
            </div>
        </DashboardLayout>
    )
}

export default StockManagement