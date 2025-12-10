import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Plus } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useAddItem } from '@/hooks/useInventoryMutation'; 
import LoadingSpinner from '@/components/LoadingSpinner';

function AddItemModal({ itemCategories }) {
  const [itemDetails, setItemDetails] = useState({ 
    itemName: '', 
    category: '', 
    lowStockThreshold: 10, 
  });
  const [isOpen, setIsOpen] = useState(false);

  const {
    mutateAsync: addItemMutation,
    isPending: addItemMutationPending,
    isSuccess: addItemMutationSuccess,
    reset: resetAddItemMutation,
  } = useAddItem();


  useEffect(() => {
    if (addItemMutationSuccess) {
      setIsOpen(false);
      setItemDetails({ itemName: '', category: '', lowStockThreshold: 10 }); 
    }

    resetAddItemMutation();
  }, [addItemMutationSuccess, isOpen]);

  const handleSave = async (e) => {
    e.preventDefault();

    await addItemMutation(itemDetails);
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button className="min-w-36">
          <Plus /> Add Product
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add Product</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSave}>
          <div className="grid gap-4 mb-4">
            <div className="grid gap-3">
              <Label htmlFor="name">Item Name</Label>
              <Input
                onChange={(e) => setItemDetails({ ...itemDetails, itemName: e.target.value })}
                id="name"
                name="name"
                placeholder="Item name"
                value={itemDetails.itemName}
                required
              />
            </div>
            <div className="grid gap-3">
              <Label htmlFor="category">Item Category</Label>
              <Select
                id="category"
                name="category"
                value={itemDetails.category}
                onValueChange={(newValue) => setItemDetails({ ...itemDetails, category: newValue })}
                required
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select a category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    {itemCategories?.map((category) => (
                      <SelectItem key={category.id} value={category.categoryName}>
                        {category.categoryName}
                      </SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>
            
            {/* Low Stock Threshold Field Re-added */}
            <div className="grid gap-3">
              <Label htmlFor="lowStockThreshold">Low Stock Threshold</Label>
              <Input
                value={itemDetails.lowStockThreshold}
                onChange={(e) =>
                  setItemDetails({
                    ...itemDetails,
                    lowStockThreshold: e.target.value,
                  })
                }
                type="number"
                id="lowStockThreshold"
                name="lowStockThreshold"
                placeholder="Low stock threshold"
                min="0"
                required
              />
            </div>
          </div>
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline">Cancel</Button>
            </DialogClose>
            <Button type="submit">
              {addItemMutationPending ? (
                <span className="flex items-center gap-2">
                  <LoadingSpinner />
                  Saving
                </span>
              ) : (
                'Save'
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

export default AddItemModal;