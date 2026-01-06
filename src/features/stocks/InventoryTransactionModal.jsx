import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';

const InventoryTransactionModal = ({
  open,
  onClose,
  onConfirm,
  transactionType,
  quantity,
}) => {
  const [form, setForm] = useState({
    supplier: '',
    itemType: '',
    referenceNumber: '',
    remarks: '',
  });

  const handleSubmit = () => {
    onConfirm({
      ...form,
      transactionType,
      quantity,
    });
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Inventory Transaction</DialogTitle>
        </DialogHeader>

        <div className="space-y-3">
          <div>
            <Label>Supplier</Label>
            <Input
              onChange={(e) =>
                setForm({ ...form, supplier: e.target.value })
              }
            />
          </div>

          <div>
            <Label>Item Type / Item No.</Label>
            <Input
              onChange={(e) =>
                setForm({ ...form, itemType: e.target.value })
              }
            />
          </div>

          <div>
            <Label>Reference Number</Label>
            <Input
              onChange={(e) =>
                setForm({ ...form, referenceNumber: e.target.value })
              }
            />
          </div>

          <div>
            <Label>Remarks</Label>
            <Input
              onChange={(e) =>
                setForm({ ...form, remarks: e.target.value })
              }
            />
          </div>

          <Button className="w-full" onClick={handleSubmit}>
            Confirm Transaction
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default InventoryTransactionModal;
