import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog, DialogClose, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import LoadingSpinner from "@/components/LoadingSpinner";
import { useAddSupplier } from "@/hooks/useSupplierMutation";

function AddSupplierModal({ children }) {
  const [isOpen, setIsOpen] = useState(false);
  const [supplierDetails, setSupplierDetails] = useState({
    companyName: "", 
    email: "", 
    contactNumber: "", 
    address: "",
  });

  const { mutateAsync: addSupplierMutation, isPending } = useAddSupplier();

  const handleSave = async (e) => {
    e.preventDefault();

    // Strict validation for required fields
    if (!supplierDetails.companyName || !supplierDetails.contactNumber || !supplierDetails.address) {
      toast.error("Company Name, Contact Number, and Address are required.");
      return;
    }

    try {
      await addSupplierMutation(supplierDetails);
      // Reset state
      setSupplierDetails({
        companyName: "", email: "", contactNumber: "", address: "",
      });
      setIsOpen(false);
      toast.success("Supplier added successfully!");
    } catch (err) {
      console.error(err);
      toast.error("Failed to add supplier. Please try again.");
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-[450px]">
        <DialogHeader>
          <DialogTitle>Add Supplier</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSave}>
          <div className="grid gap-4 mb-4">
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
                placeholder="e.g. +1 234 567 890"
                value={supplierDetails.contactNumber}
                onChange={(e) => setSupplierDetails({ ...supplierDetails, contactNumber: e.target.value })}
                required
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="address">Address *</Label>
              <Input
                id="address"
                placeholder="Full business address"
                value={supplierDetails.address}
                onChange={(e) => setSupplierDetails({ ...supplierDetails, address: e.target.value })}
                required
              />
            </div>
          </div>

          <DialogFooter className="flex justify-end space-x-2">
            <DialogClose asChild>
              <Button variant="outline">Cancel</Button>
            </DialogClose>
            <Button type="submit" disabled={isPending}>
              {isPending ? <span className="flex items-center gap-2"><LoadingSpinner /> Saving</span> : "Save"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

export default AddSupplierModal;
