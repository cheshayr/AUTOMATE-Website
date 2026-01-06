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
    stock: 0,
    price: 0,
    lowStockThreshold: 10,
  });

  const [isOpen, setIsOpen] = useState(false);

  const { 
    mutateAsync: addItemMutation, 
    isPending: addItemMutationPending, 
    isSuccess: addItemMutationSuccess, 
    reset: resetAddItemMutation 
  } = useAddItem();

  useEffect(() => {
    if (addItemMutationSuccess) {
      setIsOpen(false);
      setItemDetails({
        itemName: "",
        category: "",
        supplier: "",
        stock: 0,
        price: 0,
        lowStockThreshold: 10,
      });
      toast.success("Item added successfully!");
      resetAddItemMutation();
    }
  }, [addItemMutationSuccess, resetAddItemMutation]);

  const handleSave = async (e) => {
    e.preventDefault();
    if (!itemDetails.itemName || !itemDetails.category || !itemDetails.supplier) {
      toast.error("Please fill in Item Name, Category, and Supplier.");
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
          <Plus className="mr-2 h-4 w-4" /> Add Product
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[450px]">
        <DialogHeader>
          <DialogTitle>Add Product</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSave}>
          <div className="grid gap-4 mb-4 pt-4">
            
            {/* ITEM NAME */}
            <div className="grid gap-2">
              <Label htmlFor="name">Item Name</Label>
              <Input
                id="name"
                value={itemDetails.itemName}
                onChange={(e) => setItemDetails({ ...itemDetails, itemName: e.target.value })}
                required
              />
            </div>

            {/* Category Dropdown */}
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
        {/* We check if it's an array and has items */}
        {Array.isArray(itemCategories) && itemCategories.length > 0 ? (
          itemCategories.map((cat) => (
            <SelectItem key={cat._id || cat.id} value={cat.categoryName}>
              {cat.categoryName}
            </SelectItem>
          ))
        ) : (
          <SelectItem disabled value="none">
            {/* If you see this, the data isn't reaching the modal */}
            No categories found in system
          </SelectItem>
        )}
      </SelectGroup>
    </SelectContent>
  </Select>
</div>

            {/* SUPPLIER DROPDOWN */}
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

            {/* STOCK & PRICE */}
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

            <div className="grid gap-2">
              <Label htmlFor="price">Price</Label>
              <Input
                id="price"
                type="number"
                value={itemDetails.price}
                onChange={(e) => setItemDetails({ ...itemDetails, price: e.target.value })}
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