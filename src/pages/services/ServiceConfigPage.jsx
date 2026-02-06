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

  // 🔍 Single search state (focus-safe)
  const [search, setSearch] = useState('');

  const { data, error, isLoading } = useServicesQuery();
  const { mutate } = useDeleteService();
  const { showConfirm } = useAlert(); // ❗ Provider REMOVED from here

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

  // ✅ Live filtering (no submit, no remount)
  const filteredServices = data?.data?.filter((service) =>
    service?.name?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <>
      <AddServiceModal
        isOpen={isModalOpen}
        setIsOpen={setIsModalOpen}
        currentData={serviceToEdit}
      />

      <Card className="w-full bg-transparent shadow-none border-0">
        {/* 🔍 SEARCH BAR */}
        <div className="flex items-center gap-3 mb-6">
          <div className="relative w-full">
            <input
              type="text"
              placeholder="Search services..."
              className="border rounded-lg px-3 py-2 w-full focus:ring-2 focus:ring-blue-500 focus:outline-none"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              autoFocus
            />
          </div>

          <Button type="button" className="flex gap-2">
            <Search size={18} />
            Search
          </Button>

          <Button
            type="button"
            onClick={handleAddServiceClick}
            className="flex gap-2"
          >
            <Plus size={18} />
            Add Service
          </Button>
        </div>

        <CardHeader>
          <CardTitle className="text-2xl font-semibold">Services</CardTitle>
          <CardDescription>
            Maintain your services here. You can add, edit, or delete services as needed.
          </CardDescription>
        </CardHeader>

        <CardContent>
          {isLoading && <p>Loading services...</p>}
          {error && <p className="text-red-500">Error loading services: {error.message}</p>}

          {!isLoading && filteredServices?.length === 0 && (
            <div className="text-center py-10">
              <p className="text-gray-500">
                No services found{search && ` for "${search}"`}
              </p>
              {search && (
                <Button variant="link" onClick={() => setSearch('')}>
                  Clear search
                </Button>
              )}
            </div>
          )}

          {filteredServices?.length > 0 && (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {filteredServices.map((service) => (
                <ServiceCard
                  key={service._id || service.id}
                  data={service}
                  handleDelete={() => handleDelete(service._id)}
                  handleEdit={() => handleEditServiceClick(service)}
                />
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </>
  );
};

export default ServiceConfigPage;

