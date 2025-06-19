import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"; // DialogTrigger is removed
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useAddService, useEditService } from "@/hooks/useServices.mutation";
// Plus icon is no longer needed here as the trigger button is external
// import { Plus } from 'lucide-react';

// Accept isOpen, setIsOpen, and currentData as props
export function AddServiceModal({ isOpen, setIsOpen, currentData }) {
  // Determine title based on whether currentData is provided
  const title = currentData ? "Edit Service" : "Add Service";

  // useAddService will handle both add and edit internally based on data
  const addService = useAddService();
  const editService = useEditService(); // Assuming this is the same mutation for both add and edit

  const handleSubmit = (e) => {
    e.preventDefault();
    // e.preventDefault(); // Use 'e' for consistency with event handlers
    const formData = new FormData(e.target);
    const name = formData.get("name");
    const description = formData.get("description");
    if (currentData) {
      // If currentData exists, we are editing
      if (!currentData._id) {
        console.error("Current data does not have an ID for editing.");
        return;
      }

      // Ensure we have an ID for editing
      if (!name || !description) {
        console.error("Name and description are required for editing.");
        return;
      }

      // Call editService mutation
      editService.mutate(
        {
          id: currentData._id, // Use _id for editing
          name,
          description,
        },
        {
          onSuccess: () => {
            // Close the modal upon successful submission
            setIsOpen(false);
          },
        }
      );
    } else {
      // If currentData does not exist, we are adding a new service
      if (!name || !description) {
        console.error(
          "Name and description are required for adding a new service."
        );
        return;
      }

      // Call addService mutation
      addService.mutate(
        {
          // If currentData exists, include its ID for editing
          id: currentData?.id,
          name,
          description,
        },
        {
          onSuccess: () => {
            // Close the modal upon successful submission
            setIsOpen(false);
          },
        }
      );
    }
  };
  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      {/* DialogTrigger is removed from here */}
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          {/* <DialogDescription>
              Make changes to your profile here. Click save when you&apos;re
              done.
            </DialogDescription> */}
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 mb-4">
            <div className="grid gap-3">
              <Label htmlFor="name">Service Name</Label>
              <Input
                id="name"
                name="name"
                placeholder="Service name"
                defaultValue={currentData?.name || ""} // Use currentData
              />
            </div>
            <div className="grid gap-3">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                name="description"
                placeholder="Service description"
                defaultValue={currentData?.description || ""} // Use currentData
              />
            </div>
          </div>
          <DialogFooter>
            <DialogClose asChild>
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsOpen(false)}
              >
                {" "}
                {/* Ensure button type is "button" */}
                Cancel
              </Button>
            </DialogClose>
            <Button type="submit">Save changes</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

export default AddServiceModal;
