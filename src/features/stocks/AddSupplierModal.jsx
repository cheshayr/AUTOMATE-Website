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
    companyName: "", contactPerson: "", email: "", contactNumber: "", address: "",
  });

  const { mutateAsync: addSupplierMutation, isPending } = useAddSupplier();

  const handleSave = async (e) => {
    e.preventDefault();
    if (!supplierDetails.companyName || !supplierDetails.contactPerson) {
      toast.error("Company Name and Contact Person are required.");
      return;
    }

    try {
      await addSupplierMutation(supplierDetails);
      setSupplierDetails({
        companyName: "", contactPerson: "", email: "", contactNumber: "", address: "",
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
              <Label htmlFor="contactPerson">Contact Person *</Label>
              <Input
                id="contactPerson"
                value={supplierDetails.contactPerson}
                onChange={(e) => setSupplierDetails({ ...supplierDetails, contactPerson: e.target.value })}
                required
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={supplierDetails.email}
                onChange={(e) => setSupplierDetails({ ...supplierDetails, email: e.target.value })}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="contactNumber">Contact Number</Label>
              <Input
                id="contactNumber"
                value={supplierDetails.contactNumber}
                onChange={(e) => setSupplierDetails({ ...supplierDetails, contactNumber: e.target.value })}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="address">Address</Label>
              <Input
                id="address"
                value={supplierDetails.address}
                onChange={(e) => setSupplierDetails({ ...supplierDetails, address: e.target.value })}
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
