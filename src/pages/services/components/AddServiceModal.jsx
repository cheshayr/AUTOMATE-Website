import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'; // DialogTrigger is removed
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { useAddService, useEditService } from '@/hooks/useServices.mutation';
import { cn } from '@/lib/utils';
import { useQueryClient } from '@tanstack/react-query';
import { LucideInfo } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
// Plus icon is no longer needed here as the trigger button is external
// import { Plus } from 'lucide-react';

// Accept isOpen, setIsOpen, and currentData as props
export function AddServiceModal({ isOpen, setIsOpen, currentData }) {
  // Determine title based on whether currentData is provided
  const title = currentData ? 'Edit Service' : 'Add Service';
  const [previewUrl, setPreviewUrl] = useState(null); // No type annotation
  const [imageFile, setImageFile] = useState(null); // No type annotation
  const fileInputRef = useRef(null);
  const queryClient = useQueryClient();
  // useAddService will handle both add and edit internally based on data
  const addService = useAddService();
  const editService = useEditService(); // Assuming this is the same mutation for both add and edit

  const handleSubmit = (e) => {
    e.preventDefault();
    // e.preventDefault(); // Use 'e' for consistency with event handlers
    const formDataInitial = new FormData(e.target);
    const formData = new FormData();

    const name = formDataInitial.get('name');
    const description = formDataInitial.get('description');
    const min = formDataInitial.get('min');
    const max = formDataInitial.get('max');
    const ETC = formDataInitial.get('ETC');

    formData.append('name', name);
    formData.append('description', description);
    formData.append('rangeMin', min);
    formData.append('rangeMax', max);
    formData.append('ETC', ETC);
    formData.append('id', currentData?._id);
    if (imageFile) formData.append('image', imageFile);

    console.table([...formData]);

    console.log(currentData);
    if (currentData) {
      // If currentData exists, we are editing
      if (!currentData._id) {
        console.error('Current data does not have an ID for editing.');
        return;
      }

      // Ensure we have an ID for editing
      // if (!name || !description) {
      //   console.error('Name and description are required for editing.');
      //   return;
      // }

      // Call editService mutation
      editService.mutateAsync(
        // {
        //   id: currentData._id, // Use _id for editing
        //   name,
        //   description,
        // },
        formData,
        {
          onSuccess: () => {
            // Close the modal upon successful submission
            setIsOpen(false);
          },
        }
      );
    } else {
      // If currentData does not exist, we are adding a new service
      // if (!name || !description) {
      //   console.error('Name and description are required for adding a new service.');
      //   return;
      // }

      // Call addService mutation
      addService.mutateAsync(
        // {
        //   // If currentData exists, include its ID for editing
        //   id: currentData?.id,
        //   name,
        //   description,
        // },
        formData,
        {
          onSuccess: () => {
            // Close the modal upon successful submission
            setIsOpen(false);
          },
        }
      );
    }
  };

  const handleFileChange = (event) => {
    // No type annotation for event
    const file = event.target.files?.[0];
    console.log('🚀 ~ handleFileChange ~ file:', file);
    if (file) {
      setPreviewUrl(URL.createObjectURL(file));
      setImageFile(file);
    } else {
      setPreviewUrl(null);
    }
  };

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  useEffect(() => {
    if (isOpen) {
      setPreviewUrl(null);
    }
  }, [isOpen]);

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      {/* DialogTrigger is removed from here */}
      <DialogContent className="sm:max-w-[425px] flex flex-col max-h-[90vh]">
        <DialogHeader className="p-1 pb-0">
          <DialogTitle>{title}</DialogTitle>
          {/* <DialogDescription>
              Make changes to your profile here. Click save when you're
              done.
            </DialogDescription> */}
        </DialogHeader>
        <form onSubmit={handleSubmit} className="flex flex-col flex-grow overflow-hidden">
          <div className="grid gap-4 mb-4 p-1 pt-0 overflow-y-auto flex-grow">
            <div className="grid w-full max-w-sm items-center gap-3">
              <Label htmlFor="picture">Picture</Label>

              {/* Hidden Shadcn Input component */}
              <Input
                id="picture"
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="sr-only" // Shadcn's way to hide visually but keep accessible
                ref={fileInputRef}
              />

              {/* Photo Placeholder */}
              <div
                onClick={handleClick}
                className={cn(
                  'relative flex h-48 w-full cursor-pointer items-center justify-center rounded-md border-2 border-dashed border-gray-300 bg-gray-50 text-gray-500 shadow-sm transition-colors hover:border-gray-400 hover:bg-gray-100'
                  // previewUrl ? 'p-0' : 'p-4' // Remove padding if an image is loaded
                )}
              >
                {currentData?.imageUrl || previewUrl ? (
                  <img
                    src={previewUrl || currentData?.imageUrl} // Use previewUrl or currentData's imageUrl
                    alt="Preview"
                    className="h-full w-full rounded-md" // object-cover to fill the space
                  />
                ) : (
                  <div className="flex flex-col items-center justify-center">
                    <svg
                      className="mb-2 h-10 w-10 "
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                      ></path>
                    </svg>
                    <span className="text-sm">Click to upload photo</span>
                    <span className="text-xs">(Max 5MB)</span>
                  </div>
                )}
              </div>
            </div>
            <div className="grid gap-3">
              <Label htmlFor="name">Service Name</Label>
              <Input
                id="name"
                name="name"
                placeholder="Service name"
                defaultValue={currentData?.name || ''} // Use currentData
              />
            </div>
            <div className="grid gap-3">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                name="description"
                placeholder="Service description"
                defaultValue={currentData?.description || ''} // Use currentData
              />
            </div>
            <div className="grid gap-3">
              <Label>Price Range</Label>
              <div className="flex gap-4">
                <div className="flex-1 relative">
                  <div class="absolute top-1.5 left-2 pr-2 shrink-0 text-base text-gray-500 select-none sm:text-sm/6 border-r">
                    ₱
                  </div>
                  <Input
                    id="min"
                    name="min"
                    type="number"
                    defaultValue={currentData?.rangeMin || 1000} // Use currentData
                    className={'pl-8'}
                  />
                </div>
                <div className="h-full grid place-items-center">-</div>
                <div className="flex-1 relative">
                  <div class="absolute top-1.5 left-2 pr-2 shrink-0 text-base text-gray-500 select-none sm:text-sm/6 border-r">
                    ₱
                  </div>
                  <Input
                    id="max"
                    name="max"
                    type="number"
                    defaultValue={currentData?.rangeMax || 2000} // Use currentData
                    className={'pl-8'}
                  />
                </div>
              </div>
            </div>
            <div className="grid gap-3">
              <div className="flex items-start  ">
                <Label htmlFor="name">ETC in Minutes</Label>
                <Tooltip>
                  <TooltipTrigger>
                    <LucideInfo className="ml-2 text-gray-500" size={14} />
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Estimated Time to Complete</p>
                  </TooltipContent>
                </Tooltip>
              </div>
              <Input
                id="min"
                name="ETC"
                placeholder="Estimated Time to Complete in minutes"
                type="number"
                defaultValue={currentData?.ETC} // Use currentData
              />
            </div>
          </div>

          <DialogFooter className="flex p-1 pt-0">
            <DialogClose asChild>
              <Button type="button" variant="outline" onClick={() => setIsOpen(false)}>
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
