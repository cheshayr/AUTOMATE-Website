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
import authenticatedApi from "@/api/axiosInstance"; // your Axios instance
import LoadingSpinner from "@/components/LoadingSpinner";

const EditSupplierModal = ({ supplier, onSupplierUpdated, children }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [supplierDetails, setSupplierDetails] = useState({
    companyName: "",
    contactPerson: "",
    email: "",
    contactNumber: "",
    address: "",
  });
  const [isSaving, setIsSaving] = useState(false);

  // Sync modal state whenever supplier changes
  useEffect(() => {
    if (supplier) {
      setSupplierDetails({
        companyName: supplier.companyName || "",
        contactPerson: supplier.contactPerson || "",
        email: supplier.email || "",
        contactNumber: supplier.contactNumber || "",
        address: supplier.address || "",
      });
    }
  }, [supplier]);

  const handleSave = async (e) => {
    e.preventDefault();

    if (!supplier?._id) {
      toast.error("Supplier ID is missing");
      return;
    }

    const { companyName, contactPerson } = supplierDetails;
    if (!companyName || !contactPerson) {
      toast.error("Company Name and Contact Person are required");
      return;
    }

    setIsSaving(true);

    try {
      console.log("Updating supplier:", supplier._id, supplierDetails);

      // Send PUT request to backend
      const response = await authenticatedApi.put(
        `/suppliers/${supplier._id}`,
        supplierDetails
      );

      console.log("Update response:", response.data);

      toast.success("Supplier updated successfully!");

      // Call parent callback to update state
      if (onSupplierUpdated) onSupplierUpdated(response.data.data || response.data);

      // Close modal
      setIsOpen(false);
    } catch (error) {
      console.error("Failed to update supplier:", error);

      // Show detailed error if available
      const msg =
        error.response?.data?.message ||
        error.message ||
        "Unknown error. Check your backend.";

      toast.error("Failed to update supplier: " + msg);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-[450px]">
        <DialogHeader>
          <DialogTitle>Edit Supplier</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSave} className="grid gap-4">
          <div className="grid gap-2">
            <Label htmlFor="companyName">Company Name *</Label>
            <Input
              id="companyName"
              value={supplierDetails.companyName}
              onChange={(e) =>
                setSupplierDetails({ ...supplierDetails, companyName: e.target.value })
              }
              required
            />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="contactPerson">Contact Person *</Label>
            <Input
              id="contactPerson"
              value={supplierDetails.contactPerson}
              onChange={(e) =>
                setSupplierDetails({ ...supplierDetails, contactPerson: e.target.value })
              }
              required
            />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              value={supplierDetails.email}
              onChange={(e) =>
                setSupplierDetails({ ...supplierDetails, email: e.target.value })
              }
            />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="contactNumber">Contact Number</Label>
            <Input
              id="contactNumber"
              value={supplierDetails.contactNumber}
              onChange={(e) =>
                setSupplierDetails({ ...supplierDetails, contactNumber: e.target.value })
              }
            />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="address">Address</Label>
            <Input
              id="address"
              value={supplierDetails.address}
              onChange={(e) =>
                setSupplierDetails({ ...supplierDetails, address: e.target.value })
              }
            />
          </div>

          <DialogFooter className="flex justify-end space-x-2">
            <DialogClose asChild>
              <Button variant="outline" disabled={isSaving}>
                Cancel
              </Button>
            </DialogClose>
            <Button type="submit" disabled={isSaving}>
              {isSaving ? (
                <span className="flex items-center gap-2">
                  <LoadingSpinner /> Saving...
                </span>
              ) : (
                "Save"
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default EditSupplierModal;
