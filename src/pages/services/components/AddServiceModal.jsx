import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { useAddService, useEditService } from '@/hooks/useServices.mutation';
import { cn } from '@/lib/utils';
import { useQueryClient } from '@tanstack/react-query';
import { LucideInfo } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';

export function AddServiceModal({ isOpen, setIsOpen, currentData }) {
  const title = currentData ? 'Edit Service' : 'Add Service';
  const [previewUrl, setPreviewUrl] = useState(null);
  const [imageFile, setImageFile] = useState(null);
  const [errors, setErrors] = useState({}); // State to track validation errors
  const fileInputRef = useRef(null);
  const queryClient = useQueryClient();

  const addService = useAddService();
  const editService = useEditService();

  // Reset errors and preview when modal opens/closes
  useEffect(() => {
    if (isOpen) {
      setPreviewUrl(null);
      setImageFile(null);
      setErrors({});
    }
  }, [isOpen]);

  const validateForm = (description, min, max, etc) => {
    const newErrors = {};
    let isValid = true;

    // 1. Description Validation (Min 10 chars)
    if (!description || description.trim().length < 10) {
      newErrors.description = 'Description must be at least 10 characters long.';
      isValid = false;
    }

    // 2. Price Range Validation (Min cannot be > Max)
    const numMin = parseFloat(min);
    const numMax = parseFloat(max);

    if (min && max && numMin > numMax) {
      newErrors.price = 'Minimum price cannot be greater than maximum price.';
      isValid = false;
    }

    // 3. ETC Validation (Min 30 minutes)
    const numETC = parseFloat(etc);
    if (!etc || numETC < 30) {
      newErrors.etc = 'ETC must be at least 30 minutes.';
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const formDataInitial = new FormData(e.target);
    const formData = new FormData();

    const name = formDataInitial.get('name');
    const description = formDataInitial.get('description');
    const min = formDataInitial.get('min');
    const max = formDataInitial.get('max');
    const ETC = formDataInitial.get('ETC');

    // --- RUN VALIDATION ---
    if (!validateForm(description, min, max, ETC)) {
      return; // Stop submission if validation fails
    }

    formData.append('name', name);
    formData.append('description', description);
    formData.append('rangeMin', min);
    formData.append('rangeMax', max);
    formData.append('ETC', ETC);
    formData.append('id', currentData?._id);
    if (imageFile) formData.append('image', imageFile);

    if (currentData) {
      // Edit Mode
      if (!currentData._id) {
        console.error('Current data does not have an ID for editing.');
        return;
      }
      editService.mutateAsync(formData, {
        onSuccess: () => setIsOpen(false),
      });
    } else {
      // Add Mode
      addService.mutateAsync(formData, {
        onSuccess: () => setIsOpen(false),
      });
    }
  };

  const handleFileChange = (event) => {
    const file = event.target.files?.[0];
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

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="sm:max-w-[425px] flex flex-col max-h-[90vh]">
        <DialogHeader className="p-1 pb-0">
          <DialogTitle>{title}</DialogTitle>
        </DialogHeader>
        
        {/* We use a key here to force re-render when currentData changes so defaultValues update */}
        <form 
          key={currentData?._id || 'new-service'} 
          onSubmit={handleSubmit} 
          className="flex flex-col flex-grow overflow-hidden"
        >
          <div className="grid gap-4 mb-4 p-1 pt-0 overflow-y-auto flex-grow">
            
            {/* Image Upload Section */}
            <div className="grid w-full max-w-sm items-center gap-3">
              <Label htmlFor="picture">Picture</Label>
              <Input
                id="picture"
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="sr-only"
                ref={fileInputRef}
              />
              <div
                onClick={handleClick}
                className={cn(
                  'relative flex h-48 w-full cursor-pointer items-center justify-center rounded-md border-2 border-dashed border-gray-300 bg-gray-50 text-gray-500 shadow-sm transition-colors hover:border-gray-400 hover:bg-gray-100'
                )}
              >
                {currentData?.imageUrl || previewUrl ? (
                  <img
                    src={previewUrl || currentData?.imageUrl}
                    alt="Preview"
                    className="h-full w-full rounded-md object-cover"
                  />
                ) : (
                  <div className="flex flex-col items-center justify-center">
                    <svg className="mb-2 h-10 w-10" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                    </svg>
                    <span className="text-sm">Click to upload photo</span>
                    <span className="text-xs">(Max 5MB)</span>
                  </div>
                )}
              </div>
            </div>

            {/* Service Name */}
            <div className="grid gap-3">
              <Label htmlFor="name">Service Name</Label>
              <Input
                id="name"
                name="name"
                placeholder="Service name"
                defaultValue={currentData?.name || ''}
                required
              />
            </div>

            {/* Description */}
            <div className="grid gap-3">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                name="description"
                placeholder="Service description (min 10 chars)"
                defaultValue={currentData?.description || ''}
                className={errors.description ? 'border-red-500 focus-visible:ring-red-500' : ''}
              />
              {errors.description && (
                <span className="text-xs text-red-500 font-medium">{errors.description}</span>
              )}
            </div>

            {/* Price Range */}
            <div className="grid gap-3">
              <Label>Price Range</Label>
              <div className="flex gap-4">
                <div className="flex-1 relative">
                  <div className="absolute top-1.5 left-2 pr-2 shrink-0 text-base text-gray-500 select-none sm:text-sm/6 border-r">
                    ₱
                  </div>
                  <Input
                    id="min"
                    name="min"
                    type="number"
                    placeholder="Min"
                    defaultValue={currentData?.rangeMin || 1000}
                    className={`pl-8 ${errors.price ? 'border-red-500 focus-visible:ring-red-500' : ''}`}
                    required
                  />
                </div>
                <div className="h-full grid place-items-center">-</div>
                <div className="flex-1 relative">
                  <div className="absolute top-1.5 left-2 pr-2 shrink-0 text-base text-gray-500 select-none sm:text-sm/6 border-r">
                    ₱
                  </div>
                  <Input
                    id="max"
                    name="max"
                    type="number"
                    placeholder="Max"
                    defaultValue={currentData?.rangeMax || 2000}
                    className={`pl-8 ${errors.price ? 'border-red-500 focus-visible:ring-red-500' : ''}`}
                    required
                  />
                </div>
              </div>
              {errors.price && (
                <span className="text-xs text-red-500 font-medium">{errors.price}</span>
              )}
            </div>

            {/* ETC */}
            <div className="grid gap-3">
              <div className="flex items-start">
                <Label htmlFor="ETC">ETC in Minutes</Label>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <LucideInfo className="ml-2 text-gray-500 cursor-pointer" size={14} />
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Estimated Time to Complete</p>
                  </TooltipContent>
                </Tooltip>
              </div>
              <Input
                id="ETC"
                name="ETC"
                placeholder="Estimated Time to Complete in minutes"
                type="number"
                min="30" 
                defaultValue={currentData?.ETC}
                className={errors.etc ? 'border-red-500 focus-visible:ring-red-500' : ''}
                required
              />
              {errors.etc && (
                <span className="text-xs text-red-500 font-medium">{errors.etc}</span>
              )}
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
