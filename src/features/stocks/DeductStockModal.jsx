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
import { MinusCircle, Plus, PlusCircle } from 'lucide-react';
import { useDeductStock } from '@/hooks/useInventoryMutation';
import LoadingSpinner from '@/components/LoadingSpinner';
import { useEffect, useState } from 'react';

function DeductStockModal({ id }) {
  const [stockQty, setStockQty] = useState(null);
  const [isOpen, setIsOpen] = useState(false);

  const {
    mutateAsync: deductStockMutation,
    isPending: deductStockMutationPending,
    isError: deductStockMutationError,
    isSuccess: deductStockMutationSuccess,
    reset: resetDeductStockMutation,
  } = useDeductStock();

  useEffect(() => {
    if (deductStockMutationSuccess) {
      setIsOpen(false);
      setStockQty(null);
    }

    resetDeductStockMutation();
  }, [deductStockMutationSuccess, isOpen]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    await deductStockMutation({ id, quantityToDeduct: stockQty });
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button
          variant="outline"
          className="text-red-600 hover:text-red-700"
          size="icon"
        >
          <MinusCircle size={18} />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Deduct Current Stock</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 mb-4">
            <div className="grid gap-3">
              <Label htmlFor="category">Deduct Stock</Label>
              <Input
                type="number"
                id="stock"
                category="stock"
                placeholder="Stock"
                onChange={(e) => setStockQty(e.target.value)}
              />
            </div>
          </div>
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline">Cancel</Button>
            </DialogClose>
            <Button type="submit">
              {deductStockMutationPending ? (
                <span className="flex items-center gap-1">
                  <LoadingSpinner />
                  Deducting
                </span>
              ) : (
                'Deduct'
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

export default DeductStockModal;
