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
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Plus, Edit, Trash2, ArrowUp, ArrowDown, History, Package, Truck } from "lucide-react";
import { useDebounce } from "@uidotdev/usehooks";
import { toast } from "sonner";

// Modals
import AddItemModal from "./AddItemModal";
import AddSupplierModal from "./AddSupplierModal";
import EditSupplierModal from "./EditSupplierModal";
import AddCategoryModal from "./AddCategoryModal";
import DeleteCategoryModal from "./DeleteCategoryModal";
import DeleteItemModal from "./DeleteItemModal";
import StockInModal from "./StockInModal";
import StockOutModal from "./StockOutModal";

// Hooks
import {
  useFetchInventory,
  useFetchItemCategories,
} from "@/hooks/useInventoryQuery";
import { useUpdateItem } from "@/hooks/useInventoryMutation";
import { useFetchSuppliers } from "@/hooks/useSupplierQuery";
import {
  useUpdateSupplier,
  useDeleteSupplier,
} from "@/hooks/useSupplierMutation";
import LoadingSpinner from "@/components/LoadingSpinner";

const StockManagement = () => {
  const [itemCategory, setItemCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [showSuppliers, setShowSuppliers] = useState(false);
  const [showTransactions, setShowTransactions] = useState(false);

  // Stock IN / OUT modal state
  const [stockInItem, setStockInItem] = useState(null);
  const [stockOutItem, setStockOutItem] = useState(null);

  // Transaction history state (Current Session)
  const [transactions, setTransactions] = useState([]);

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
  const { mutateAsync: updateSupplierMutation } = useUpdateSupplier();
  const { mutateAsync: deleteSupplierMutation } = useDeleteSupplier();

  // Memoized Supplier Map for Table display (ID -> Object)
  const supplierMap = useMemo(() => {
    const map = {};
    if (suppliersData?.data) {
      suppliersData.data.forEach((s) => {
        const id = s._id || s.id;
        if (id) map[id] = s;
      });
    }
    return map;
  }, [suppliersData]);

  const currentSuppliers = suppliersData?.data || [];
  const currentCategories = itemCategoriesData?.data || [];

  // Helper to get Supplier Name properly
  const getSupplierName = (item) => {
    if (item.supplier?.companyName) return item.supplier.companyName;
    const supplierId = item.supplier?._id || item.supplier;
    if (supplierMap[supplierId]) return supplierMap[supplierId].companyName;
    return "N/A";
  };

  const calculateStockStatus = (item) => {
    const totalStock = Number(item.stock) || 0;
    const threshold = Number(item.lowStockThreshold) || 0;
    if (totalStock <= 0) return <span className="text-red-600 font-bold">Out of Stock</span>;
    if (totalStock <= threshold) return <span className="text-yellow-600 font-bold">Low Stock</span>;
    return <span className="text-green-600 font-bold">In Stock</span>;
  };

  // Supplier Handlers
  const handleDeleteSupplier = async (id) => {
    if (!confirm("Are you sure? This will delete the supplier record.")) return;
    try {
      await deleteSupplierMutation(id);
      toast.success("Supplier deleted!");
    } catch {
      toast.error("Failed to delete supplier");
    }
  };

  const handleUpdateSupplier = async (updatedSupplier) => {
    try {
      const id = updatedSupplier._id || updatedSupplier.id;
      if (!id) throw new Error("Missing ID");
      await updateSupplierMutation({ id, ...updatedSupplier });
    } catch (err) {
      console.error("Update callback error:", err);
    }
  };

  // Stock Movement Handlers
  const handleStockInSave = async (data) => {
    if (!stockInItem) return;
    try {
      const currentStock = Number(stockInItem.stock) || 0;
      const addedQuantity = Number(data.quantity) || 0;
      const existingSupplierId = stockInItem.supplier?._id || stockInItem.supplier;
      
      await updateItemMutation({ 
        id: stockInItem._id, 
        stock: currentStock + addedQuantity,
        supplier: existingSupplierId 
      });

      setTransactions((prev) => [
        {
          id: Date.now(),
          itemName: stockInItem.itemName,
          type: "IN",
          quantity: addedQuantity,
          supplierName: getSupplierName(stockInItem),
          remarks: data.remarks,
          dateTime: data.dateTime || new Date(),
        },
        ...prev,
      ]);
      setStockInItem(null);
    } catch (err) {
      console.error(err);
    }
  };

  const handleStockOutSave = async (data) => {
    if (!stockOutItem) return;
    try {
      const currentStock = Number(stockOutItem.stock) || 0;
      const removedQuantity = Number(data.quantity) || 0;
      const newStock = currentStock - removedQuantity;

      if (newStock < 0) {
        toast.error("Insufficient stock!");
        return;
      }

      await updateItemMutation({ 
        id: stockOutItem._id, 
        stock: newStock 
      });

      setTransactions((prev) => [
        {
          id: Date.now(),
          itemName: stockOutItem.itemName,
          type: "OUT",
          quantity: removedQuantity,
          remarks: data.remarks,
          dateTime: data.dateTime || new Date(),
        },
        ...prev,
      ]);
      setStockOutItem(null);
    } catch (err) {
       console.error(err);
    }
  };

  return (
    <Card className="w-full bg-transparent shadow-none border-0">
      <CardHeader>
        <CardTitle className="text-2xl font-bold">Inventory Management</CardTitle>
        <CardDescription>Track items, categories, and suppliers in real-time.</CardDescription>
      </CardHeader>

      <CardContent>
        {/* Filters */}
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <Input
            placeholder="Search item name..."
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

        {/* Action Buttons */}
        <div className="flex flex-wrap gap-3 mb-8">
          <AddItemModal itemCategories={currentCategories} suppliers={currentSuppliers}>
            <Button><Plus className="mr-2 h-4 w-4" /> Add Product</Button>
          </AddItemModal>

          <AddSupplierModal>
            <Button variant="outline"><Truck className="mr-2 h-4 w-4" /> Add Supplier</Button>
          </AddSupplierModal>

          {/* Look for this line in your StockManagement.jsx */}
<AddCategoryModal>
  <Button variant="outline">
    <Plus className="mr-2 h-4 w-4" /> Add Category
  </Button>
</AddCategoryModal>
          
          <DeleteCategoryModal itemCategories={currentCategories}>
            <Button variant="ghost" className="text-destructive">Delete Category</Button>
          </DeleteCategoryModal>

          <Button variant="secondary" onClick={() => setShowSuppliers(!showSuppliers)}>
            {showSuppliers ? "Hide Suppliers" : "Show Suppliers"}
          </Button>

          <Button variant="secondary" onClick={() => setShowTransactions(!showTransactions)}>
            {showTransactions ? "Hide Log" : "View Logs"}
          </Button>
        </div>

        {/* Supplier Directory */}
        {showSuppliers && (
          <div className="mb-8 border rounded-lg p-4 bg-slate-50 animate-in fade-in duration-300">
            <h3 className="font-bold mb-4">Supplier Directory</h3>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Company</TableHead>
                  <TableHead>Contact</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {currentSuppliers.length > 0 ? currentSuppliers.map((s) => {
                  const sId = s._id || s.id;
                  return (
                    <TableRow key={sId}>
                      <TableCell className="font-medium">{s.companyName}</TableCell>
                      <TableCell>{s.contactPerson}</TableCell>
                      <TableCell className="text-right space-x-2">
                        <EditSupplierModal supplier={s} onSupplierUpdated={handleUpdateSupplier}>
                          <Button size="icon" variant="ghost"><Edit size={14}/></Button>
                        </EditSupplierModal>
                        <Button size="icon" variant="ghost" className="text-destructive" onClick={() => handleDeleteSupplier(sId)}>
                          <Trash2 size={14}/>
                        </Button>
                      </TableCell>
                    </TableRow>
                  );
                }) : <TableRow><TableCell colSpan={3} className="text-center">No suppliers registered.</TableCell></TableRow>}
              </TableBody>
            </Table>
          </div>
        )}

        {/* Inventory Table */}
        <div className="border rounded-md bg-white">
          <Table>
            <TableHeader className="bg-slate-50">
              <TableRow>
                <TableHead>Item Name</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Supplier</TableHead>
                <TableHead>Stock</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-center">Stock Actions</TableHead>
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
                    <TableCell>{getSupplierName(item)}</TableCell>
                    <TableCell className="font-mono text-lg">{item.stock}</TableCell>
                    <TableCell>{calculateStockStatus(item)}</TableCell>
                    <TableCell className="flex justify-center gap-2">
                      <Button size="icon" variant="outline" onClick={() => setStockInItem(item)} title="Stock In">
                        <ArrowUp className="h-4 w-4 text-green-600"/>
                      </Button>
                      <Button size="icon" variant="outline" onClick={() => setStockOutItem(item)} title="Stock Out">
                        <ArrowDown className="h-4 w-4 text-red-600"/>
                      </Button>
                      <DeleteItemModal itemName={item.itemName} id={item._id} />
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow><TableCell colSpan={6} className="text-center py-10">No items found.</TableCell></TableRow>
              )}
            </TableBody>
          </Table>
        </div>

        {/* Log section */}
        {showTransactions && (
           <div className="mt-8 border rounded-lg bg-slate-50 p-4 animate-in slide-in-from-bottom-2 duration-300">
             <h3 className="font-bold mb-4 flex items-center gap-2"><History size={18}/> Recent Activity</h3>
             <Table>
               <TableHeader>
                 <TableRow>
                   <TableHead>Date</TableHead>
                   <TableHead>Item</TableHead>
                   <TableHead>Type</TableHead>
                   <TableHead>Qty</TableHead>
                   <TableHead>Remarks</TableHead>
                 </TableRow>
               </TableHeader>
               <TableBody>
                 {transactions.length === 0 ? <TableRow><TableCell colSpan={5} className="text-center py-4 text-muted-foreground">No recent stock movements.</TableCell></TableRow> :
                 transactions.map((t) => (
                   <TableRow key={t.id}>
                     <TableCell className="text-xs text-muted-foreground">{new Date(t.dateTime).toLocaleString()}</TableCell>
                     <TableCell className="font-medium">{t.itemName}</TableCell>
                     <TableCell>
                       <span className={t.type === "IN" ? "text-green-600 font-bold" : "text-red-600 font-bold"}>
                         {t.type}
                       </span>
                     </TableCell>
                     <TableCell className="font-semibold">{t.quantity}</TableCell>
                     <TableCell className="text-xs italic text-muted-foreground">{t.remarks || "—"}</TableCell>
                   </TableRow>
                 ))}
               </TableBody>
             </Table>
           </div>
         )}
      </CardContent>

      {/* Modals */}
      {stockInItem && (
        <StockInModal
          open={!!stockInItem}
          setOpen={() => setStockInItem(null)}
          item={stockInItem}
          suppliers={currentSuppliers}
          onSave={handleStockInSave}
        />
      )}
      {stockOutItem && (
        <StockOutModal
          open={!!stockOutItem}
          setOpen={() => setStockOutItem(null)}
          item={stockOutItem}
          onSave={handleStockOutSave}
        />
      )}
    </Card>
  );
};

export default StockManagement;