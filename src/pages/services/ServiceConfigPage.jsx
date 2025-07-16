import React, { useState, useEffect } from 'react';
import DashboardLayout from '../../features/DashboardLayout';
import { useServicesQuery } from '@/hooks/useServices.query';
import { ServiceCard } from './components/ServiceCard';
import { Card, CardAction, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import AddServiceModal from './components/AddServiceModal';
import { useAlert } from '@/hooks/useAlert';
import { useDeleteService } from '@/hooks/useServices.mutation';
import { Plus } from 'lucide-react';

const ServiceConfigPage = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [serviceToEdit, setServiceToEdit] = useState(null); // State to hold data of service being edited

  const { data, error, isLoading } = useServicesQuery();
  console.log('🚀 ~ ServiceConfigPage ~ data:', data);
  const { mutate } = useDeleteService();

  const { showConfirm, AlertDialogProvider } = useAlert();

  const handleAddServiceClick = () => {
    setServiceToEdit(null); // Clear any existing edit data
    setIsModalOpen(true); // Open the modal for adding
  };

  const handleEditServiceClick = (service) => {
    setServiceToEdit(service); // Set the service data to be edited
    setIsModalOpen(true); // Open the modal for editing
  };

  const handleDelete = (id) => {
    showConfirm({
      title: 'Delete Item',
      description: 'Are you sure you want to delete this item permanently?',
      actionLabel: 'Yes, Delete It',
      onConfirm: () => {
        mutate(id);
      },
      onCancel: () => {
        console.log('Deletion cancelled.');
      },
    });
  };

  return (
    <>
      <AddServiceModal
        isOpen={isModalOpen}
        setIsOpen={setIsModalOpen}
        currentData={serviceToEdit} // Pass the data for editing
      />
      <AlertDialogProvider>
        <Card className="w-full bg-transparent shadow-none border-0">
          <CardHeader>
            <CardTitle className="text-2xl font-semibold">Services</CardTitle>
            <CardDescription className="line-clamp-3">
              Maintain your services here. You can add, edit, or delete services as needed.
            </CardDescription>
            <CardAction>
              <Button onClick={handleAddServiceClick}>
                <Plus />
                Add Service
              </Button>
            </CardAction>
          </CardHeader>
          <CardContent>
            {isLoading && <p>Loading services...</p>}
            {error && <p className="text-red-500">Error loading services: {error.message}</p>}
            {data?.data?.length === 0 && <p>No services available. Please add some.</p>}
            {data?.data?.length > 0 && (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {data?.data?.map((service, idx) => (
                  <ServiceCard
                    key={service._id}
                    data={service}
                    handleDelete={() => handleDelete(service._id)}
                    handleEdit={() => handleEditServiceClick(service)}
                  />
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </AlertDialogProvider>
    </>
  );
};

export default ServiceConfigPage;
