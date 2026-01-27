import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import authenticatedApi from "@/api/axiosInstance"; 
import LoadingSpinner from "@/components/LoadingSpinner";

const EditSupplierModal = ({ supplier, onSupplierUpdated, children }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [supplierDetails, setSupplierDetails] = useState({
    companyName: "",
    email: "",
    contactNumber: "",
    address: "",
  });
  const [isSaving, setIsSaving] = useState(false);

  // Sync state when modal opens or supplier changes
  useEffect(() => {
    if (supplier && isOpen) {
      setSupplierDetails({
        companyName: supplier.companyName || "",
        email: supplier.email || "",
        contactNumber: supplier.contactNumber || "",
        address: supplier.address || "",
      });
    }
  }, [supplier, isOpen]);

  const handleSave = async (e) => {
    e.preventDefault();

    // Ensure we have a valid ID before sending the request
    const supplierId = supplier?._id || supplier?.id;

    if (!supplierId || supplierId === "undefined") {
      console.error("ID ERROR: The supplier object is missing an ID!", supplier);
      toast.error("Critical Error: Supplier ID not found.");
      return;
    }

    // Validation check for required fields
    if (!supplierDetails.companyName || !supplierDetails.contactNumber || !supplierDetails.address) {
      toast.error("Company Name, Contact Number, and Address are required.");
      return;
    }

    setIsSaving(true);

    try {
      const response = await authenticatedApi.patch(
        `/inventory/suppliers/${supplierId}`,
        supplierDetails
      );

      if (response.status === 200 || response.status === 201) {
        toast.success("Supplier updated successfully!");
        
        // Pass the updated data back to the parent to refresh the UI
        const updatedData = response.data?.data || response.data;
        if (onSupplierUpdated) onSupplierUpdated(updatedData);
        
        setIsOpen(false);
      }
    } catch (error) {
      console.error("Update failed:", error);
      const msg = error.response?.data?.message || "Check your backend connection.";
      toast.error("Failed to update: " + msg);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-[450px]">
        <DialogHeader>
          <DialogTitle>Edit Supplier Details</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSave} className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="companyName">Company Name *</Label>
            <Input
              id="companyName"
              value={supplierDetails.companyName}
              onChange={(e) => setSupplierDetails({ ...supplierDetails, companyName: e.target.value })}
              required
            />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="optional@email.com"
              value={supplierDetails.email}
              onChange={(e) => setSupplierDetails({ ...supplierDetails, email: e.target.value })}
            />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="contactNumber">Contact Number *</Label>
            <Input
              id="contactNumber"
              value={supplierDetails.contactNumber}
              onChange={(e) => setSupplierDetails({ ...supplierDetails, contactNumber: e.target.value })}
              required
            />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="address">Address *</Label>
            <Input
              id="address"
              value={supplierDetails.address}
              onChange={(e) => setSupplierDetails({ ...supplierDetails, address: e.target.value })}
              required
            />
          </div>

          <DialogFooter className="mt-4">
            <DialogClose asChild>
              <Button variant="outline" type="button" disabled={isSaving}>Cancel</Button>
            </DialogClose>
            <Button type="submit" disabled={isSaving}>
              {isSaving ? (
                <span className="flex items-center gap-2">
                  <LoadingSpinner /> Saving...
                </span>
              ) : (
                "Save Changes"
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default EditSupplierModal;