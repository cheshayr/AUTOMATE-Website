// AddServiceModal.jsx
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

  const [imageFiles, setImageFiles] = useState([]);
  const [previewUrls, setPreviewUrls] = useState([]);
  const [existingImageUrls, setExistingImageUrls] = useState([]);
  const [errors, setErrors] = useState([]);

  const addService = useAddService();
  const editService = useEditService();

  useEffect(() => {
    if (isOpen) {
      setImageFiles([]);
      setPreviewUrls([]);
      setExistingImageUrls([]);

      // Load existing images if editing
      if (currentData?.imageUrls) {
        setExistingImageUrls(currentData.imageUrls);
        setPreviewUrls(currentData.imageUrls);
      }

      setErrors({});
    }
  }, [isOpen, currentData]);

  const handleImageChange = (files) => {
    const fileArray = Array.from(files);
    setImageFiles(prev => [...prev, ...fileArray]);
    setPreviewUrls(prev => [...prev, ...fileArray.map(file => URL.createObjectURL(file))]);
  };

  const deleteImage = (index) => {
    setPreviewUrls(prev => prev.filter((_, i) => i !== index));
    
    if (index < existingImageUrls.length) {
      setExistingImageUrls(prev => prev.filter((_, i) => i !== index));
    } else {
      const newFileIndex = index - existingImageUrls.length;
      setImageFiles(prev => prev.filter((_, i) => i !== newFileIndex));
    }
  };

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

    const formData = new FormData();
    formData.append('name', name);
    formData.append('description', description);
    formData.append('rangeMin', Number(rangeMin));
    formData.append('ETC', Number(ETC));

    if (currentData && existingImageUrls.length > 0) {
  
      const keptIndices = existingImageUrls.map(url => 
        currentData.imageUrls.indexOf(url)
      ).filter(index => index !== -1);
      
      formData.append('existingImageOrder', JSON.stringify(keptIndices));
    }

  
    imageFiles.forEach(file => {
      formData.append('images', file);
    });

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
      <DialogContent className="sm:max-w-[500px] max-h-[90vh]">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="grid gap-4 overflow-y-auto">
          {/* IMAGE SECTION */}
          <div className="grid gap-2">
            <Label>Pictures (You can upload one or more images)</Label>
            <Input
              type="file"
              accept="image/*"
              multiple
              onChange={(e) => handleImageChange(e.target.files)}
            />

            {previewUrls.length > 0 && (
              <div className="grid grid-cols-3 gap-2 mt-2">
                {previewUrls.map((url, index) => (
                  <div key={index} className="relative">
                    <img
                      src={url}
                      className="h-20 w-full object-cover rounded"
                    />
                    {/* DELETE BUTTON */}
                    <button
                      type="button"
                      onClick={() => deleteImage(index)}
                      className="absolute top-1 right-1 bg-red-600 text-white px-1 rounded text-xs z-10"
                    >
                      ✕
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* SERVICE DETAILS */}
          <div className="grid gap-2">
            <Label>Service Name</Label>
            <Input
              name="name"
              defaultValue={currentData?.name || ''}
              required
            />
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
              required
            />
          </div>

          <div className="grid gap-2">
            <Label>ETC (minutes)</Label>
            <Input
              name="ETC"
              type="number"
              min="30"
              defaultValue={currentData?.ETC ?? 30}
              required
            />
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