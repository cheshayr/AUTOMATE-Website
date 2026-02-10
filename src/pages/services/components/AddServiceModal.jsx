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
import { useEffect, useState } from 'react';

export function AddServiceModal({ isOpen, setIsOpen, currentData }) {
  const title = currentData ? 'Edit Service' : 'Add Service';
  const [imageFile, setImageFile] = useState(null);
  const [errors, setErrors] = useState({});

  const addService = useAddService();
  const editService = useEditService();

  useEffect(() => {
    if (isOpen) {
      setImageFile(null);
      setErrors({});
    }
  }, [isOpen]);

  const validateForm = (description, rangeMin, ETC) => {
    const newErrors = {};
    let valid = true;

    if (!description || description.trim().length < 10) {
      newErrors.description = 'Description must be at least 10 characters long.';
      valid = false;
    }

    const min = Number(rangeMin);
    if (isNaN(min) || min < 0) {
      newErrors.price = 'Price must be 0 or greater.';
      valid = false;
    }

    const etcNum = Number(ETC);
    if (isNaN(etcNum) || etcNum < 30) {
      newErrors.etc = 'ETC must be at least 30 minutes.';
      valid = false;
    }

    setErrors(newErrors);
    return valid;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const raw = new FormData(e.target);

    const name = raw.get('name');
    const description = raw.get('description');
    const rangeMin = raw.get('rangeMin');
    const ETC = raw.get('ETC');

    if (!validateForm(description, rangeMin, ETC)) return;

    // 🔥 FORCE NUMBERS
    const rangeMinNum = Number(rangeMin);
    const ETCNum = Number(ETC);

    const formData = new FormData();
    formData.append('name', name);
    formData.append('description', description);
    formData.append('rangeMin', rangeMinNum);
    formData.append('ETC', ETCNum);

    if (imageFile) formData.append('image', imageFile);

    if (currentData) {
      await editService.mutateAsync(
        { id: currentData._id, data: formData },
        { onSuccess: () => setIsOpen(false) }
      );
    } else {
      await addService.mutateAsync(formData, {
        onSuccess: () => setIsOpen(false),
      });
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="sm:max-w-[425px] max-h-[90vh]">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="grid gap-4 overflow-y-auto">
          <div className="grid gap-2">
            <Label>Picture</Label>
            <Input
              type="file"
              accept="image/*"
              onChange={(e) => setImageFile(e.target.files[0])}
            />
          </div>

          <div className="grid gap-2">
            <Label>Service Name</Label>
            <Input name="name" defaultValue={currentData?.name || ''} required />
          </div>

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

          <div className="grid gap-2">
            <Label>Price starts at</Label>
            <Input
              name="rangeMin"
              type="number"
              min="0"
              defaultValue={currentData?.rangeMin ?? 0}
              className={errors.price ? 'border-red-500' : ''}
              required
            />
            {errors.price && (
              <p className="text-xs text-red-500">{errors.price}</p>
            )}
          </div>

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