import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogTrigger,
  DialogClose,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Plus } from "lucide-react"; // Re-added the icon
import { useAddCategory } from "@/hooks/useInventoryMutation";
import LoadingSpinner from "@/components/LoadingSpinner";

const AddCategoryModal = ({ children }) => {
  const [categoryName, setCategoryName] = useState("");
  const [open, setOpen] = useState(false);
  
  const { mutateAsync: addCategory, isPending } = useAddCategory();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!categoryName.trim()) return;

    try {
      await addCategory({ categoryName: categoryName.trim() });
      setCategoryName("");
      setOpen(false);
    } catch (error) {
      console.error("Add Category Error:", error);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {/* Added the Plus icon back into the trigger button */}
        {children || (
          <Button variant="outline">
            <Plus className="mr-2 h-4 w-4" /> Add Category
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[400px]">
        <DialogHeader>
          <DialogTitle>Add New Category</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 pt-4">
          <div className="grid gap-2">
            <Label htmlFor="categoryName">Category Name</Label>
            <Input
              id="categoryName"
              placeholder="e.g., Engine Parts, Accessories"
              value={categoryName}
              onChange={(e) => setCategoryName(e.target.value)}
              required
              autoFocus
            />
          </div>
          <DialogFooter className="pt-4">
            <DialogClose asChild>
              <Button type="button" variant="outline">Cancel</Button>
            </DialogClose>
            <Button type="submit" disabled={isPending}>
              {isPending ? <LoadingSpinner /> : "Add Category"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AddCategoryModal;
