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
import { MinusCircle, Plus, PlusCircle, Trash2 } from 'lucide-react';
import { useDeleteItem } from '@/hooks/useInventoryMutation';
import LoadingSpinner from '@/components/LoadingSpinner';
import { useEffect, useState } from 'react';

function DeleteItemModal({ itemName, id }) {
  const [isOpen, setIsOpen] = useState(false);

  const {
    mutateAsync: deleteStockMutation,
    isPending: deleteStockMutationPending,
    isError: deleteStockMutationError,
    isSuccess: deleteStockMutationSuccess,
    reset: resetDeleteStockMutation,
  } = useDeleteItem();

  useEffect(() => {
    if (deleteStockMutationSuccess) {
      setIsOpen(false);
    }

    resetDeleteStockMutation();
  }, [deleteStockMutationSuccess, isOpen]);

  const handleDelete = async (e) => {
    e.preventDefault();

    await deleteStockMutation({ id });
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button
          variant="outline"
          className="text-red-600 hover:text-red-700"
          size="icon"
        >
          <Trash2 size={18} />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Delete Item</DialogTitle>
        </DialogHeader>
        <div>
          <div className="grid gap-4 mb-4">
            <p>
              This will permanently delete "{itemName}". This action cannot be
              undone.
            </p>
          </div>
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline">Cancel</Button>
            </DialogClose>
            <Button onClick={handleDelete}>
              {deleteStockMutationPending ? (
                <span className="flex items-center gap-1">
                  <LoadingSpinner />
                  Deleting
                </span>
              ) : (
                'Delete'
              )}
            </Button>
          </DialogFooter>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export default DeleteItemModal;
