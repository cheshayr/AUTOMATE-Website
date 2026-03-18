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
import { Plus, Search, Download } from 'lucide-react';

// PDF Export
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { format } from 'date-fns';
import logo from '@/assets/logo.png';

const ServiceConfigPage = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [serviceToEdit, setServiceToEdit] = useState(null);

  // Search state
  const [search, setSearch] = useState('');
  const [preparedBy, setPreparedBy] = useState('');
  const [exportScope, setExportScope] = useState('page');

  const { data, error, isLoading } = useServicesQuery();
  const { mutate } = useDeleteService();
  const { showConfirm } = useAlert();

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

  const filteredServices = data?.data?.filter((service) =>
    service?.name?.toLowerCase().includes(search.toLowerCase())
  );

  // ================= PDF Export =================
  const COMPANY_NAME = "Tierodman Auto Center";

  const handleExportPDF = () => {
    if (!preparedBy.trim()) {
      alert('Please enter "Prepared By" before exporting.');
      return;
    }

    const exportData = exportScope === 'all' ? filteredServices : filteredServices?.slice(0, 20);

    if (!exportData || exportData.length === 0) {
      alert('No services to export.');
      return;
    }

    const doc = new jsPDF();
    const exportedAt = format(new Date(), "MMM dd, yyyy • hh:mm a");

    autoTable(doc, {
      head: [['Service Name', 'Description', 'Price Starts At (₱)']],
      body: exportData.map((s) => [
        s.name || 'N/A',
        s.description || 'N/A',
        s.rangeMin || 0,
      ]),
      startY: 70,
      styles: { fontSize: 9 },
      headStyles: { fillColor: [71, 85, 105] },

      didDrawPage: function () {
        const pageHeight = doc.internal.pageSize.height;
        const pageWidth = doc.internal.pageSize.width;
        const pageNumber = doc.internal.getCurrentPageInfo().pageNumber;
        const pageCount = doc.internal.getNumberOfPages();

        if (pageNumber === 1) {
          // Logo
          doc.addImage(logo, 'PNG', 14, 10, 20, 20);

          // Title
          doc.setFontSize(16);
          doc.text('Services Report', pageWidth / 2, 20, { align: 'center' });

          // Company name
          doc.setFontSize(10);
          doc.text(COMPANY_NAME, pageWidth / 2, 26, { align: 'center' });

          // Details
          doc.text(`Prepared By: ${preparedBy}`, 14, 40);
          doc.text(`Exported: ${exportedAt}`, 14, 46);
          doc.text(
            `Scope: ${exportScope === 'all' ? 'All Services' : 'Current Page'}`,
            14,
            52
          );

          // Divider
          doc.setLineWidth(0.3);
          doc.line(14, 58, pageWidth - 14, 58);
        }

        // Footer (all pages)
        doc.setLineWidth(0.3);
        doc.line(14, pageHeight - 15, pageWidth - 14, pageHeight - 15);

        doc.setFontSize(9);
        doc.text(COMPANY_NAME, 14, pageHeight - 8);
        doc.text(`Page ${pageNumber} of ${pageCount}`, pageWidth - 14, pageHeight - 8, { align: 'right' });
      },
    });

    doc.save(`services_${format(new Date(), "yyyy-MM-dd")}.pdf`);
  };

  return (
    <>
      <AddServiceModal
        isOpen={isModalOpen}
        setIsOpen={setIsModalOpen}
        currentData={serviceToEdit}
      />

      <Card className="w-full bg-transparent shadow-none border-0">
        {/* SEARCH + ADD + EXPORT */}
        <div className="flex flex-col sm:flex-row items-end sm:items-center gap-3 mb-6 w-full">
          {/* Left: Search + Add */}
          <div className="flex flex-1 gap-3 w-full">
            <input
              type="text"
              placeholder="Search services..."
              className="border rounded-lg px-3 py-2 w-full focus:ring-2 focus:ring-blue-500 focus:outline-none"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            <Button className="flex gap-2">
              <Search size={18} /> Search
            </Button>
            <Button onClick={handleAddServiceClick} className="flex gap-2">
              <Plus size={18} /> Add Service
            </Button>
          </div>

          {/* Right: Prepared By + Scope + Export PDF */}
          <div className="flex flex-wrap gap-2 items-center">
            <input
              type="text"
              placeholder="Prepared By"
              value={preparedBy}
              onChange={(e) => setPreparedBy(e.target.value)}
              className="border rounded-lg px-2 py-2"
            />
            <select
              value={exportScope}
              onChange={(e) => setExportScope(e.target.value)}
              className="h-10 px-2 border rounded-md bg-background text-sm"
            >
              <option value="page">Current Page</option>
              <option value="all">All Services</option>
            </select>
            <Button variant="outline" onClick={handleExportPDF} className="flex gap-2 h-10">
              <Download size={18} /> Export PDF
            </Button>
          </div>
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