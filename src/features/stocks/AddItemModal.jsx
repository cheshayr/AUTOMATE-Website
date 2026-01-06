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
import LoadingSpinner from "@/components/LoadingSpinner";
import { toast } from "sonner";

function AddItemModal({ itemCategories, suppliers }) {
  const [itemDetails, setItemDetails] = useState({
    itemName: "",
    category: "",
    supplier: "",
    unit: "",
    stock: 0,
    price: 0,
    lowStockThreshold: 10,
  });

  const [isOpen, setIsOpen] = useState(false);

  const { mutateAsync: addItemMutation, isPending: addItemMutationPending, isSuccess: addItemMutationSuccess, reset: resetAddItemMutation } = useAddItem();

  useEffect(() => {
    if (addItemMutationSuccess) {
      setIsOpen(false);
      setItemDetails({
        itemName: "",
        category: "",
        supplier: "",
        unit: "",
        stock: 0,
        price: 0,
        lowStockThreshold: 10,
      });
      toast.success("Item added successfully!");
    }
    resetAddItemMutation();
  }, [addItemMutationSuccess, resetAddItemMutation]);

  const handleSave = async (e) => {
    e.preventDefault();

    if (!itemDetails.itemName || !itemDetails.category || !itemDetails.supplier) {
      toast.error("Please complete all required fields: Item Name, Category, Supplier.");
      return;
    }

    await addItemMutation({
      ...itemDetails,
      stock: Number(itemDetails.stock),
      price: Number(itemDetails.price),
      lowStockThreshold: Number(itemDetails.lowStockThreshold),
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button className="min-w-36">
          <Plus /> Add Product
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[450px]">
        <DialogHeader>
          <DialogTitle>Add Product</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSave}>
          <div className="grid gap-4 mb-4">
            {/* Item Name */}
            <div className="grid gap-2">
              <Label htmlFor="name">Item Name</Label>
              <Input
                id="name"
                placeholder="Item Name"
                value={itemDetails.itemName}
                onChange={(e) => setItemDetails({ ...itemDetails, itemName: e.target.value })}
                required
              />
            </div>

            {/* Category */}
            <div className="grid gap-2">
              <Label htmlFor="category">Category</Label>
              <Select
                id="category"
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
                      <SelectItem key={cat.id} value={cat.categoryName}>
                        {cat.categoryName}
                      </SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>

            {/* Supplier */}
            <div className="grid gap-2">
              <Label htmlFor="supplier">Supplier</Label>
              <Select
                id="supplier"
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
                        {s.companyName} ({s.contactPerson})
                      </SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>

            {/* Unit */}
            <div className="grid gap-2">
              <Label htmlFor="unit">Unit</Label>
              <Input
                id="unit"
                placeholder="pcs, liters, etc."
                value={itemDetails.unit}
                onChange={(e) => setItemDetails({ ...itemDetails, unit: e.target.value })}
                required
              />
            </div>

            {/* Stock */}
            <div className="grid gap-2">
              <Label htmlFor="stock">Initial Stock</Label>
              <Input
                id="stock"
                type="number"
                min="0"
                placeholder="Stock quantity"
                value={itemDetails.stock}
                onChange={(e) => setItemDetails({ ...itemDetails, stock: e.target.value })}
                required
              />
            </div>

            {/* Price */}
            <div className="grid gap-2">
              <Label htmlFor="price">Price *</Label>
              <Input
                id="price"
                type="number"
                min="0"
                placeholder="Price per unit"
                value={itemDetails.price}
                onChange={(e) => setItemDetails({ ...itemDetails, price: e.target.value })}
                required
              />
            </div>

            {/* Low Stock Threshold */}
            <div className="grid gap-2">
              <Label htmlFor="lowStockThreshold">Low Stock Threshold</Label>
              <Input
                id="lowStockThreshold"
                type="number"
                min="0"
                placeholder="Low stock threshold"
                value={itemDetails.lowStockThreshold}
                onChange={(e) => setItemDetails({ ...itemDetails, lowStockThreshold: e.target.value })}
                required
              />
            </div>
          </div>

          <DialogFooter className="flex justify-end space-x-2">
            <DialogClose asChild>
              <Button variant="outline">Cancel</Button>
            </DialogClose>
            <Button type="submit" disabled={addItemMutationPending}>
              {addItemMutationPending ? (
                <span className="flex items-center gap-2">
                  <LoadingSpinner /> Saving
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
}

export default AddItemModal;
