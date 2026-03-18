import React, { useMemo, useState } from "react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import {
  Table,
  TableHead,
  TableHeader,
  TableRow,
  TableCell,
  TableBody,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { ChevronDown, Download } from "lucide-react";
import { useDebounce } from "@uidotdev/usehooks";
import LoadingSpinner from "@/components/LoadingSpinner";

import { useFetchTransactions } from "@/hooks/useTransactionQuery";
import { useCreateTransaction } from "@/hooks/useTransactionMutation"; 

import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import logo from "@/assets/logo.png";
import { format } from "date-fns";

const PAGE_SIZES = [10, 20, 50];

const formatDateTimePH = (date) =>
  new Intl.DateTimeFormat("en-PH", {
    timeZone: "Asia/Manila",
    month: "short",
    day: "2-digit",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  }).format(new Date(date));

const InventoryTransactionsPage = () => {
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [pageSize] = useState(10);

  const [dateFrom, setDateFrom] = useState(null);
  const [dateTo, setDateTo] = useState(null);

  const [dateFromOpen, setDateFromOpen] = useState(false);
  const [dateToOpen, setDateToOpen] = useState(false);

  const [typeFilter, setTypeFilter] = useState("ALL");
  const [preparedBy, setPreparedBy] = useState("");
  const [exportScope, setExportScope] = useState("page");

  const debouncedSearch = useDebounce(search, 400);

  const { data, isPending } = useFetchTransactions({
    searchQuery: debouncedSearch,
  });

  const transactions = data?.data || [];
  const createTransaction = useCreateTransaction();

  const filteredTransactions = useMemo(() => {
    return transactions.filter((tx) => {
      const txDate = new Date(tx.dateTime);
      const dateFromTime = dateFrom ? new Date(dateFrom.setHours(0, 0, 0, 0)) : null;
      const dateToTime = dateTo ? new Date(dateTo.setHours(23, 59, 59, 999)) : null;

      if (dateFromTime && txDate < dateFromTime) return false;
      if (dateToTime && txDate > dateToTime) return false;
      if (typeFilter !== "ALL" && tx.type !== typeFilter) return false;

      const searchLower = debouncedSearch.toLowerCase();
      if (searchLower) {
        const item = tx.itemName?.toLowerCase() || "";
        const supplier = tx.supplier?.supplierName?.toLowerCase() || tx.supplierName?.toLowerCase() || "";
        const reason = tx.reason?.toLowerCase() || "";
        if (!item.includes(searchLower) && !supplier.includes(searchLower) && !reason.includes(searchLower)) {
          return false;
        }
      }

      return true;
    });
  }, [transactions, dateFrom, dateTo, typeFilter, debouncedSearch]);

  const totalPages = Math.ceil(filteredTransactions.length / pageSize);
  const paginatedData = useMemo(() => {
    const start = (page - 1) * pageSize;
    return filteredTransactions.slice(start, start + pageSize);
  }, [filteredTransactions, page, pageSize]);

  const COMPANY_NAME = "Tierodman Auto Center";

const handleExportPDF = () => {
  if (!preparedBy.trim()) {
    toast.error('Please enter "Prepared By" before exporting.');
    return;
  }

  const dataToExport = exportScope === "all" ? filteredTransactions : paginatedData;

  if (!dataToExport.length) {
    toast.error("No transactions available to export.");
    return;
  }

  const doc = new jsPDF();
  const exportedAt = format(new Date(), "MMM dd, yyyy • hh:mm a");

  autoTable(doc, {
    startY: 75,
    head: [["ID", "Date & Time", "Item", "Supplier", "Purpose", "Type", "Qty", "Remarks"]],
    body: dataToExport.map((tx) => [
      tx._id,
      formatDateTimePH(tx.dateTime),
      tx.itemName || "-",
      tx.supplier?.supplierName || tx.supplierName || "-",
      tx.reason || "-",
      tx.type,
      tx.quantity,
      tx.remarks || "-",
    ]),
    styles: { fontSize: 9 },
    headStyles: { fillColor: [71, 85, 105] },

    didDrawPage: function () {
      const pageHeight = doc.internal.pageSize.height;
      const pageWidth = doc.internal.pageSize.width;
      const pageNumber = doc.internal.getCurrentPageInfo().pageNumber;
      const pageCount = doc.internal.getNumberOfPages();

      // ================= HEADER (FIRST PAGE ONLY) =================
      if (pageNumber === 1) {
        // Logo
        doc.addImage(logo, "PNG", 14, 10, 30, 30);

        // Title
        doc.setFontSize(16);
        doc.text("Inventory Transaction History", pageWidth / 2, 20, { align: "center" });

        // Company Name
        doc.setFontSize(10);
        doc.text(COMPANY_NAME, pageWidth / 2, 26, { align: "center" });

        // Metadata
        doc.text(`Prepared By: ${preparedBy}`, 14, 45);
        doc.text(`Exported On: ${exportedAt}`, 14, 52);
        doc.text(
          `Export Scope: ${exportScope === "all" ? "All Transactions" : "Current Page"}`,
          14,
          59
        );

        if (dateFrom || dateTo) {
          doc.text(
            `Date Range: ${dateFrom ? format(dateFrom, "MMM dd, yyyy") : ""} - ${dateTo ? format(dateTo, "MMM dd, yyyy") : ""}`,
            14,
            66
          );
        }

        // Divider
        doc.setLineWidth(0.3);
        doc.line(14, 72, pageWidth - 14, 72);
      }

      // ================= FOOTER (ALL PAGES) =================
      doc.setLineWidth(0.3);
      doc.line(14, pageHeight - 15, pageWidth - 14, pageHeight - 15);

      doc.setFontSize(9);
      doc.text(COMPANY_NAME, 14, pageHeight - 8);
      doc.text(`Page ${pageNumber} of ${pageCount}`, pageWidth - 14, pageHeight - 8, { align: "right" });
    },
  });

  doc.save(`inventory_transactions_${format(new Date(), "yyyy-MM-dd")}.pdf`);

  // Record export as SYSTEM transaction
  createTransaction.mutate({
    type: "SYSTEM",
    itemName: "EXPORT",
    quantity: dataToExport.length,
    reason: `Exported by ${preparedBy}`,
    remarks: `Exported ${exportScope === "all" ? "all transactions" : "current page"}`,
    dateTime: new Date().toISOString(),
  });

  toast.success("Transactions exported successfully!");
};

  return (
    <Card className="w-full bg-transparent shadow-none border-0">
      <CardHeader>
        <CardTitle className="text-2xl font-bold">
          Inventory Transaction History
        </CardTitle>
        <CardDescription>
          Complete log of all stock-in, stock-out, item/category changes, and system activities.
        </CardDescription>
      </CardHeader>

      <CardContent>
        <div className="flex flex-wrap gap-2 mb-6 items-end w-full">
          <Input
            placeholder="Search item, supplier, purpose..."
            className="h-10 max-w-xs"
            value={search}
            onChange={(e) => { setSearch(e.target.value); setPage(1); }}
          />
          <select
            value={typeFilter}
            onChange={(e) => { setTypeFilter(e.target.value); setPage(1); }}
            className="h-10 px-3 border rounded-md text-sm bg-background"
          >
            <option value="ALL">All Types</option>
            <option value="IN">Stock In</option>
            <option value="OUT">Stock Out</option>
            <option value="ITEM">Item</option>
            <option value="CATEGORY">Category</option>
            <option value="SUPPLIER">Supplier</option>
            <option value="SYSTEM">System</option>
          </select>

          <Popover open={dateFromOpen} onOpenChange={setDateFromOpen}>
            <PopoverTrigger asChild>
              <Button variant="outline" className="h-10">
                {dateFrom ? format(dateFrom, "MMM dd, yyyy") : "Date From"}
                <ChevronDown className="ml-2 h-4 w-4" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="p-0">
              <Calendar mode="single" selected={dateFrom} onSelect={(date) => { setDateFrom(date); setDateFromOpen(false); }} />
            </PopoverContent>
          </Popover>

          <Popover open={dateToOpen} onOpenChange={setDateToOpen}>
            <PopoverTrigger asChild>
              <Button variant="outline" className="h-10">
                {dateTo ? format(dateTo, "MMM dd, yyyy") : "Date To"}
                <ChevronDown className="ml-2 h-4 w-4" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="p-0">
              <Calendar mode="single" selected={dateTo} onSelect={(date) => { setDateTo(date); setDateToOpen(false); }} />
            </PopoverContent>
          </Popover>

          <Input
            placeholder="Prepared By"
            value={preparedBy}
            onChange={(e) => setPreparedBy(e.target.value)}
            className="h-10 w-36"
          />

          <select
            value={exportScope}
            onChange={(e) => setExportScope(e.target.value)}
            className="h-10 px-3 border rounded-md text-sm bg-background"
          >
            <option value="page">Current Page</option>
            <option value="all">All Transactions</option>
          </select>

          <Button variant="outline" onClick={handleExportPDF} className="h-10">
            <Download className="h-4 w-4 mr-2" /> Export PDF
          </Button>
        </div>

        <div className="border rounded-xl bg-white overflow-auto max-h-[60vh]">
          <Table className="min-w-full">
            <TableHeader className="bg-slate-100 sticky top-0 z-10">
              <TableRow>
                <TableHead>ID</TableHead>
                <TableHead>Date & Time</TableHead>
                <TableHead>Item</TableHead>
                <TableHead>Supplier</TableHead>
                <TableHead>Purpose</TableHead>
                <TableHead className="text-center">Type</TableHead>
                <TableHead className="text-center">Qty</TableHead>
                <TableHead>Remarks</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isPending ? (
                <TableRow><TableCell colSpan={8} className="py-12 text-center"><LoadingSpinner/></TableCell></TableRow>
              ) : paginatedData.length ? (
                paginatedData.map((tx,i)=>(
                  <TableRow key={tx._id} className={i%2===0?"bg-slate-50/40":""}>
                    <TableCell className="font-mono text-xs">{tx._id}</TableCell>
                    <TableCell>{formatDateTimePH(tx.dateTime)}</TableCell>
                    <TableCell>{tx.itemName || "-"}</TableCell>
                    <TableCell>{tx.supplier?.supplierName || tx.supplierName || "-"}</TableCell>
                    <TableCell>{tx.reason || "-"}</TableCell>
                    <TableCell className="text-center">
                      <Badge className={
                        tx.type==="IN"?"bg-emerald-100 text-emerald-700":
                        tx.type==="OUT"?"bg-rose-100 text-rose-700":
                        "bg-slate-100 text-slate-700"
                      }>{tx.type}</Badge>
                    </TableCell>
                    <TableCell className="text-center font-mono">{tx.quantity}</TableCell>
                    <TableCell>{tx.remarks || "-"}</TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow><TableCell colSpan={8} className="text-center py-12">No transactions found.</TableCell></TableRow>
              )}
            </TableBody>
          </Table>
        </div>

        {totalPages>1 && (
          <div className="flex justify-between items-center mt-6">
            <span className="text-sm text-muted-foreground">Page {page} of {totalPages}</span>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" disabled={page===1} onClick={()=>setPage(p=>p-1)}>Previous</Button>
              <Button variant="outline" size="sm" disabled={page===totalPages} onClick={()=>setPage(p=>p+1)}>Next</Button>
            </div>
          </div>
        )}

      </CardContent>
    </Card>
  );
};

export default InventoryTransactionsPage;
