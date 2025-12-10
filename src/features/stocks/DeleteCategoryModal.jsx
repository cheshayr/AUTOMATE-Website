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

import { Label } from '@/components/ui/label';
import { Trash2 } from 'lucide-react';
import { useDeleteCategory } from '@/hooks/useInventoryMutation';
import { useEffect, useState } from 'react';
import LoadingSpinner from '@/components/LoadingSpinner';

function DeleteCategoryModal({ itemCategories }) {
  const [selectedCategoryId, setSelectedCategoryId] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [isConfirming, setIsConfirming] = useState(false); 

  const {
    mutateAsync: deleteCategoryMutation,
    isPending: deleteCategoryMutationPending,
    isSuccess: deleteCategoryMutationSuccess,
    reset: resetDeleteCategoryMutation,
  } = useDeleteCategory();

  useEffect(() => {
    if (deleteCategoryMutationSuccess) {
      setIsOpen(false);
      setIsConfirming(false); 
      setSelectedCategoryId('');
      resetDeleteCategoryMutation(); 
    }
  }, [deleteCategoryMutationSuccess]);
  
  // Reset states when modal is closed
  useEffect(() => {
    if (!isOpen) {
        setIsConfirming(false);
        setSelectedCategoryId('');
    }
  }, [isOpen]);

  const handleInitialDeleteClick = () => {
    // Only proceed if a category has been selected
    if (selectedCategoryId) {
        setIsConfirming(true);
    }
  };

  const handleFinalDelete = async () => {
    if (selectedCategoryId) {
        await deleteCategoryMutation({ id: selectedCategoryId });
    }
  };
  
  const selectedCategoryName = itemCategories?.find(cat => cat.id === selectedCategoryId)?.categoryName;

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button className="min-w-36" variant="destructive">
          <Trash2 /> Delete Category
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{isConfirming ? 'Confirm Category Deletion' : 'Delete Category'}</DialogTitle>
        </DialogHeader>
        
        {!isConfirming ? (
            <div className="grid gap-4 mb-4">
              <div className="grid gap-3">
                <Label htmlFor="category">Select Category to Delete</Label>
                <Select
                  id="category"
                  name="category"
                  // Ensure this holds the single selected value/ID
                  value={selectedCategoryId} 
                  onValueChange={(newValue) => setSelectedCategoryId(newValue)}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select a category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      {/* Using category.id as the unique key and value */}
                      {itemCategories?.map((category) => (
                        <SelectItem key={category.id} value={category.id}>
                          {category.categoryName}
                        </SelectItem>
                      ))}
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </div>
            </div>
        ) : (
            <div className="grid gap-4 mb-4">
                <p>
                    Are you sure you want to permanently delete the category: 
                    <span className="font-bold"> {selectedCategoryName}</span>?
                </p>
                <p className="text-sm text-red-500">
                    This action cannot be undone and may affect associated items.
                </p>
            </div>
        )}
        
        <DialogFooter>
          {/* Adjusted Back/Cancel button logic */}
          <Button variant="outline" onClick={() => isConfirming ? setIsConfirming(false) : setIsOpen(false)}>
            {isConfirming ? 'Back' : 'Cancel'}
          </Button>
          
          {!isConfirming ? (
            <Button 
                onClick={handleInitialDeleteClick} 
                // Enable only if an ID is selected
                disabled={!selectedCategoryId} 
                variant="destructive"
            >
                Next (Confirm)
            </Button>
          ) : (
            <Button onClick={handleFinalDelete} variant="destructive">
              {deleteCategoryMutationPending ? (
                <span className="flex items-center gap-1">
                  <LoadingSpinner />
                  Deleting
                </span>
              ) : (
                'Delete Category Permanently'
              )}
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export default DeleteCategoryModal;