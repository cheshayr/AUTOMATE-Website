import React, { useState, useMemo } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Calendar, Clock, FilterX } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useFetchTransactions } from "@/hooks/useTransactionQuery";
import LoadingSpinner from "@/components/LoadingSpinner";

const ProductHistoryModal = ({ open, setOpen, itemName }) => {
  const { data: transactionData, isLoading } = useFetchTransactions(itemName);
  
  const logs = useMemo(() => {
    if (Array.isArray(transactionData)) return transactionData;
    if (transactionData?.data && Array.isArray(transactionData.data)) return transactionData.data;
    return [];
  }, [transactionData]);

  const [selectedReason, setSelectedReason] = useState("All");
  const [selectedDate, setSelectedDate] = useState("");

  // Reasons list: Removed "Stock Replenishment", added "Restock"
  const reasonsList = ["Sale", "Damage", "Adjustment", "Expired", "Restock"];

  const filteredLogs = useMemo(() => {
  return logs.filter((log) => {
    // Reason Filter Logic
    const matchesReason = selectedReason === "All" 
      ? true 
      : (
          log.reason === selectedReason || 
          log.remarks === selectedReason ||
          (selectedReason === "Restock" && log.type === "IN") 
        );

    // Date Filter Logic
    const logDate = log.dateTime ? new Date(log.dateTime).toISOString().split('T')[0] : "";
    const matchesDate = selectedDate ? logDate === selectedDate : true;

    return matchesReason && matchesDate;
  });
}, [logs, selectedReason, selectedDate]);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="max-w-5xl max-h-[85vh] flex flex-col">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-xl font-bold border-b pb-4">
            <Clock className="h-5 w-5 text-blue-600" />
            Audit Trail: <span className="text-blue-600 font-mono">{itemName}</span>
          </DialogTitle>
        </DialogHeader>

        <div className="flex flex-col md:flex-row gap-4 my-4">
          <div className="flex-1">
            <Select value={selectedReason} onValueChange={setSelectedReason}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Reason" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="All">All Reasons</SelectItem>
                {reasonsList.map((reason) => (
                  <SelectItem key={reason} value={reason}>{reason}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-center gap-2">
            <div className="relative">
              <Calendar className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
              <input
                type="date"
                className="flex h-10 w-full md:w-[180px] rounded-md border border-input bg-background px-9 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
              />
            </div>

            {(selectedReason !== "All" || selectedDate) && (
              <Button 
                variant="outline" 
                size="icon" 
                onClick={() => { setSelectedReason("All"); setSelectedDate(""); }}
                className="text-red-500 border-red-200 hover:bg-red-50"
                title="Clear Filters"
              >
                <FilterX className="h-4 w-4" />
              </Button>
            )}
          </div>
        </div>

        <div className="flex-1 border rounded-lg overflow-hidden bg-white shadow-inner">
          <div className="overflow-y-auto max-h-[50vh]">
            {isLoading ? (
              <div className="p-20 flex justify-center"><LoadingSpinner /></div>
            ) : (
              <Table>
                <TableHeader className="bg-slate-50 sticky top-0 z-10 shadow-sm text-xs text-nowrap">
                  <TableRow>
                    <TableHead className="w-[180px]">Date & Time</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Qty</TableHead>
                    <TableHead>Reason</TableHead>
                    <TableHead>Remarks</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredLogs.length > 0 ? (
                    filteredLogs.map((log) => (
                      <TableRow key={log._id} className="hover:bg-slate-50/50">
                        <TableCell className="text-[11px] text-slate-500 font-medium">
                          {new Date(log.dateTime).toLocaleString(undefined, {
                            dateStyle: 'medium',
                            timeStyle: 'short'
                          })}
                        </TableCell>
                        <TableCell>
                          <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                            log.type === "IN" ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
                          }`}>
                            {log.type}
                          </span>
                        </TableCell>
                        <TableCell className="font-mono font-bold text-sm">
                          {log.quantity}
                        </TableCell>
                        <TableCell className="text-xs font-semibold text-slate-700">
                          {/* Display Restock for IN types if reason is empty */}
                          {log.reason || (log.type === "IN" ? "Restock" : "Adjustment")}
                        </TableCell>
                        <TableCell className="text-xs italic text-muted-foreground">
                          {log.remarks || "-"}
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={5} className="text-center py-20 text-muted-foreground italic">
                        No transactions found for the selected criteria.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            )}
          </div>
        </div>

        <div className="mt-4 flex justify-between items-center text-[10px] text-muted-foreground font-bold uppercase tracking-widest">
          <span>{itemName} Inventory Report</span>
          <span>Showing {filteredLogs.length} Records</span>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ProductHistoryModal;