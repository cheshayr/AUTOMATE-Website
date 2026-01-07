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

const StockOutModal = ({ open, setOpen, item, onSave }) => {
  const [quantity, setQuantity] = useState("");
  const [reason, setReason] = useState("");
  const [remarks, setRemarks] = useState("");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");

  const reasonsList = ["Sale", "Damage", "Adjustment", "Expired"];

  useEffect(() => {
    const now = new Date();
    setDate(now.toISOString().split("T")[0]);
    setTime(now.toTimeString().split(" ")[0].slice(0, 5));
  }, [open]);

  const handleSubmit = () => {
    if (!quantity || quantity <= 0) {
      toast.error("Enter a valid quantity");
      return;
    }

    if (quantity > item.stock) {
      toast.error("Insufficient stock");
      return;
    }

    if (!reason) {
      toast.error("Select a reason");
      return;
    }

    onSave({
      quantity: Number(quantity),
      reason,
      remarks,
      dateTime: new Date(`${date}T${time}`),
    });

    setQuantity("");
    setReason("");
    setRemarks("");
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Stock OUT — {item.itemName}</DialogTitle>
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
            <Label>Reason</Label>
            <Select value={reason} onValueChange={setReason}>
              <SelectTrigger>
                <SelectValue placeholder="Select reason" />
              </SelectTrigger>
              <SelectContent>
                {reasonsList.map((r) => (
                  <SelectItem key={r} value={r}>
                    {r}
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
          <Button variant="destructive" onClick={handleSubmit}>
            Save Stock OUT
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default StockOutModal;
