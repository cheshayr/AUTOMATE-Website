// StockManagement.js
import React, { useEffect, useState } from "react";
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
import {
  Save,
  Plus,
  Edit,
  Trash2,
  ArrowUp,
  ArrowDown,
} from "lucide-react";
import { useDebounce } from "@uidotdev/usehooks";
import { toast } from "sonner";

import AddItemModal from "./AddItemModal";
import AddSupplierModal from "./AddSupplierModal";
import EditSupplierModal from "./EditSupplierModal";
import AddCategoryModal from "./AddCategoryModal";
import DeleteCategoryModal from "./DeleteCategoryModal";
import DeleteItemModal from "./DeleteItemModal";

import StockInModal from "./StockInModal";
import StockOutModal from "./StockOutModal";

import {
  useFetchInventory,
  useFetchItemCategories,
} from "@/hooks/useInventoryQuery";
import { useUpdateItem } from "@/hooks/useInventoryMutation";
import { useFetchSuppliers } from "@/hooks/useSupplierQuery";
import { useUpdateSupplier, useDeleteSupplier } from "@/hooks/useSupplierMutation";
import LoadingSpinner from "@/components/LoadingSpinner";

const StockManagement = () => {
  const [itemCategory, setItemCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [stockChanges, setStockChanges] = useState({});
  const [showSuppliers, setShowSuppliers] = useState(false);

  // Stock IN / OUT modal state
  const [stockInItem, setStockInItem] = useState(null);
  const [stockOutItem, setStockOutItem] = useState(null);

  // Transaction history state
  const [transactions, setTransactions] = useState([]);
  const [showTransactions, setShowTransactions] = useState(false);

  const [suppliers, setSuppliers] = useState([]);

  const debouncedSearchQuery = useDebounce(searchQuery, 500);

  const { data: inventoryData, isPending: inventoryDataPending } = useFetchInventory({
    filter: itemCategory,
    searchQuery: debouncedSearchQuery,
  });
  const { data: itemCategoriesData } = useFetchItemCategories();
  const { data: suppliersData } = useFetchSuppliers();
  const { mutateAsync: updateItemMutation } = useUpdateItem();
  const { mutateAsync: updateSupplierMutation } = useUpdateSupplier();
  const { mutateAsync: deleteSupplierMutation } = useDeleteSupplier();

  // Sync suppliers from backend
  useEffect(() => {
    if (suppliersData?.data) setSuppliers(suppliersData.data);
  }, [suppliersData]);

  // Initialize stock changes
  useEffect(() => {
    if (inventoryData?.data) {
      const initialChanges = inventoryData.data.reduce((acc, item) => {
        acc[item._id] = { sellOut: 0, addStock: 0, isModified: false };
        return acc;
      }, {});
      setStockChanges(initialChanges);
    }
  }, [inventoryData?.data]);

  // --- STOCK HANDLERS ---
  const handleStockChange = (id, field, value) => {
    const numericValue = Math.max(0, Number(value));
    setStockChanges((prev) => ({
      ...prev,
      [id]: { ...prev[id], [field]: numericValue, isModified: true },
    }));
  };

  const calculateTotalStock = (item) => {
    const changes = stockChanges[item._id] || { sellOut: 0, addStock: 0 };
    return (Number(item.stock) || 0) - changes.sellOut + changes.addStock;
  };

  const calculateStockStatus = (item) => {
    const totalStock = calculateTotalStock(item);
    const threshold = Number(item.lowStockThreshold) || 0;

    if (totalStock <= 0) return <span className="text-red-600 font-semibold">Out of Stock</span>;
    if (totalStock <= threshold) return <span className="text-yellow-600 font-semibold">Low Stock</span>;
    return <span className="text-green-600 font-semibold">In Stock</span>;
  };

  const handleSaveStockChanges = async (item) => {
    const totalStock = calculateTotalStock(item);
    if (totalStock < 0) {
      toast.error("Cannot save changes: Total stock cannot be negative.");
      return;
    }

    try {
      await updateItemMutation({ ...item, stock: totalStock });
      setStockChanges((prev) => ({
        ...prev,
        [item._id]: { sellOut: 0, addStock: 0, isModified: false },
      }));
      toast.success("Stock updated successfully!");
    } catch (error) {
      console.error(error);
      toast.error("Failed to update stock. Please try again.");
    }
  };

  // --- SUPPLIER HANDLERS ---
  const handleDeleteSupplier = async (id) => {
    if (!confirm("Are you sure you want to delete this supplier?")) return;
    try {
      await deleteSupplierMutation(id);
      setSuppliers((prev) => prev.filter((s) => s._id !== id));
      toast.success("Supplier deleted!");
    } catch (error) {
      toast.error("Failed to delete supplier");
    }
  };

  const handleUpdateSupplier = async (updatedSupplier) => {
    try {
      const res = await updateSupplierMutation(updatedSupplier);
      setSuppliers((prev) => prev.map((s) => (s._id === res._id ? res : s)));
      toast.success("Supplier updated successfully!");
    } catch (error) {
      toast.error("Failed to update supplier");
    }
  };

  const supplierMap = {};
  suppliers.forEach((s) => {
    supplierMap[s._id.toString()] = s;
  });

  // --- HANDLE STOCK IN / OUT SAVE ---
  const handleStockInSave = async (data) => {
    if (!stockInItem) return;

    try {
      const newStock = (Number(stockInItem.stock) || 0) + data.quantity;
      await updateItemMutation({ ...stockInItem, stock: newStock });
      toast.success("Stock IN saved successfully!");

      setTransactions((prev) => [
        {
          id: Date.now(),
          itemName: stockInItem.itemName,
          type: "IN",
          quantity: data.quantity,
          supplierName: suppliers.find((s) => s._id === data.supplier)?.companyName || data.supplier,
          reason: null,
          remarks: data.remarks,
          dateTime: data.date || new Date(),
        },
        ...prev,
      ]);

      setStockInItem(null);
    } catch (error) {
      console.error(error);
      toast.error("Failed to save Stock IN");
    }
  };

  const handleStockOutSave = async (data) => {
    if (!stockOutItem) return;

    try {
      const newStock = (Number(stockOutItem.stock) || 0) - data.quantity;
      if (newStock < 0) {
        toast.error("Insufficient stock");
        return;
      }
      await updateItemMutation({ ...stockOutItem, stock: newStock });
      toast.success("Stock OUT saved successfully!");

      setTransactions((prev) => [
        {
          id: Date.now(),
          itemName: stockOutItem.itemName,
          type: "OUT",
          quantity: data.quantity,
          supplierName: null,
          reason: data.reason,
          remarks: data.remarks,
          dateTime: data.date || new Date(),
        },
        ...prev,
      ]);

      setStockOutItem(null);
    } catch (error) {
      console.error(error);
      toast.error("Failed to save Stock OUT");
    }
  };

  return (
    <Card className="w-full bg-transparent shadow-none border-0">
      <CardHeader>
        <CardTitle className="text-2xl font-semibold">Inventory Management</CardTitle>
        <CardDescription>
          Manage inventory, track all stocks, and add suppliers.
        </CardDescription>
      </CardHeader>

      <CardContent>
        {/* Search & Filters */}
        <div className="flex flex-col md:flex-row md:items-end md:justify-between mb-4 gap-4">
          <div className="flex-1">
            <Input
              placeholder="Search by item name..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:flex md:items-end md:gap-3">
            <div className="min-w-36">
              <Label>Item Category</Label>
              <Select value={itemCategory} onValueChange={setItemCategory}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="All">All</SelectItem>
                  {itemCategoriesData?.data?.map((c) => (
                    <SelectItem key={c.id} value={c.categoryName}>
                      {c.categoryName}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        {/* Action Buttons including Transaction History */}
        <div className="flex flex-wrap gap-3 mb-6">
          <AddCategoryModal>
            <Button>Add Category</Button>
          </AddCategoryModal>
          <DeleteCategoryModal itemCategories={itemCategoriesData?.data}>
            <Button variant="destructive">Delete Category</Button>
          </DeleteCategoryModal>
          <AddItemModal itemCategories={itemCategoriesData?.data} suppliers={suppliers}>
            <Button><Plus /> Add Product</Button>
          </AddItemModal>
          <AddSupplierModal>
            <Button><Plus /> Add Supplier</Button>
          </AddSupplierModal>
          <Button onClick={() => setShowSuppliers(!showSuppliers)}>
            {showSuppliers ? "Hide Suppliers" : "Show Suppliers"}
          </Button>
          <Button onClick={() => setShowTransactions(!showTransactions)}>
            {showTransactions ? "Hide Transactions" : "View Transactions"}
          </Button>
        </div>

        {/* Suppliers Table */}
        {showSuppliers && (
          <div className="mb-6">
            <h2 className="text-xl font-semibold mb-2">Suppliers List</h2>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Company Name</TableHead>
                  <TableHead>Contact Person</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Contact Number</TableHead>
                  <TableHead>Address</TableHead>
                  <TableHead className="text-center">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {suppliers.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center h-24">
                      No suppliers yet
                    </TableCell>
                  </TableRow>
                ) : (
                  suppliers.map((s) => (
                    <TableRow key={s._id}>
                      <TableCell>{s.companyName}</TableCell>
                      <TableCell>{s.contactPerson}</TableCell>
                      <TableCell>{s.email || "N/A"}</TableCell>
                      <TableCell>{s.contactNumber || "N/A"}</TableCell>
                      <TableCell>{s.address || "N/A"}</TableCell>
                      <TableCell className="flex justify-center gap-2">
                        <EditSupplierModal supplier={s} onSupplierUpdated={handleUpdateSupplier}>
                          <Button size="icon" variant="ghost"><Edit size={16} /></Button>
                        </EditSupplierModal>
                        <Button size="icon" variant="destructive" onClick={() => handleDeleteSupplier(s._id)}>
                          <Trash2 size={16} />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        )}

        {/* Inventory Table */}
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Item Name</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>Supplier</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Sell Out</TableHead>
              <TableHead>Add Stock</TableHead>
              <TableHead>Total</TableHead>
              <TableHead className="text-center">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {inventoryDataPending ? (
              <TableRow>
                <TableCell colSpan={8} className="text-center h-40">
                  <LoadingSpinner />
                </TableCell>
              </TableRow>
            ) : (
              inventoryData?.data?.map((item) => (
                <TableRow key={item._id}>
                  <TableCell>{item.itemName}</TableCell>
                  <TableCell>{item.category}</TableCell>
                  <TableCell>{supplierMap[item.supplier]?.companyName || "N/A"}</TableCell>
                  <TableCell>{calculateStockStatus(item)}</TableCell>
                  <TableCell>
                    <Input
                      type="number"
                      value={stockChanges[item._id]?.sellOut || 0}
                      onChange={(e) => handleStockChange(item._id, "sellOut", e.target.value)}
                      className="w-20 text-center"
                    />
                  </TableCell>
                  <TableCell>
                    <Input
                      type="number"
                      value={stockChanges[item._id]?.addStock || 0}
                      onChange={(e) => handleStockChange(item._id, "addStock", e.target.value)}
                      className="w-20 text-center"
                    />
                  </TableCell>
                  <TableCell className="font-bold">{calculateTotalStock(item)}</TableCell>
                  <TableCell className="flex justify-center gap-2">
                    <Button size="icon" variant="ghost" onClick={() => handleSaveStockChanges(item)}>
                      <Save size={18} />
                    </Button>
                    <Button size="icon" variant="secondary" onClick={() => setStockInItem(item)}>
                      <ArrowUp size={16} />
                    </Button>
                    <Button size="icon" variant="secondary" onClick={() => setStockOutItem(item)}>
                      <ArrowDown size={16} />
                    </Button>
                    <DeleteItemModal itemName={item.itemName} id={item._id} />
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>

        {/* Collapsible Transaction History */}
        {showTransactions && (
          <div className="mt-8 overflow-x-auto border rounded-lg">
            {transactions.length === 0 ? (
              <div className="text-center p-4">No transactions yet.</div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Date & Time</TableHead>
                    <TableHead>Item Name</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Quantity</TableHead>
                    <TableHead>Supplier</TableHead>
                    <TableHead>Reason</TableHead>
                    <TableHead>Remarks</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {(transactions || []).map((t) => {
                    let dateStr = "N/A";
                    try {
                      dateStr = t.dateTime ? new Date(t.dateTime).toLocaleString() : "N/A";
                    } catch {
                      dateStr = "Invalid Date";
                    }
                    return (
                      <TableRow key={t._id || t.id || Math.random()}>
                        <TableCell>{dateStr}</TableCell>
                        <TableCell>{t.itemName || "N/A"}</TableCell>
                        <TableCell className={t.type === "IN" ? "text-green-600 font-semibold" : "text-red-600 font-semibold"}>
                          {t.type || "N/A"}
                        </TableCell>
                        <TableCell>{t.quantity ?? "N/A"}</TableCell>
                        <TableCell>{t.supplierName || "N/A"}</TableCell>
                        <TableCell>{t.reason || "N/A"}</TableCell>
                        <TableCell>{t.remarks || "N/A"}</TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            )}
          </div>
        )}

      </CardContent>

      {/* Stock IN / OUT Modals */}
      {stockInItem && (
        <StockInModal
          open={!!stockInItem}
          setOpen={() => setStockInItem(null)}
          item={stockInItem}
          suppliers={suppliers}
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
