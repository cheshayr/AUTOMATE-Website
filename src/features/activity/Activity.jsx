import React from 'react'
import DashboardLayout from '../DashboardLayout'

const Activity = () => {
    return (
        <DashboardLayout>
            <div className='min-h-screen bg-[#f5f7ff] p-6'>
                <div className='bg-white rounded-2xl shadow-mp p-6'>
                    <h1 className='text-2xl font-bold mb-4 text-gray-800'>Activity</h1>
                </div>
            </div>
        </DashboardLayout>
    )
}

export default Activity