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
import { Calendar, Clock, FilterX, ArrowRight, Building2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useFetchTransactions } from "@/hooks/useTransactionQuery";
import LoadingSpinner from "@/components/LoadingSpinner";

const ProductHistoryModal = ({ open, setOpen, itemName, supplierName }) => {
  // FIXED: Passing itemName inside an object to match your hook's requirements
  const { data: transactionData, isLoading } = useFetchTransactions({ itemName });
  
  const logs = useMemo(() => {
    if (Array.isArray(transactionData)) return transactionData;
    if (transactionData?.data && Array.isArray(transactionData.data)) return transactionData.data;
    return [];
  }, [transactionData]);

  const [selectedReason, setSelectedReason] = useState("All");
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");

  const reasonsList = ["Sale", "Damage", "Adjustment", "Expired", "Restock"];

  const resolvedCompanyName = useMemo(() => {
    if (supplierName) return supplierName;
    const firstLog = logs[0];
    return (
      firstLog?.supplierName || 
      firstLog?.companyName || 
      firstLog?.supplier?.companyName || 
      "N/A"
    );
  }, [supplierName, logs]);

  const filteredLogs = useMemo(() => {
    return logs.filter((log) => {
      const matchesReason = selectedReason === "All" 
        ? true 
        : (log.reason === selectedReason || (selectedReason === "Restock" && log.type === "IN"));

      const logDate = log.dateTime ? new Date(log.dateTime).toISOString().split('T')[0] : "";
      let matchesDate = true;
      if (dateFrom && logDate < dateFrom) matchesDate = false;
      if (dateTo && logDate > dateTo) matchesDate = false;

      return matchesReason && matchesDate;
    });
  }, [logs, selectedReason, dateFrom, dateTo]);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="max-w-5xl max-h-[85vh] flex flex-col">
        <DialogHeader className="border-b pb-4">
          <DialogTitle className="flex items-center gap-2 text-xl font-bold">
            <Clock className="h-5 w-5 text-blue-600" />
            Audit Trail: <span className="text-slate-700 font-normal ml-1">{itemName}</span>
          </DialogTitle>
          
          <div className="flex items-center gap-1.5 text-sm text-muted-foreground mt-1 ml-7">
            <Building2 className="h-3.5 w-3.5 text-blue-500" />
            <span className="font-semibold">Supplier/Company:</span>
            <span className="text-slate-600">{resolvedCompanyName}</span>
          </div>
        </DialogHeader>

        <div className="flex flex-col md:flex-row items-end gap-4 my-4">
          <div className="flex-1 w-full">
            <label className="text-[10px] font-bold uppercase text-slate-500 ml-1 mb-1 block">Filter by Reason</label>
            <Select value={selectedReason} onValueChange={setSelectedReason}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Reason" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="All">All Reasons</SelectItem>
                {reasonsList.map((r) => <SelectItem key={r} value={r}>{r}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-[10px] font-bold uppercase text-slate-500 ml-1 block">Date Range</label>
            <div className="flex items-center gap-2">
              <input type="date" className="h-10 rounded-md border px-3 text-xs" value={dateFrom} onChange={(e) => setDateFrom(e.target.value)} />
              <ArrowRight className="h-4 w-4 text-slate-400" />
              <input type="date" className="h-10 rounded-md border px-3 text-xs" value={dateTo} onChange={(e) => setDateTo(e.target.value)} />
            </div>
          </div>
        </div>

        <div className="flex-1 border rounded-lg overflow-hidden bg-white">
          <div className="overflow-y-auto max-h-[50vh]">
            {isLoading ? <div className="p-20 flex justify-center"><LoadingSpinner /></div> : (
              <Table>
                <TableHeader className="bg-slate-50 sticky top-0 z-10">
                  <TableRow>
                    <TableHead>Date & Time</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Qty</TableHead>
                    <TableHead>Reason</TableHead>
                    <TableHead>Remarks</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredLogs.length > 0 ? (
                    filteredLogs.map((log) => (
                      <TableRow key={log._id} className="text-xs hover:bg-slate-50/50">
                        <TableCell>{new Date(log.dateTime).toLocaleString()}</TableCell>
                        <TableCell>
                          <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${log.type === "IN" ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}>
                            {log.type}
                          </span>
                        </TableCell>
                        <TableCell className="font-mono font-bold">{log.quantity}</TableCell>
                        <TableCell className="font-medium">{log.reason || (log.type === "IN" ? "Restock" : "Adjustment")}</TableCell>
                        <TableCell className="italic text-muted-foreground">{log.remarks || "-"}</TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={5} className="text-center py-20 text-muted-foreground italic">
                        No transactions found for this item.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ProductHistoryModal;