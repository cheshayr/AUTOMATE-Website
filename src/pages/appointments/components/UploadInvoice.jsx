import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Spinner } from '@/components/ui/spinner';
import { useGetAppointmentById } from '@/hooks/useAppointments.query';
import { cn } from '@/lib/utils';
import { DialogClose } from '@radix-ui/react-dialog';
import React, { useRef, useState } from 'react';

function UploadInvoice({ appointmentId, onSave, onCancel, setInvoiceFile }) {
  const { data: currentData, isLoading, isError } = useGetAppointmentById(appointmentId);
  console.log('🚀 ~ UploadInvoice ~ currentData:', currentData);
  const title = 'Upload Invoice';
  const [previewUrl, setPreviewUrl] = useState(null); // No type annotation
  const fileInputRef = useRef(null);

  const handleFileChange = (event) => {
    // No type annotation for event
    const file = event.target.files?.[0];
    console.log('🚀 ~ handleFileChange ~ file:', file);
    if (file) {
      setPreviewUrl(URL.createObjectURL(file));
      setInvoiceFile(file);
    } else {
      setPreviewUrl(null);
    }
  };

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <>
      {/* DialogTrigger is removed from here */}
      <DialogContent className="sm:max-w-[425px] flex flex-col max-h-[90vh]">
        <DialogHeader className="p-1 pb-0">
          <DialogTitle>{title}</DialogTitle>
          {/* <DialogDescription>
              Make changes to your profile here. Click save when you're
              done.
            </DialogDescription> */}
        </DialogHeader>

        <form onSubmit={onSave} className="flex flex-col flex-grow overflow-hidden">
          {isError && (
            <div className="text-red-500 text-center p-4">
              <p>Error loading appointment data. Please try again later.</p>
            </div>
          )}
          {isLoading ? (
            <div className="grid place-items-center h-96">
              <Spinner size="medium" />
            </div>
          ) : (
            <>
              <div className="grid gap-4 mb-4 p-1 pt-0 overflow-y-auto flex-grow">
                <div className="grid w-full max-w-sm items-center gap-3">
                  <Label htmlFor="picture">Manual Invoice</Label>

                  {/* Hidden Shadcn Input component */}
                  <Input
                    id="picture"
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                    className="sr-only" // Shadcn's way to hide visually but keep accessible
                    ref={fileInputRef}
                    required
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
                  <Label htmlFor="name">Final Cost</Label>
                  <Input
                    id="finalCost"
                    name="finalCost"
                    type="number"
                    placeholder="Enter final price as shown in invoice"
                    required
                    defaultValue={currentData?.finalCost} // Use currentData
                  />
                </div>
              </div>

              <DialogFooter className="flex p-1 pt-0">
                <DialogClose asChild>
                  <Button type="button" variant="outline" onClick={() => onCancel(false)}>
                    Cancel
                  </Button>
                </DialogClose>
                <Button type="submit">Save changes</Button>
              </DialogFooter>
            </>
          )}
        </form>
      </DialogContent>
    </>
  );
}

export default UploadInvoice;
