import React, { useState } from 'react';
import DashboardLayout from '../../features/DashboardLayout';
import { useServicesQuery } from '@/hooks/useServices.query';
import { ServiceCard } from './components/ServiceCard';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import AddServiceModal from './components/AddServiceModal';
import { useAlert } from '@/hooks/useAlert';
import { useDeleteService } from '@/hooks/useServices.mutation';
import { Plus, Search } from 'lucide-react';

const ServiceConfigPage = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [serviceToEdit, setServiceToEdit] = useState(null);
  const [search, setSearch] = useState("");
  const [searchTrigger, setSearchTrigger] = useState("");

  const { data, error, isLoading } = useServicesQuery();
  const { mutate } = useDeleteService();
  const { showConfirm, AlertDialogProvider } = useAlert();

  const handleAddServiceClick = () => {
    setServiceToEdit(null);
    setIsModalOpen(true);
  };

  const handleEditServiceClick = (service) => {
    setServiceToEdit(service);
    setIsModalOpen(true);
  };

  const handleDelete = (id) => {
    showConfirm({
      title: 'Delete Item',
      description: 'Are you sure you want to delete this item permanently?',
      actionLabel: 'Yes, Delete It',
      onConfirm: () => mutate(id),
    });
  };

  const handleSearch = () => {
    setSearchTrigger(search);
  };

  const filteredServices = data?.data?.filter((service) =>
    service?.name?.toLowerCase().includes(searchTrigger.toLowerCase())
  );

  return (
    <>
      <AddServiceModal
        isOpen={isModalOpen}
        setIsOpen={setIsModalOpen}
        currentData={serviceToEdit}
      />

      <AlertDialogProvider>
        <Card className="w-full bg-transparent shadow-none border-0">

          {/* 🔍 SEARCH BAR ABOVE TITLE */}
          <form onSubmit={(e) => e.preventDefault()} className="flex items-center gap-3 mb-6">
            <input
              type="text"
              placeholder="Search services..."
              className="border rounded-lg px-3 py-2 w-full focus:ring-2 focus:ring-blue-500 focus:outline-none"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />

            <Button type="button" onClick={handleSearch} className="flex gap-2">
              <Search size={18} />
              Search
            </Button>

            <div className="flex items-center">
              <Button type="button" onClick={handleAddServiceClick}>
                <Plus />
                Add Service
              </Button>
            </div>
          </form>


          <CardHeader>
            <CardTitle className="text-2xl font-semibold">Services</CardTitle>
            <CardDescription className="line-clamp-3">
              Maintain your services here. You can add, edit, or delete services as needed.
            </CardDescription>
          </CardHeader>

          <CardContent>
            {isLoading && <p>Loading services...</p>}
            {error && <p className="text-red-500">Error loading services: {error.message}</p>}

            {!isLoading && filteredServices?.length === 0 && (
              <p>No services found.</p>
            )}

            {filteredServices?.length > 0 && (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {filteredServices.map((service) => (
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
