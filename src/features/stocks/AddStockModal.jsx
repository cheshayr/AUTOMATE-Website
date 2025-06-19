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
import { Plus, PlusCircle } from 'lucide-react';
import { useAddStock } from '@/hooks/useInventoryMutation';
import { useEffect, useState } from 'react';
import LoadingSpinner from '@/components/LoadingSpinner';

function AddStockModal({ id }) {
  const [stockQty, setStockQty] = useState(null);
  const [isOpen, setIsOpen] = useState(false);

  const {
    mutateAsync: addStockMutation,
    isPending: addStockMutationPending,
    isError: addStockMutationError,
    isSuccess: addStockMutationSuccess,
    reset: resetAddStockMutation,
  } = useAddStock();

  useEffect(() => {
    if (addStockMutationSuccess) {
      setIsOpen(false);
      setStockQty(null);
    }

    resetAddStockMutation();
  }, [addStockMutationSuccess, isOpen]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    await addStockMutation({ id, quantityToAdd: Number(stockQty) });
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button
          variant="outline"
          className="text-green-600 hover:text-green-700"
          size="icon"
        >
          <PlusCircle size={18} />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add New Stock</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 mb-4">
            <div className="grid gap-3">
              <Label htmlFor="stock ">Add Stock</Label>
              <Input
                type="number"
                id="stock"
                category="stock"
                placeholder="Stock"
                value={stockQty}
                onChange={(e) => setStockQty(e.target.value)}
              />
            </div>
          </div>
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline">Cancel</Button>
            </DialogClose>
            <Button type="submit">
              {addStockMutationPending ? (
                <span className="flex items-center gap-1">
                  <LoadingSpinner />
                  Adding
                </span>
              ) : (
                'Add'
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

export default AddStockModal;
