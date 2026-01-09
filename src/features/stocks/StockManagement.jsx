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
import { Plus, ArrowUp, ArrowDown, History } from "lucide-react";
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
import { useCreateTransaction } from "@/hooks/useTransactionMutation"; // Hook we created
import LoadingSpinner from "@/components/LoadingSpinner";

const StockManagement = () => {
  const [itemCategory, setItemCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  
  // Modal states
  const [stockInItem, setStockInItem] = useState(null);
  const [stockOutItem, setStockOutItem] = useState(null);
  const [historyItem, setHistoryItem] = useState(null);

  const debouncedSearchQuery = useDebounce(searchQuery, 500);

  // Data Fetching
  const { data: inventoryData, isPending: inventoryDataPending } = useFetchInventory({
    filter: itemCategory,
    searchQuery: debouncedSearchQuery,
  });
  const { data: itemCategoriesData } = useFetchItemCategories();
  const { data: suppliersData } = useFetchSuppliers();

  // Mutations
  const { mutateAsync: updateItemMutation } = useUpdateItem();
  const { mutateAsync: createTransaction } = useCreateTransaction();

  const currentSuppliers = suppliersData?.data || [];
  const currentCategories = itemCategoriesData?.data || [];

  // Logic: Status Alert (10 Left Rule)
  const calculateStockStatus = (item) => {
    const totalStock = Number(item.stock) || 0;
    if (totalStock <= 0) return <span className="text-red-600 font-bold px-2 py-1 bg-red-50 rounded text-xs">Out of Stock</span>;
    if (totalStock <= 10) return <span className="text-yellow-600 font-bold px-2 py-1 bg-yellow-50 rounded text-xs">Low Stock</span>;
    return <span className="text-green-600 font-bold px-2 py-1 bg-green-50 rounded text-xs">In Stock</span>;
  };

  // Handler: STOCK IN (Updates Inventory + Saves Log to DB)
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
  } catch (err) {
    console.error("Stock In failed", err);
  }
};

  // Handler: STOCK OUT (Updates Inventory + Saves Log to DB)
  const handleStockOutSave = async (data) => {
    if (!stockOutItem) return;
    try {
      const removedQuantity = Number(data.quantity) || 0;
      const currentStock = Number(stockOutItem.stock) || 0;

      if (currentStock - removedQuantity < 0) {
        toast.error("Insufficient stock!");
        return;
      }

      // 1. Update the Main Inventory
      await updateItemMutation({ 
        id: stockOutItem._id, 
        stock: currentStock - removedQuantity 
      });

      // 2. Create Persistent Log in the Transactions Collection
      await createTransaction({
        itemName: stockOutItem.itemName,
        type: "OUT",
        quantity: removedQuantity,
        reason: data.reason, 
        remarks: data.remarks,
        dateTime: new Date(),
      });

      setStockOutItem(null);
    } catch (err) {
       console.error("Stock Out failed", err);
    }
  };

  return (
    <Card className="w-full bg-transparent shadow-none border-0">
      <CardHeader>
        <CardTitle className="text-2xl font-bold">Inventory Management</CardTitle>
        <CardDescription>Monitor stock levels and view detailed audit logs for every product.</CardDescription>
      </CardHeader>

      <CardContent>
        {/* Search & Category Filter */}
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <Input
            placeholder="Search items..."
            className="flex-1"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <div className="min-w-[200px]">
            <Select value={itemCategory} onValueChange={setItemCategory}>
              <SelectTrigger><SelectValue placeholder="Category" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="All">All Categories</SelectItem>
                {currentCategories.map((c) => (
                  <SelectItem key={c._id} value={c.categoryName}>{c.categoryName}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Global Action Buttons */}
        <div className="flex flex-wrap gap-3 mb-8">
          <AddItemModal itemCategories={currentCategories} suppliers={currentSuppliers}>
            <Button><Plus className="mr-2 h-4 w-4" /> Add Product</Button>
          </AddItemModal>
          <AddCategoryModal>
            <Button variant="outline">Add Category</Button>
          </AddCategoryModal>
          <DeleteCategoryModal itemCategories={currentCategories}>
            <Button variant="ghost" className="text-destructive">Delete Category</Button>
          </DeleteCategoryModal>
        </div>

        {/* Main Inventory Table */}
        <div className="border rounded-md bg-white overflow-hidden">
          <Table>
            <TableHeader className="bg-slate-50">
              <TableRow>
                <TableHead className="w-[25%]">Item Name</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Stock Level</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-center">Stock Movements</TableHead>
                <TableHead className="text-right">Audit Trail</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {inventoryDataPending ? (
                <TableRow><TableCell colSpan={6} className="text-center py-12"><LoadingSpinner /></TableCell></TableRow>
              ) : inventoryData?.data?.length > 0 ? (
                inventoryData.data.map((item) => (
                  <TableRow key={item._id} className="hover:bg-slate-50/50">
                    <TableCell className="font-medium">{item.itemName}</TableCell>
                    <TableCell>{item.category}</TableCell>
                    <TableCell className="font-mono text-lg">{item.stock}</TableCell>
                    <TableCell>{calculateStockStatus(item)}</TableCell>
                    
                    {/* Stock Adjustment Buttons */}
                    <TableCell className="text-center space-x-2">
                      <Button size="icon" variant="outline" onClick={() => setStockInItem(item)} title="Stock In">
                        <ArrowUp className="h-4 w-4 text-green-600"/>
                      </Button>
                      <Button size="icon" variant="outline" onClick={() => setStockOutItem(item)} title="Stock Out">
                        <ArrowDown className="h-4 w-4 text-red-600"/>
                      </Button>
                    </TableCell>

                    {/* Per-Product Actions (History & Delete) */}
                    <TableCell className="text-right space-x-1">
                      <Button 
                        size="icon" 
                        variant="ghost" 
                        onClick={() => setHistoryItem(item)} 
                        title="View Product Logs"
                        className="hover:bg-blue-50"
                      >
                        <History className="h-4 w-4 text-blue-500" />
                      </Button>
                      <DeleteItemModal itemName={item.itemName} id={item._id} />
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow><TableCell colSpan={6} className="text-center py-10 text-muted-foreground">No inventory records found.</TableCell></TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </CardContent>

      {/* Stock In Modal Overlay */}
      {stockInItem && (
        <StockInModal
          open={!!stockInItem}
          setOpen={() => setStockInItem(null)}
          item={stockInItem}
          onSave={handleStockInSave}
        />
      )}

      {/* Stock Out Modal Overlay */}
      {stockOutItem && (
        <StockOutModal
          open={!!stockOutItem}
          setOpen={() => setStockOutItem(null)}
          item={stockOutItem}
          onSave={handleStockOutSave}
        />
      )}
      
      {/* Persistent History Modal Overlay (Fetches logs from DB) */}
      {historyItem && (
        <ProductHistoryModal
          open={!!historyItem}
          setOpen={() => setHistoryItem(null)}
          itemName={historyItem.itemName}
        />
      )}
    </Card>
  );
};

export default StockManagement;