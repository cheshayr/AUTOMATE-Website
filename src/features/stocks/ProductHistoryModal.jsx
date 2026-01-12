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
import { Clock, ArrowRight, Building2, TrendingUp, TrendingDown, Filter } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useFetchTransactions } from "@/hooks/useTransactionQuery";
import LoadingSpinner from "@/components/LoadingSpinner";

const ProductHistoryModal = ({ open, setOpen, itemName, supplierName }) => {
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
    return firstLog?.supplierName || firstLog?.companyName || firstLog?.supplier?.companyName || "N/A";
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

  const summary = useMemo(() => {
    return filteredLogs.reduce((acc, log) => {
      const qty = Number(log.quantity) || 0;
      if (log.type === "IN") acc.in += qty;
      else if (log.type === "OUT") acc.out += qty;
      return acc;
    }, { in: 0, out: 0 });
  }, [filteredLogs]);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="max-w-5xl max-h-[90vh] flex flex-col">
        <DialogHeader className="border-b pb-4">
          <div className="flex justify-between items-start">
            <div>
              <DialogTitle className="flex items-center gap-2 text-xl font-bold">
                <Clock className="h-5 w-5 text-blue-600" />
                Audit Trail: <span className="text-slate-700 font-normal ml-1">{itemName}</span>
              </DialogTitle>
              
              <div className="flex items-center gap-1.5 text-sm text-muted-foreground mt-1 ml-7">
                <Building2 className="h-3.5 w-3.5 text-blue-500" />
                <span className="font-semibold text-slate-900">{resolvedCompanyName}</span>
              </div>
            </div>
            
            {/* Logic to show if filters are active */}
            {(selectedReason !== "All" || dateFrom || dateTo) && (
              <div className="flex items-center gap-1 bg-amber-50 text-amber-700 px-2 py-1 rounded border border-amber-100 text-[10px] font-bold uppercase tracking-tight">
                <Filter className="h-3 w-3" /> Filtered View
              </div>
            )}
          </div>
        </DialogHeader>

        {/* SUMMARY CARDS (2 Columns) */}
        <div className="grid grid-cols-2 gap-4 my-4">
          <div className="bg-green-50 border border-green-100 rounded-lg p-4 flex items-center justify-between">
            <div>
              <div className="flex items-center gap-2 text-green-600 mb-1">
                <TrendingUp className="h-4 w-4" />
                <span className="text-[10px] font-bold uppercase tracking-wider">Total Stock In</span>
              </div>
              <p className="text-3xl font-bold text-green-700">{summary.in}</p>
            </div>
            <div className="text-green-200"><TrendingUp size={48} strokeWidth={3} /></div>
          </div>
          
          <div className="bg-red-50 border border-red-100 rounded-lg p-4 flex items-center justify-between">
            <div>
              <div className="flex items-center gap-2 text-red-600 mb-1">
                <TrendingDown className="h-4 w-4" />
                <span className="text-[10px] font-bold uppercase tracking-wider">Total Stock Out</span>
              </div>
              <p className="text-3xl font-bold text-red-700">{summary.out}</p>
            </div>
            <div className="text-red-200"><TrendingDown size={48} strokeWidth={3} /></div>
          </div>
        </div>

        {/* FILTERS */}
        <div className="flex flex-col md:flex-row items-end gap-4 mb-4">
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

        {/* TABLE SECTION */}
        <div className="flex-1 border rounded-lg overflow-hidden bg-white shadow-inner">
          <div className="overflow-y-auto max-h-[40vh]">
            {isLoading ? <div className="p-20 flex justify-center"><LoadingSpinner /></div> : (
              <Table>
                <TableHeader className="bg-slate-50 sticky top-0 z-10">
                  <TableRow>
                    <TableHead className="w-[180px]">Date & Time</TableHead>
                    <TableHead className="w-[100px]">Type</TableHead>
                    <TableHead className="w-[100px]">Qty</TableHead>
                    <TableHead>Reason</TableHead>
                    <TableHead>Remarks</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredLogs.length > 0 ? (
                    filteredLogs.map((log) => (
                      <TableRow key={log._id} className="text-xs hover:bg-slate-50/50">
                        <TableCell className="text-slate-500">
                          {new Date(log.dateTime).toLocaleString(undefined, {
                            dateStyle: 'medium',
                            timeStyle: 'short'
                          })}
                        </TableCell>
                        <TableCell>
                          <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${log.type === "IN" ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}>
                            {log.type}
                          </span>
                        </TableCell>
                        <TableCell className="font-mono font-bold text-sm">
                          {log.type === "IN" ? "+" : "-"}{log.quantity}
                        </TableCell>
                        <TableCell className="font-medium text-slate-700">
                          {log.reason || (log.type === "IN" ? "Restock" : "Adjustment")}
                        </TableCell>
                        <TableCell className="italic text-muted-foreground">{log.remarks || "-"}</TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={5} className="text-center py-20 text-muted-foreground italic">
                        No transactions found for this period.
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