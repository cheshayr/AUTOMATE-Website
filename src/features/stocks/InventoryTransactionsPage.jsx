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

  const [preparedBy, setPreparedBy] = useState("");
  const [exportScope, setExportScope] = useState("page"); // "page" or "all"

  const debouncedSearch = useDebounce(search, 400);

  const { data, isPending } = useFetchTransactions({
    searchQuery: debouncedSearch,
  });

  const transactions = data?.data || [];

  /* ================= FILTERS ================= */
  const filteredTransactions = useMemo(() => {
    return transactions.filter((tx) => {
      const txDate = new Date(tx.dateTime);
      if (dateFrom && txDate < dateFrom) return false;
      if (dateTo && txDate > dateTo) return false;
      return true;
    });
  }, [transactions, dateFrom, dateTo]);

  /* ================= PAGINATION ================= */
  const totalPages = Math.ceil(filteredTransactions.length / pageSize);
  const paginatedData = useMemo(() => {
    const start = (page - 1) * pageSize;
    return filteredTransactions.slice(start, start + pageSize);
  }, [filteredTransactions, page, pageSize]);

  /* ================= PDF EXPORT ================= */
  const handleExportPDF = () => {
    if (!preparedBy.trim()) {
      alert('Please enter "Prepared By" before exporting.');
      return;
    }

    const dataToExport =
      exportScope === "all" ? filteredTransactions : paginatedData;

    if (!dataToExport.length) {
      alert("No transactions available to export.");
      return;
    }

    const doc = new jsPDF();
    const exportedAt = format(new Date(), "MMM dd, yyyy • hh:mm a");

    doc.addImage(logo, "PNG", 14, 8, 30, 30);

    doc.setFontSize(16);
    doc.text("Inventory Transaction History", 50, 20);

    doc.setFontSize(10);
    doc.text(`Prepared By: ${preparedBy}`, 14, 45);
    doc.text(`Exported On: ${exportedAt}`, 14, 52);
    doc.text(
      `Export Scope: ${exportScope === "all" ? "All Transactions" : "Current Page"}`,
      14,
      59
    );

    if (dateFrom || dateTo) {
      doc.text(
        `Date Range: ${
          dateFrom ? format(dateFrom, "MMM dd, yyyy") : ""
        } - ${dateTo ? format(dateTo, "MMM dd, yyyy") : ""}`,
        14,
        66
      );
    }

    autoTable(doc, {
      startY: 75,
      head: [
        [
          "ID",
          "Date & Time",
          "Item",
          "Supplier",
          "Purpose",
          "Type",
          "Qty",
          "Remarks",
        ],
      ],
      body: dataToExport.map((tx) => [
        tx._id,
        formatDateTimePH(tx.dateTime),
        tx.itemName,
        tx.supplier?.supplierName || tx.supplierName || "-",
        tx.reason || "-",
        tx.type,
        tx.quantity,
        tx.remarks || "-",
      ]),
      styles: { fontSize: 9 },
      headStyles: { fillColor: [71, 85, 105] },
    });

    doc.save(
      `inventory_transactions_${format(new Date(), "yyyy-MM-dd")}.pdf`
    );
  };

  return (
    <Card className="w-full bg-transparent shadow-none border-0">
      <CardHeader>
        <CardTitle className="text-2xl font-bold">
          Inventory Transaction History
        </CardTitle>
        <CardDescription>
          Complete log of all stock-in and stock-out movements.
        </CardDescription>
      </CardHeader>

      <CardContent>
        {/* Filters & Export */}
        <div className="flex flex-wrap gap-2 mb-6 items-end w-full">
          {/* Search */}
          <Input
            placeholder="Search item, supplier, purpose..."
            className="h-10 max-w-xs"
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
          />

          {/* Date From */}
          <Popover open={dateFromOpen} onOpenChange={setDateFromOpen}>
            <PopoverTrigger asChild>
              <Button variant="outline" className="h-10">
                {dateFrom ? format(dateFrom, "MMM dd, yyyy") : "Date From"}
                <ChevronDown className="ml-2 h-4 w-4" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="p-0">
              <Calendar
                mode="single"
                selected={dateFrom}
                onSelect={(date) => {
                  setDateFrom(date);
                  setDateFromOpen(false);
                }}
              />
            </PopoverContent>
          </Popover>

          {/* Date To */}
          <Popover open={dateToOpen} onOpenChange={setDateToOpen}>
            <PopoverTrigger asChild>
              <Button variant="outline" className="h-10">
                {dateTo ? format(dateTo, "MMM dd, yyyy") : "Date To"}
                <ChevronDown className="ml-2 h-4 w-4" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="p-0">
              <Calendar
                mode="single"
                selected={dateTo}
                onSelect={(date) => {
                  setDateTo(date);
                  setDateToOpen(false);
                }}
              />
            </PopoverContent>
          </Popover>

          {/* Prepared By */}
          <Input
            placeholder="Prepared By"
            value={preparedBy}
            onChange={(e) => setPreparedBy(e.target.value)}
            className="h-10 w-36"
          />

          {/* Export Scope */}
          <select
            value={exportScope}
            onChange={(e) => setExportScope(e.target.value)}
            className="h-10 px-3 border rounded-md text-sm bg-background"
          >
            <option value="page">Current Page</option>
            <option value="all">All Transactions</option>
          </select>

          {/* Export Button */}
          <Button variant="outline" onClick={handleExportPDF} className="h-10">
            <Download className="h-4 w-4 mr-2" />
            Export PDF
          </Button>
        </div>

        {/* Table */}
        <div className="border rounded-xl bg-white overflow-hidden">
          <Table>
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
                <TableRow>
                  <TableCell colSpan={8} className="py-12 text-center">
                    <LoadingSpinner />
                  </TableCell>
                </TableRow>
              ) : paginatedData.length ? (
                paginatedData.map((tx, i) => (
                  <TableRow
                    key={tx._id}
                    className={i % 2 === 0 ? "bg-slate-50/40" : ""}
                  >
                    <TableCell className="font-mono text-xs">{tx._id}</TableCell>
                    <TableCell>{formatDateTimePH(tx.dateTime)}</TableCell>
                    <TableCell className="font-medium">{tx.itemName}</TableCell>
                    <TableCell>{tx.supplier?.supplierName || tx.supplierName || "-"}</TableCell>
                    <TableCell>{tx.reason || "-"}</TableCell>
                    <TableCell className="text-center">
                      <Badge
                        className={
                          tx.type === "IN"
                            ? "bg-emerald-100 text-emerald-700"
                            : "bg-rose-100 text-rose-700"
                        }
                      >
                        {tx.type}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-center font-mono">{tx.quantity}</TableCell>
                    <TableCell>{tx.remarks || "-"}</TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={8} className="text-center py-12">
                    No transactions found.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex justify-between items-center mt-6">
            <span className="text-sm text-muted-foreground">
              Page {page} of {totalPages}
            </span>

            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                disabled={page === 1}
                onClick={() => setPage((p) => p - 1)}
              >
                Previous
              </Button>
              <Button
                variant="outline"
                size="sm"
                disabled={page === totalPages}
                onClick={() => setPage((p) => p + 1)}
              >
                Next
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default InventoryTransactionsPage;
