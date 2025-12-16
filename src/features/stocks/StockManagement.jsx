import React, { useEffect, useState } from 'react';
import DashboardLayout from '../DashboardLayout';
import LoadingSpinner from '@/components/LoadingSpinner';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import AddItemModal from './AddItemModal';
import { Save, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import AddCategoryModal from './AddCategoryModal';
import DeleteItemModal from './DeleteItemModal';
import DeleteCategoryModal from './DeleteCategoryModal';
import { Label } from '@/components/ui/label';
import { useFetchInventory, useFetchItemCategories } from '@/hooks/useInventoryQuery';
import { useDebounce } from '@uidotdev/usehooks';
import { Input } from '@/components/ui/input';
import { useUpdateItem } from '@/hooks/useInventoryMutation';
import { toast } from 'sonner';

const StockManagement = () => {
  const [itemCategory, setItemCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [stockChanges, setStockChanges] = useState({});
  const debouncedSearchQuery = useDebounce(searchQuery, 500);

  const { data: inventoryData, isPending: inventoryDataPending } = useFetchInventory({
    filter: itemCategory,
    searchQuery: debouncedSearchQuery,
  });

  const { data: itemCategoriesData } = useFetchItemCategories();

  const { mutateAsync: updateItemMutation, isPending: updateItemMutationPending } =
    useUpdateItem();

  // Initialize stockChanges
  useEffect(() => {
    if (inventoryData?.data) {
      const initialChanges = inventoryData.data.reduce((acc, item) => {
        acc[item._id] = {
          sellOut: 0,
          addStock: 0,
          isModified: false,
        };
        return acc;
      }, {});
      setStockChanges(initialChanges);
    }
  }, [inventoryData?.data]);

  const handleStockChange = (id, field, value) => {
    const numericValue = Math.max(0, Number(value));
    setStockChanges((prev) => ({
      ...prev,
      [id]: {
        ...prev[id],
        [field]: numericValue,
        isModified: true,
      },
    }));
  };

  const calculateTotalStock = (item) => {
    const changes = stockChanges[item._id] || { sellOut: 0, addStock: 0 };
    const initialStock = Number(item.stock) || 0;
    return initialStock - changes.sellOut + changes.addStock;
  };

  const calculateStockStatus = (item) => {
    const totalStock = calculateTotalStock(item);
    const threshold = Number(item.lowStockThreshold) || 0;

    if (totalStock <= 0)
      return <span className="text-red-600 font-semibold">Out of Stock</span>;
    if (totalStock <= threshold)
      return <span className="text-yellow-600 font-semibold">Low Stock</span>;
    return <span className="text-green-600 font-semibold">In Stock</span>;
  };

  const handleSaveStockChanges = async (item) => {
    const totalStock = calculateTotalStock(item);

    if (totalStock < 0) {
      toast.error('Cannot save changes: Total stock cannot be negative.');
      return;
    }

    try {
      await updateItemMutation({
        _id: item._id,
        stock: totalStock,
        itemName: item.itemName,
        category: item.category,
        lowStockThreshold: item.lowStockThreshold,
        price: item.price || 0,
      });

      setStockChanges((prev) => ({
        ...prev,
        [item._id]: {
          sellOut: 0,
          addStock: 0,
          isModified: false,
        },
      }));

      toast.success('Stock updated successfully!');
    } catch (error) {
      console.error('Failed to commit stock changes:', error);
      toast.error('Failed to update stock. Please try again.');
    }
  };

  return (
    <Card className="w-full bg-transparent shadow-none border-0">
      <CardHeader>
        <CardTitle className="text-2xl font-semibold">Inventory Management</CardTitle>
        <CardDescription>Manage inventory, track all the stocks and parts.</CardDescription>
      </CardHeader>

      <CardContent>
        <div className="flex mb-4 justify-between">
          <div className="w-[50%]">
            <Input
              type="text"
              placeholder="Search by item name..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          <div className="space-x-4 flex">
            <div className="grid gap-3 min-w-36">
              <Label htmlFor="category">Item Category</Label>
              <Select
                id="category"
                value={itemCategory}
                onValueChange={setItemCategory}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectItem value="All">All</SelectItem>
                    {itemCategoriesData?.data?.map((category) => (
                      <SelectItem key={category.id} value={category.categoryName}>
                        {category.categoryName}
                      </SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>

            <AddCategoryModal />
            <DeleteCategoryModal itemCategories={itemCategoriesData?.data} />
            <AddItemModal itemCategories={itemCategoriesData?.data} />
          </div>
        </div>

        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[250px]">Item Name</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>Stock Status</TableHead>
              <TableHead>Sell Out</TableHead>
              <TableHead>Add Stock</TableHead>
              <TableHead>Total Stock</TableHead>
              <TableHead className="text-center">Actions</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {inventoryDataPending ? (
              <TableRow>
                <TableCell colSpan={7} className="h-96 text-center">
                  <LoadingSpinner />
                </TableCell>
              </TableRow>
            ) : (
              inventoryData?.data?.map((item) => (
                <TableRow key={item._id}>
                  <TableCell className="font-medium">{item.itemName}</TableCell>
                  <TableCell>{item.category}</TableCell>
                  <TableCell>{calculateStockStatus(item)}</TableCell>

                  <TableCell>
                    <Input
                      type="number"
                      min="0"
                      value={stockChanges[item._id]?.sellOut || 0}
                      onChange={(e) =>
                        handleStockChange(item._id, 'sellOut', e.target.value)
                      }
                      className="w-24 text-center"
                    />
                  </TableCell>

                  <TableCell>
                    <Input
                      type="number"
                      min="0"
                      value={stockChanges[item._id]?.addStock || 0}
                      onChange={(e) =>
                        handleStockChange(item._id, 'addStock', e.target.value)
                      }
                      className="w-24 text-center"
                    />
                  </TableCell>

                  <TableCell className="font-bold">
                    {calculateTotalStock(item)}
                  </TableCell>

                  <TableCell className="flex justify-center space-x-3">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleSaveStockChanges(item)}
                      disabled={
                        !stockChanges[item._id]?.isModified ||
                        updateItemMutationPending
                      }
                    >
                      {updateItemMutationPending ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        <Save size={18} />
                      )}
                    </Button>

                    <DeleteItemModal
                      itemName={item.itemName}
                      id={item._id}
                    />
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};

export default StockManagement;
