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
import {
  Clock,
  ArrowRight,
  Building2,
  TrendingUp,
  TrendingDown,
  Filter,
  Download,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useFetchTransactions } from "@/hooks/useTransactionQuery";
import LoadingSpinner from "@/components/LoadingSpinner";

import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { format } from "date-fns";
import logo from "@/assets/logo.png";
import { toast } from "sonner";

const ProductHistoryModal = ({ open, setOpen, itemName, supplierName }) => {
  const { data: transactionData, isLoading } = useFetchTransactions({ itemName });

  const logs = useMemo(() => {
    if (Array.isArray(transactionData)) return transactionData;
    if (transactionData?.data && Array.isArray(transactionData.data))
      return transactionData.data;
    return [];
  }, [transactionData]);

  const [selectedReason, setSelectedReason] = useState("All");
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");
  const [preparedBy, setPreparedBy] = useState("");

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
      const matchesReason =
        selectedReason === "All"
          ? true
          : log.reason === selectedReason ||
            (selectedReason === "Restock" && log.type === "IN");

      const logDate = log.dateTime
        ? new Date(log.dateTime).toISOString().split("T")[0]
        : "";

      let matchesDate = true;
      if (dateFrom && logDate < dateFrom) matchesDate = false;
      if (dateTo && logDate > dateTo) matchesDate = false;

      return matchesReason && matchesDate;
    });
  }, [logs, selectedReason, dateFrom, dateTo]);

  const summary = useMemo(() => {
    return filteredLogs.reduce(
      (acc, log) => {
        const qty = Number(log.quantity) || 0;
        if (log.type === "IN") acc.in += qty;
        else if (log.type === "OUT") acc.out += qty;
        return acc;
      },
      { in: 0, out: 0 }
    );
  }, [filteredLogs]);

  /* ===================== PDF EXPORT ===================== */
  const handleExportPDF = () => {
    if (!preparedBy.trim()) {
      toast.error("Please enter who prepared the report.");
      return;
    }

    const totalIn = summary.in;
    const totalOut = summary.out;
    const netTotal = totalIn - totalOut;

    const doc = new jsPDF();
    const exportedAt = format(new Date(), "MMM dd, yyyy • hh:mm a");

    // LOGO + TITLE
    doc.addImage(logo, "PNG", 14, 10, 30, 30);
    doc.setFontSize(16);
    doc.text("Product Audit Trail Report", 55, 20);

    // META INFO
    doc.setFontSize(10);
    doc.text(`Item: ${itemName}`, 14, 45);
    doc.text(`Supplier: ${resolvedCompanyName}`, 14, 51);
    doc.text(
      `Reason Filter: ${selectedReason === "All" ? "All" : selectedReason}`,
      14,
      57
    );
    doc.text(
      `Date Range: ${dateFrom || "—"} to ${dateTo || "—"}`,
      14,
      63
    );
    doc.text(`Prepared By: ${preparedBy}`, 14, 69);
    doc.text(`Exported On: ${exportedAt}`, 14, 75);

    // TOTALS
    doc.setFontSize(11);
    doc.text("Summary", 140, 45);
    doc.setFontSize(10);
    doc.text(`Total Stock In: ${totalIn}`, 140, 52);
    doc.text(`Total Stock Out: ${totalOut}`, 140, 58);
    doc.text(`Item Total: ${netTotal}`, 140, 64);

    // TABLE
    autoTable(doc, {
      head: [["Date & Time", "Type", "Qty", "Reason", "Remarks"]],
      body: filteredLogs.map((log) => [
        format(new Date(log.dateTime), "MMM dd, yyyy • hh:mm a"),
        log.type,
        `${log.type === "IN" ? "+" : "-"}${log.quantity}`,
        log.reason || (log.type === "IN" ? "Restock" : "Adjustment"),
        log.remarks || "-",
      ]),
      startY: 82,
      styles: { fontSize: 9 },
      headStyles: { fillColor: [71, 85, 105] },
    });

    doc.save(
      `audit_trail_${itemName}_${format(new Date(), "yyyy-MM-dd")}.pdf`
    );
    toast.success("Audit trail exported successfully");
  };
  /* ===================================================== */

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="max-w-6xl max-h-[95vh] flex flex-col">
        <DialogHeader className="border-b pb-4">
          <div className="flex justify-between items-start">
            <div>
              <DialogTitle className="flex items-center gap-2 text-xl font-bold">
                <Clock className="h-5 w-5 text-blue-600" />
                Audit Trail:
                <span className="text-slate-700 font-normal ml-1">
                  {itemName}
                </span>
              </DialogTitle>

              <div className="flex items-center gap-1.5 text-sm text-muted-foreground mt-1 ml-7">
                <Building2 className="h-3.5 w-3.5 text-blue-500" />
                <span className="font-semibold text-slate-900">
                  {resolvedCompanyName}
                </span>
              </div>
            </div>

            {(selectedReason !== "All" || dateFrom || dateTo) && (
              <div className="flex items-center gap-1 bg-amber-50 text-amber-700 px-2 py-1 rounded border border-amber-100 text-[10px] font-bold uppercase">
                <Filter className="h-3 w-3" /> Filtered View
              </div>
            )}
          </div>
        </DialogHeader>

        {/* SUMMARY CARDS */}
        <div className="grid grid-cols-2 gap-4 my-4">
          <div className="bg-green-50 border rounded-lg p-4 flex justify-between">
            <div>
              <div className="flex items-center gap-2 text-green-600 mb-1">
                <TrendingUp className="h-4 w-4" />
                <span className="text-[10px] font-bold uppercase">
                  Total Stock In
                </span>
              </div>
              <p className="text-3xl font-bold text-green-700">{summary.in}</p>
            </div>
            <TrendingUp size={48} className="text-green-200" />
          </div>

          <div className="bg-red-50 border rounded-lg p-4 flex justify-between">
            <div>
              <div className="flex items-center gap-2 text-red-600 mb-1">
                <TrendingDown className="h-4 w-4" />
                <span className="text-[10px] font-bold uppercase">
                  Total Stock Out
                </span>
              </div>
              <p className="text-3xl font-bold text-red-700">{summary.out}</p>
            </div>
            <TrendingDown size={48} className="text-red-200" />
          </div>
        </div>

        {/* FILTERS + EXPORT */}
        <div className="flex flex-wrap items-end justify-between gap-4 mb-4 w-full">
          <div className="flex gap-4 flex-wrap">
            {/* REASON FILTER */}
            <div>
              <label className="text-[10px] font-bold uppercase text-slate-500">
                Filter by Reason
              </label>
              <Select value={selectedReason} onValueChange={setSelectedReason}>
                <SelectTrigger className="w-[140px]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="All">All</SelectItem>
                  {reasonsList.map((r) => (
                    <SelectItem key={r} value={r}>
                      {r}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* DATE RANGE */}
            <div className="flex flex-col gap-1">
              <label className="text-[10px] font-bold uppercase text-slate-500">
                Date Range
              </label>
              <div className="flex items-center gap-2 flex-wrap">
                <input
                  type="date"
                  className="h-10 rounded-md border px-2 text-xs max-w-[120px]"
                  value={dateFrom}
                  onChange={(e) => setDateFrom(e.target.value)}
                />
                <ArrowRight className="h-4 w-4 text-slate-400" />
                <input
                  type="date"
                  className="h-10 rounded-md border px-2 text-xs max-w-[120px]"
                  value={dateTo}
                  onChange={(e) => setDateTo(e.target.value)}
                />
              </div>
            </div>
          </div>

          {/* PREPARED BY + EXPORT */}
          <div className="flex items-end gap-2 flex-wrap">
            <Input
              value={preparedBy}
              onChange={(e) => setPreparedBy(e.target.value)}
              placeholder="Prepared by"
              className="h-9 w-[140px] max-w-full"
            />
            <Button variant="outline" onClick={handleExportPDF} className="flex-shrink-0">
              <Download className="h-4 w-4 mr-2" />
              Export PDF
            </Button>
          </div>
        </div>

        {/* TABLE */}
        <div className="flex-1 border rounded-lg overflow-hidden flex flex-col">
          <div className="overflow-y-auto flex-1">
            {isLoading ? (
              <div className="p-20 flex justify-center">
                <LoadingSpinner />
              </div>
            ) : (
              <Table className="min-w-full">
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
                  {filteredLogs.length ? (
                    filteredLogs.map((log) => (
                      <TableRow key={log._id} className="text-xs">
                        <TableCell className="text-slate-500">
                          {format(
                            new Date(log.dateTime),
                            "MMM dd, yyyy • hh:mm a"
                          )}
                        </TableCell>
                        <TableCell>
                          <span
                            className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                              log.type === "IN"
                                ? "bg-green-100 text-green-700"
                                : "bg-red-100 text-red-700"
                            }`}
                          >
                            {log.type}
                          </span>
                        </TableCell>
                        <TableCell className="font-bold">
                          {log.type === "IN" ? "+" : "-"}
                          {log.quantity}
                        </TableCell>
                        <TableCell>{log.reason || "—"}</TableCell>
                        <TableCell className="italic text-muted-foreground">
                          {log.remarks || "-"}
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={5} className="text-center py-20">
                        No transactions found.
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
