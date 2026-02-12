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
import { useAddService, useEditService } from '@/hooks/useServices.mutation';
import { useEffect, useRef, useState } from 'react';

export function AddServiceModal({ isOpen, setIsOpen, currentData }) {
  const title = currentData ? 'Edit Service' : 'Add Service';

  const [imageFile, setImageFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [errors, setErrors] = useState({});
  const fileInputRef = useRef(null);

  const addService = useAddService();
  const editService = useEditService();

  useEffect(() => {
    if (isOpen) {
      setImageFile(null);
      setPreviewUrl(null);
      setErrors({});
    }
  }, [isOpen]);

  const validateForm = (description, rangeMin, ETC) => {
    const newErrors = {};
    let isValid = true;

    if (!description || description.trim().length < 10) {
      newErrors.description = 'Description must be at least 10 characters long.';
      isValid = false;
    }

    const min = Number(rangeMin);
    if (!rangeMin || min <= 0) {
      newErrors.price = 'Price must be greater than 0.';
      isValid = false;
    }

    const etcNum = Number(ETC);
    if (!ETC || etcNum < 30) {
      newErrors.etc = 'ETC must be at least 30 minutes.';
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const raw = new FormData(e.target);
    const formData = new FormData();

    const name = raw.get('name');
    const description = raw.get('description');
    const rangeMin = raw.get('rangeMin');
    const ETC = raw.get('ETC');

    if (!validateForm(description, rangeMin, ETC)) return;

    formData.append('name', name);
    formData.append('description', description);
    formData.append('rangeMin', rangeMin); // 🔥 FIX
    formData.append('ETC', ETC);

    if (imageFile) formData.append('image', imageFile);
    if (currentData?._id) formData.append('id', currentData._id);

    const action = currentData ? editService : addService;

    await action.mutateAsync(formData, {
      onSuccess: () => setIsOpen(false),
    });
  };

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setImageFile(file);
    setPreviewUrl(URL.createObjectURL(file));
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="sm:max-w-[425px] max-h-[90vh]">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="grid gap-4 overflow-y-auto">
          {/* Image */}
          <div className="grid gap-2">
            <Label>Picture</Label>
            <Input type="file" accept="image/*" onChange={handleFileChange} />
          </div>

          {/* Name */}
          <div className="grid gap-2">
            <Label>Service Name</Label>
            <Input
              name="name"
              defaultValue={currentData?.name || ''}
              required
            />
          </div>

          {/* Description */}
          <div className="grid gap-2">
            <Label>Description</Label>
            <Textarea
              name="description"
              defaultValue={currentData?.description || ''}
              className={errors.description ? 'border-red-500' : ''}
            />
            {errors.description && (
              <p className="text-xs text-red-500">{errors.description}</p>
            )}
          </div>

          {/* Price Starts At */}
          <div className="grid gap-2">
            <Label>Price starts at</Label>
            <div className="relative">
              <span className="absolute left-2 top-2 text-gray-500">₱</span>
              <Input
                name="rangeMin"
                type="number"
                min="1"
                defaultValue={currentData?.rangeMin ?? 1000}
                className={`pl-6 ${errors.price ? 'border-red-500' : ''}`}
                required
              />
            </div>
            {errors.price && (
              <p className="text-xs text-red-500">{errors.price}</p>
            )}
          </div>

          {/* ETC */}
          <div className="grid gap-2">
            <Label>ETC (minutes)</Label>
            <Input
              name="ETC"
              type="number"
              min="30"
              defaultValue={currentData?.ETC ?? 30}
              className={errors.etc ? 'border-red-500' : ''}
              required
            />
            {errors.etc && (
              <p className="text-xs text-red-500">{errors.etc}</p>
            )}
          </div>

          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline">Cancel</Button>
            </DialogClose>
            <Button type="submit">Save</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

export default AddServiceModal;




