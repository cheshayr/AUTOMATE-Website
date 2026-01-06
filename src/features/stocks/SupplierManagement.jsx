import React, { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Edit, Trash2, Plus, Loader2 } from "lucide-react";
import { toast } from "sonner";

import AddSupplierModal from "./AddSupplierModal";
import EditSupplierModal from "./EditSupplierModal";
import { useFetchSuppliers } from "@/hooks/useSupplierQuery";
import { useDeleteSupplier } from "@/hooks/useSupplierMutation";
import LoadingSpinner from "@/components/LoadingSpinner";

const SuppliersManagement = () => {
  const { data: suppliersData, isPending: fetchingSuppliers } = useFetchSuppliers();
  const { mutateAsync: deleteSupplier, isPending: deleting } = useDeleteSupplier();

  // Local state to manage suppliers for instant UI updates
  const [suppliers, setSuppliers] = useState([]);

  // Sync local suppliers when data from query changes
  useEffect(() => {
    if (suppliersData?.data) {
      setSuppliers(suppliersData.data);
    }
  }, [suppliersData]);

  const handleDelete = async (id) => {
    if (!confirm("Are you sure you want to delete this supplier?")) return;

    try {
      await deleteSupplier(id);
      setSuppliers((prev) => prev.filter((s) => s._id !== id));
      toast.success("Supplier deleted successfully!");
    } catch (err) {
      console.error(err);
      toast.error("Failed to delete supplier.");
    }
  };

  const handleSupplierUpdate = (updatedSupplier) => {
    setSuppliers((prev) =>
      prev.map((s) => (s._id === updatedSupplier._id ? updatedSupplier : s))
    );
  };

  return (
    <Card className="w-full bg-transparent shadow-none border-0">
      <CardHeader className="flex justify-between items-center">
        <div>
          <CardTitle className="text-2xl font-semibold">Suppliers</CardTitle>
          <CardDescription>View, edit, or delete suppliers</CardDescription>
        </div>

        <AddSupplierModal>
          <Button className="flex items-center gap-2">
            <Plus /> Add Supplier
          </Button>
        </AddSupplierModal>
      </CardHeader>

      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Company Name</TableHead>
              <TableHead>Contact Person</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Contact Number</TableHead>
              <TableHead>Address</TableHead>
              <TableHead className="text-center">Actions</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {fetchingSuppliers ? (
              <TableRow>
                <TableCell colSpan={6} className="h-96 text-center">
                  <LoadingSpinner />
                </TableCell>
              </TableRow>
            ) : suppliers.length > 0 ? (
              suppliers.map((supplier) => (
                <TableRow key={supplier._id}>
                  <TableCell>{supplier.companyName}</TableCell>
                  <TableCell>{supplier.contactPerson}</TableCell>
                  <TableCell>{supplier.email || "N/A"}</TableCell>
                  <TableCell>{supplier.contactNumber || "N/A"}</TableCell>
                  <TableCell>{supplier.address || "N/A"}</TableCell>
                  <TableCell className="flex justify-center space-x-2">
                    <EditSupplierModal
                      supplier={supplier}
                      onSupplierUpdated={handleSupplierUpdate}
                    >
                      <Button size="icon" variant="ghost">
                        <Edit size={16} />
                      </Button>
                    </EditSupplierModal>

                    <Button
                      size="icon"
                      variant="destructive"
                      onClick={() => handleDelete(supplier._id)}
                      disabled={deleting}
                    >
                      {deleting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Trash2 size={16} />}
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={6} className="h-96 text-center">
                  No suppliers found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};

export default SuppliersManagement;
