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

function AddItemModal({ isAdd = true, item = {} }) {
  const [itemDetails, setItemDetails] = useState(item);

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle form submission logic here
    alert('Form submitted');
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        {isAdd ? (
          <Button>
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
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 mb-4">
            <div className="grid gap-3">
              <Label htmlFor="name">Item Name</Label>
              <Input
                onChange={(e) =>
                  setItemDetails({ ...item, itemName: e.target.value })
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
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select a category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectItem value="Furniture">Furniture</SelectItem>
                    <SelectItem value="Electronics">Electronics</SelectItem>
                    <SelectItem value="Monitors">Monitors</SelectItem>
                    <SelectItem value="Accessories">Accessories</SelectItem>
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
                      ...item,
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
                      ...item,
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
                  setItemDetails({ ...item, lowStockThreshold: e.target.value })
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
              <Button type="submit">Save</Button>
            ) : (
              <Button type="submit">Update</Button>
            )}
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

export default AddItemModal;
