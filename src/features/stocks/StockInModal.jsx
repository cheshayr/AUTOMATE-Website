import React, { useState } from "react";
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

const StockInModal = ({ open, setOpen, item, onSave }) => {
  const [quantity, setQuantity] = useState("");
  const [remarks, setRemarks] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave({
      quantity: Number(quantity),
      remarks,
      // We pass the existing supplier ID back to the handler
      supplier: item.supplier?._id || item.supplier, 
      dateTime: new Date(),
    });
    setQuantity("");
    setRemarks("");
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Stock In: {item?.itemName}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          
          {/* Read-only Supplier Display */}
          <div className="space-y-2">
            <Label className="text-muted-foreground">Assigned Supplier</Label>
            <div className="p-2 border rounded bg-slate-50 text-sm font-medium">
              {item?.supplier?.companyName || "N/A (No Supplier Assigned)"}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="quantity">Quantity to Add</Label>
            <Input
              id="quantity"
              type="number"
              value={quantity}
              onChange={(e) => setQuantity(e.target.value)}
              placeholder="0"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="remarks">Remarks (Optional)</Label>
            <Input
              id="remarks"
              value={remarks}
              onChange={(e) => setRemarks(e.target.value)}
              placeholder="e.g. New shipment arrived"
            />
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button type="submit">Confirm Stock In</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default StockInModal;
