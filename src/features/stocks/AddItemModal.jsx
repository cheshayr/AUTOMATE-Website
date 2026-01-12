import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Plus } from "lucide-react";
import { useEffect, useState } from "react";
import { useAddItem } from "@/hooks/useInventoryMutation";
import { useCreateTransaction } from "@/hooks/useTransactionMutation"; // IMPORTANT: Add this hook
import LoadingSpinner from "@/components/LoadingSpinner";
import { toast } from "sonner";

function AddItemModal({ itemCategories, suppliers }) {
  const [itemDetails, setItemDetails] = useState({
    itemName: "",
    category: "",
    supplier: "", // This stores the ID from the dropdown
    stock: 0,
    lowStockThreshold: 10,
  });

  const [isOpen, setIsOpen] = useState(false);

  const { 
    mutateAsync: addItemMutation, 
    isPending: addItemMutationPending, 
    isSuccess: addItemMutationSuccess, 
    reset: resetAddItemMutation 
  } = useAddItem();

  const { mutateAsync: createTransaction } = useCreateTransaction();

  useEffect(() => {
    if (addItemMutationSuccess) {
      setIsOpen(false);
      setItemDetails({
        itemName: "",
        category: "",
        supplier: "",
        stock: 0,
        lowStockThreshold: 10,
      });
      resetAddItemMutation();
    }
  }, [addItemMutationSuccess, resetAddItemMutation]);

  const handleSave = async (e) => {
    e.preventDefault();
    if (!itemDetails.itemName || !itemDetails.category || !itemDetails.supplier) {
      toast.error("Please fill in Item Name, Category, and Supplier.");
      return;
    }

    try {
      // 1. Find the Actual Company Name from the suppliers list using the ID
      const selectedSupplier = suppliers?.find(s => s._id === itemDetails.supplier);
      const companyName = selectedSupplier ? selectedSupplier.companyName : "Unknown";

      // 2. Add the Item to Inventory
      await addItemMutation({
        ...itemDetails,
        stock: Number(itemDetails.stock),
        lowStockThreshold: Number(itemDetails.lowStockThreshold),
      });

      // 3. Create the Transaction (This makes it show up in the History Modal)
      if (Number(itemDetails.stock) > 0) {
        await createTransaction({
          itemName: itemDetails.itemName,
          supplierName: companyName, // Sending the string name, not the ID
          type: "IN",
          quantity: Number(itemDetails.stock),
          reason: "Initial Stock",
          remarks: "Product Registration",
          dateTime: new Date(),
        });
      }
      
      toast.success("Item added and transaction recorded!");
    } catch (err) {
      console.error(err);
      toast.error("Error saving product.");
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button className="min-w-36">
          <Plus className="mr-2 h-4 w-4" /> Add Product
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[450px]">
        <DialogHeader>
          <DialogTitle>Add Product</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSave}>
          <div className="grid gap-4 mb-4 pt-4">
            <div className="grid gap-2">
              <Label htmlFor="name">Item Name</Label>
              <Input
                id="name"
                value={itemDetails.itemName}
                onChange={(e) => setItemDetails({ ...itemDetails, itemName: e.target.value })}
                required
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="category">Category</Label>
              <Select
                value={itemDetails.category}
                onValueChange={(val) => setItemDetails({ ...itemDetails, category: val })}
                required
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select a category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    {itemCategories?.map((cat) => (
                      <SelectItem key={cat._id} value={cat.categoryName}>
                        {cat.categoryName}
                      </SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="supplier">Supplier</Label>
              <Select
                value={itemDetails.supplier}
                onValueChange={(val) => setItemDetails({ ...itemDetails, supplier: val })}
                required
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select a supplier" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    {suppliers?.map((s) => (
                      <SelectItem key={s._id} value={s._id}>
                        {s.companyName}
                      </SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="stock">Initial Stock</Label>
              <Input
                id="stock"
                type="number"
                value={itemDetails.stock}
                onChange={(e) => setItemDetails({ ...itemDetails, stock: e.target.value })}
                required
              />
            </div>
          </div>

          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline" type="button">Cancel</Button>
            </DialogClose>
            <Button type="submit" disabled={addItemMutationPending}>
              {addItemMutationPending ? "Saving..." : "Save Product"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

export default AddItemModal;