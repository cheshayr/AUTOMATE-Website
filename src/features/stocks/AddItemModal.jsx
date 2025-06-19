import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
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
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Eye, Plus } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useAddItem, useUpdateItem } from '@/hooks/useInventoryMutation';
import LoadingSpinner from '@/components/LoadingSpinner';

function AddItemModal({ isAdd = true, item = {}, itemCategories }) {
  const [itemDetails, setItemDetails] = useState(item);
  const [isOpen, setIsOpen] = useState(false);

  const {
    mutateAsync: addItemMutation,
    isPending: addItemMutationPending,
    isError: addItemMutationError,
    isSuccess: addItemMutationSuccess,
    reset: resetAddItemMutation,
  } = useAddItem();

  const {
    mutateAsync: updateItemMutation,
    isPending: updateItemMutationPending,
    isError: updateItemMutationError,
    isSuccess: updateItemMutationSuccess,
    reset: resetUpdateItemMutation,
  } = useUpdateItem();

  useEffect(() => {
    if (addItemMutationSuccess || updateItemMutationSuccess) {
      setIsOpen(false);
    }

    isAdd && setItemDetails({});

    resetAddItemMutation();
    resetUpdateItemMutation();
  }, [addItemMutationSuccess, updateItemMutationSuccess, isOpen]);

  const handleSave = async (e) => {
    e.preventDefault();

    await addItemMutation(itemDetails);
  };

  const handleUpdate = async (e) => {
    e.preventDefault();

    await updateItemMutation(itemDetails);
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        {isAdd ? (
          <Button className="min-w-40">
            <Plus /> Add Item
          </Button>
        ) : (
          <Button
            variant="outline"
            className="text-blue-600 hover:text-blue-700"
            size="icon"
          >
            <Eye size={18} />
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{isAdd ? 'Add Item' : 'Item Details'}</DialogTitle>
        </DialogHeader>
        <form>
          <div className="grid gap-4 mb-4">
            <div className="grid gap-3">
              <Label htmlFor="name">Item Name</Label>
              <Input
                onChange={(e) =>
                  setItemDetails({ ...itemDetails, itemName: e.target.value })
                }
                id="name"
                name="name"
                placeholder="Item name"
                value={itemDetails.itemName}
              />
            </div>
            <div className="grid gap-3">
              <Label htmlFor="category">Item Category</Label>
              <Select
                disabled={!isAdd}
                id="category"
                name="category"
                value={itemDetails.category}
                onValueChange={(newValue) =>
                  setItemDetails({ ...itemDetails, category: newValue })
                }
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select a category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectItem value="All">All</SelectItem>
                    {itemCategories?.map((category) => (
                      <SelectItem
                        key={category.id}
                        value={category.categoryName}
                      >
                        {category.categoryName}
                      </SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>
            <div className="flex gap-4">
              <div className="grid gap-3">
                <Label htmlFor="stock">Item Stock</Label>
                <Input
                  value={itemDetails.stock}
                  onChange={(e) =>
                    setItemDetails({
                      ...itemDetails,
                      stock: e.target.value,
                    })
                  }
                  type="number"
                  id="stock"
                  name="stock"
                  placeholder="Stock"
                />
              </div>
              <div className="grid gap-3">
                <Label htmlFor="price">Item Price</Label>
                <Input
                  value={itemDetails.price}
                  onChange={(e) =>
                    setItemDetails({
                      ...itemDetails,
                      price: e.target.value,
                    })
                  }
                  type="number"
                  id="price"
                  name="price"
                  placeholder="Price"
                />
              </div>
            </div>
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
              />
            </div>
          </div>
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline">Cancel</Button>
            </DialogClose>
            {isAdd ? (
              <Button onClick={handleSave}>
                {addItemMutationPending ? (
                  <span className="flex items-center gap-2">
                    <LoadingSpinner />
                    Saving
                  </span>
                ) : (
                  'Save'
                )}
              </Button>
            ) : (
              <Button onClick={handleUpdate}>
                {updateItemMutationPending ? (
                  <span className="flex items-center gap-2">
                    <LoadingSpinner />
                    Updating
                  </span>
                ) : (
                  'Update'
                )}
              </Button>
            )}
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

export default AddItemModal;
