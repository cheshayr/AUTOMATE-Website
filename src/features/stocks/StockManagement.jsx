import React, { useState, useMemo } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
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
import { Button } from "@/components/ui/button";
import { Plus, ArrowUp, ArrowDown, History, Download } from "lucide-react";
import { useDebounce } from "@uidotdev/usehooks";
import { toast } from "sonner";

// Modals
import AddItemModal from "./AddItemModal";
import AddCategoryModal from "./AddCategoryModal";
import DeleteCategoryModal from "./DeleteCategoryModal";
import DeleteItemModal from "./DeleteItemModal";
import StockInModal from "./StockInModal";
import StockOutModal from "./StockOutModal";
import ProductHistoryModal from "./ProductHistoryModal"; 

// Hooks
import { useFetchInventory, useFetchItemCategories } from "@/hooks/useInventoryQuery";
import { useUpdateItem } from "@/hooks/useInventoryMutation";
import { useFetchSuppliers } from "@/hooks/useSupplierQuery";
import { useCreateTransaction } from "@/hooks/useTransactionMutation"; 
import LoadingSpinner from "@/components/LoadingSpinner";

// PDF
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import logo from "@/assets/logo.png";
import { format } from "date-fns";

const StockManagement = () => {
  const [itemCategory, setItemCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [preparedBy, setPreparedBy] = useState("");
  const [exportScope, setExportScope] = useState("current"); // new: export page or all

  // Pagination State
  const [page, setPage] = useState(1);
  const pageSize = 10;

  const [stockInItem, setStockInItem] = useState(null);
  const [stockOutItem, setStockOutItem] = useState(null);
  const [historyItem, setHistoryItem] = useState(null);

  const debouncedSearchQuery = useDebounce(searchQuery, 500);

  const { data: inventoryData, isPending: inventoryDataPending } = useFetchInventory({
    filter: itemCategory,
    searchQuery: debouncedSearchQuery,
  });
  const { data: itemCategoriesData } = useFetchItemCategories();
  const { data: suppliersData } = useFetchSuppliers();

  const { mutateAsync: updateItemMutation } = useUpdateItem();
  const { mutateAsync: createTransaction } = useCreateTransaction();

  const currentSuppliers = suppliersData?.data || [];
  const currentCategories = itemCategoriesData?.data || [];

  /* ================= PAGINATION LOGIC ================= */
  const rawInventory = inventoryData?.data || [];
  const totalPages = Math.ceil(rawInventory.length / pageSize);
  
  const paginatedData = useMemo(() => {
    const start = (page - 1) * pageSize;
    return rawInventory.slice(start, start + pageSize);
  }, [rawInventory, page]);

  const calculateStockStatus = (item) => {
    const totalStock = Number(item?.stock) || 0;
    if (totalStock <= 0) return <span className="text-red-600 font-bold px-2 py-1 bg-red-50 rounded text-[10px] uppercase whitespace-nowrap">Out of Stock</span>;
    if (totalStock <= 10) return <span className="text-yellow-600 font-bold px-2 py-1 bg-yellow-50 rounded text-[10px] uppercase whitespace-nowrap">Low Stock</span>;
    return <span className="text-green-600 font-bold px-2 py-1 bg-green-50 rounded text-[10px] uppercase whitespace-nowrap">In Stock</span>;
  };

  const handleStockInSave = async (data) => {
    if (!stockInItem) return;
    try {
      const addedQuantity = Number(data.quantity) || 0;
      await updateItemMutation({ 
        id: stockInItem._id, 
        stock: (Number(stockInItem.stock) || 0) + addedQuantity,
        supplier: stockInItem.supplier?._id || stockInItem.supplier 
      });
      await createTransaction({
        itemName: stockInItem.itemName,
        type: "IN",
        quantity: addedQuantity,
        reason: "Restock",
        remarks: data.remarks || "Stock In", 
        dateTime: new Date(),
      });
      setStockInItem(null);
      toast.success("Stock In recorded as Restock");
    } catch (err) { console.error(err); }
  };

  const handleStockOutSave = async (data) => {
    if (!stockOutItem) return;
    try {
      const removedQuantity = Number(data.quantity) || 0;
      const currentStock = Number(stockOutItem.stock) || 0;
      if (currentStock - removedQuantity < 0) {
        toast.error("Insufficient stock!");
        return;
      }
      await updateItemMutation({ id: stockOutItem._id, stock: currentStock - removedQuantity });
      await createTransaction({
        itemName: stockOutItem.itemName,
        type: "OUT",
        quantity: removedQuantity,
        reason: data.reason, 
        remarks: data.remarks,
        dateTime: new Date(),
      });
      setStockOutItem(null);
      toast.success("Stock Out recorded");
    } catch (err) { console.error(err); }
  };

  /* ================= PDF EXPORT ================= */
  const COMPANY_NAME = "Tierodman Auto Center";

const handleExportPDF = () => {
  if (!preparedBy.trim()) {
    toast.error("Please enter who prepared the report.");
    return;
  }

  const dataToExport = exportScope === "all" ? rawInventory : paginatedData;

  if (dataToExport.length === 0) {
    toast.error("No inventory data to export.");
    return;
  }

  const doc = new jsPDF();
  const exportedAt = format(new Date(), "MMM dd, yyyy • hh:mm a");

  autoTable(doc, {
    head: [["Item Name", "Category", "Supplier", "Stock", "Status"]],

    body: dataToExport.map((item) => [
      item.itemName || "N/A",
      item.category || "N/A",
      item.supplier?.companyName || item.companyName || "No Supplier",
      item.stock ?? 0,
      item.stock <= 0
        ? "Out of Stock"
        : item.stock <= 10
        ? "Low Stock"
        : "In Stock",
    ]),

    startY: 70,
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
        doc.addImage(logo, "PNG", 14, 10, 20, 20);

        // Title
        doc.setFontSize(16);
        doc.text("Inventory Report", pageWidth / 2, 20, {
          align: "center",
        });

        // Company Name
        doc.setFontSize(10);
        doc.text(COMPANY_NAME, pageWidth / 2, 26, {
          align: "center",
        });

        // Meta Info
        doc.text(`Category Filter: ${itemCategory}`, 14, 40);
        doc.text(`Prepared By: ${preparedBy}`, 14, 46);
        doc.text(`Exported: ${exportedAt}`, 14, 52);
        doc.text(
          `Scope: ${exportScope === "all" ? "All Pages" : "Current Page"}`,
          14,
          58
        );

        // Divider
        doc.setLineWidth(0.3);
        doc.line(14, 64, pageWidth - 14, 64);
      }

      // ================= FOOTER (ALL PAGES) =================
      doc.setLineWidth(0.3);
      doc.line(14, pageHeight - 15, pageWidth - 14, pageHeight - 15);

      doc.setFontSize(9);

      // LEFT: Company
      doc.text(COMPANY_NAME, 14, pageHeight - 8);

      // RIGHT: Page number
      doc.text(
        `Page ${pageNumber} of ${pageCount}`,
        pageWidth - 14,
        pageHeight - 8,
        { align: "right" }
      );
    },
  });

  doc.save(`inventory_report_${format(new Date(), "yyyy-MM-dd")}.pdf`);
  toast.success("Inventory exported successfully!");
};

  return (
    <Card className="w-full bg-transparent shadow-none border-0">
      <CardHeader className="px-0">
        <CardTitle className="text-2xl font-bold">Inventory Management</CardTitle>
        <CardDescription>Monitor stock levels, track suppliers, and view activity logs.</CardDescription>
      </CardHeader>

      <CardContent className="px-0">
        {/* Search + Filter */}
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <Input 
            placeholder="Search items..." 
            className="flex-1" 
            value={searchQuery} 
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setPage(1);
            }} 
          />
          <div className="min-w-[200px]">
            <Select value={itemCategory} onValueChange={(val) => { setItemCategory(val); setPage(1); }}>
              <SelectTrigger><SelectValue placeholder="Category" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="All">All Categories</SelectItem>
                {currentCategories.map((c) => <SelectItem key={c._id} value={c.categoryName}>{c.categoryName}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Add buttons + Export */}
        <div className="flex flex-wrap gap-3 mb-8 items-end">
          <AddItemModal itemCategories={currentCategories} suppliers={currentSuppliers}>
            <Button className="bg-blue-600 hover:bg-blue-700"><Plus className="mr-2 h-4 w-4" /> Add Product</Button>
          </AddItemModal>
          <AddCategoryModal><Button variant="outline">Add Category</Button></AddCategoryModal>
          <DeleteCategoryModal itemCategories={currentCategories}><Button variant="ghost" className="text-destructive">Delete Category</Button></DeleteCategoryModal>

          <Input
            placeholder="Prepared by"
            value={preparedBy}
            onChange={(e) => setPreparedBy(e.target.value)}
            className="h-9 w-[200px]"
          />

          <Select value={exportScope} onValueChange={setExportScope} className="h-9 w-[160px]">
            <SelectTrigger><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="current">Current Page</SelectItem>
              <SelectItem value="all">All Pages</SelectItem>
            </SelectContent>
          </Select>

          <Button variant="outline" onClick={handleExportPDF} className="h-9 px-4">
            <Download className="h-4 w-4 mr-2" /> Export PDF
          </Button>
        </div>

        {/* Table */}
        <div className="border rounded-lg bg-white overflow-hidden shadow-sm">
          <Table>
            <TableHeader className="bg-slate-50">
              <TableRow>
                <TableHead className="font-bold">Item Name</TableHead>
                <TableHead className="font-bold">Category</TableHead>
                <TableHead className="font-bold">Supplier</TableHead>
                <TableHead className="font-bold">Stock</TableHead>
                <TableHead className="font-bold">Status</TableHead>
                <TableHead className="text-center font-bold">Stock Control</TableHead>
                <TableHead className="text-right font-bold">Logs</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {inventoryDataPending ? (
                <TableRow><TableCell colSpan={7} className="text-center py-12"><LoadingSpinner /></TableCell></TableRow>
              ) : paginatedData.length > 0 ? (
                paginatedData.map((item) => (
                  <TableRow key={item._id} className="hover:bg-slate-50/50">
                    <TableCell className="font-semibold text-slate-900">{item.itemName}</TableCell>
                    <TableCell className="text-slate-600">{item.category}</TableCell>
                    <TableCell className="text-xs text-slate-600 font-medium">{item.supplier?.companyName || item.companyName || "No Supplier"}</TableCell>
                    <TableCell className="font-mono font-bold text-blue-600">{item.stock}</TableCell>
                    <TableCell>{calculateStockStatus(item)}</TableCell>
                    <TableCell className="text-center">
                      <div className="flex justify-center gap-2">
                        <Button size="sm" variant="outline" onClick={() => setStockInItem(item)} className="h-7 px-3 border-green-200 text-green-700 text-[10px] font-bold hover:bg-green-50"><ArrowUp className="mr-1 h-3 w-3" /> IN</Button>
                        <Button size="sm" variant="outline" onClick={() => setStockOutItem(item)} className="h-7 px-3 border-red-200 text-red-700 text-[10px] font-bold hover:bg-red-50"><ArrowDown className="mr-1 h-3 w-3" /> OUT</Button>
                      </div>
                    </TableCell>
                    <TableCell className="text-right space-x-1">
                      <Button size="icon" variant="ghost" className="h-8 w-8 hover:bg-blue-50" onClick={() => setHistoryItem(item)}><History className="h-4 w-4 text-blue-500" /></Button>
                      <DeleteItemModal itemName={item.itemName} id={item._id} />
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow><TableCell colSpan={7} className="text-center py-10 text-muted-foreground">No inventory records found.</TableCell></TableRow>
              )}
            </TableBody>
          </Table>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex justify-between items-center mt-6 px-2">
            <span className="text-sm text-muted-foreground font-medium">Showing {Math.min(paginatedData.length, pageSize)} of {rawInventory.length} items (Page {page} of {totalPages})</span>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" disabled={page === 1} onClick={() => setPage((p) => p - 1)} className="h-8 px-4">Previous</Button>
              <Button variant="outline" size="sm" disabled={page === totalPages} onClick={() => setPage((p) => p + 1)} className="h-8 px-4">Next</Button>
            </div>
          </div>
        )}
      </CardContent>

      {stockInItem && <StockInModal open={!!stockInItem} setOpen={() => setStockInItem(null)} item={stockInItem} onSave={handleStockInSave} />}
      {stockOutItem && <StockOutModal open={!!stockOutItem} setOpen={() => setStockOutItem(null)} item={stockOutItem} onSave={handleStockOutSave} />}
      {historyItem && <ProductHistoryModal open={!!historyItem} setOpen={() => setHistoryItem(null)} itemName={historyItem.itemName} supplierName={historyItem.supplier?.companyName || historyItem.companyName} />}
    </Card>
  );
};

export default StockManagement;
