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
import { Plus } from 'lucide-react';
import { useAddCategory } from '@/hooks/useInventoryMutation';
import { useEffect, useState } from 'react';
import LoadingSpinner from '@/components/LoadingSpinner';

function AddCategoryModal() {
  const [category, setCategory] = useState('');
  const [isOpen, setIsOpen] = useState(false);

  const {
    mutateAsync: addCategoryMutation,
    isPending: addCategoryMutationPending,
    isError: addCategoryMutationError,
    isSuccess: addCategoryMutationSuccess,
    reset: resetAddCategoryMutation,
  } = useAddCategory();

  useEffect(() => {
    if (isOpen && addCategoryMutationSuccess) {
      setIsOpen(false); // <--- This is the programmatic close
      setCategory(''); // Clear input for next time modal opens
      resetAddCategoryMutation(); // Reset mutation status for a clean slate
    }
  }, [addCategoryMutationSuccess, isOpen]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    await addCategoryMutation({ categoryName: category });
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button className="min-w-36">
          <Plus /> Add Category
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add Category</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 mb-4">
            <div className="grid gap-3">
              <Label htmlFor="category">Item Category</Label>
              <Input
                id="category"
                category="category"
                placeholder="Item Category"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
              />
            </div>
          </div>
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline">Cancel</Button>
            </DialogClose>
            <Button type="submit">
              {addCategoryMutationPending ? (
                <span className="flex items-center gap-1">
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

export default AddCategoryModal;
