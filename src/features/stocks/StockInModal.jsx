import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";

const StockInModal = ({ open, setOpen, item, onSave, suppliers = [] }) => {
  const [quantity, setQuantity] = useState("");
  const [supplier, setSupplier] = useState("");
  const [remarks, setRemarks] = useState("");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");

  useEffect(() => {
    const now = new Date();
    setDate(now.toISOString().split("T")[0]); // YYYY-MM-DD
    setTime(now.toTimeString().split(" ")[0].slice(0, 5)); // HH:MM
  }, [open]);

  const handleSubmit = () => {
    if (!quantity || quantity <= 0) {
      toast.error("Enter a valid quantity");
      return;
    }
    if (!supplier) {
      toast.error("Select a supplier");
      return;
    }

    onSave({
      quantity: Number(quantity),
      supplier,
      remarks,
      dateTime: new Date(`${date}T${time}`),
    });

    // Reset form
    setQuantity("");
    setSupplier("");
    setRemarks("");
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Stock IN — {item.itemName}</DialogTitle>
        </DialogHeader>

        <div className="space-y-3">
          <div>
            <Label>Quantity</Label>
            <Input
              type="number"
              min="1"
              value={quantity}
              onChange={(e) => setQuantity(e.target.value)}
            />
          </div>

          <div>
            <Label>Supplier</Label>
            <Select value={supplier} onValueChange={setSupplier}>
              <SelectTrigger>
                <SelectValue placeholder="Select supplier" />
              </SelectTrigger>
              <SelectContent>
                {suppliers.map((s) => (
                  <SelectItem key={s._id} value={s._id}>
                    {s.companyName} ({s.contactPerson})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label>Remarks</Label>
            <Input
              placeholder="Optional"
              value={remarks}
              onChange={(e) => setRemarks(e.target.value)}
            />
          </div>

          <div className="flex space-x-3">
            <div>
              <Label>Date</Label>
              <Input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
              />
            </div>
            <div>
              <Label>Time</Label>
              <Input
                type="time"
                value={time}
                onChange={(e) => setTime(e.target.value)}
              />
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button onClick={handleSubmit}>Save Stock IN</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default StockInModal;
