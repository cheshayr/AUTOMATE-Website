import React, { useEffect, useState } from "react";
import DashboardLayout from "../DashboardLayout";

import LoadingSpinner from "@/components/LoadingSpinner";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import AddItemModal from "./AddItemModal";
import {
  Eye,
  Loader2,
  LoaderCircle,
  MinusCircle,
  PlusCircle,
  Trash2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import AddCategoryModal from "./AddCategoryModal";
import AddStockModal from "./AddStockModal";
import DeductStockModal from "./DeductStockModal";
import DeleteItemModal from "./DeleteItemModal";
import { Label } from "recharts";
import {
  useFetchInventory,
  useFetchItemCategories,
} from "@/hooks/useInventoryQuery";

const StockManagement = () => {
  const [itemCategory, setItemCategory] = useState("All");

  const {
    data: inventoryData,
    isPending: inventoryDataPending,
    error: inventoryDataError,
  } = useFetchInventory({ filter: itemCategory });

  const {
    data: itemCategoriesData,
    isPending: itemCategoriesDataPending,
    error: itemCategoriesDataError,
  } = useFetchItemCategories();

  return (
    // <DashboardLayout>
    <>
      <Card className="w-full bg-transparent shadow-none border-0">
        <CardHeader>
          <CardTitle className="text-2xl font-semibold">
            Inventory Management
          </CardTitle>
          <CardDescription className="line-clamp-3">
            Manage inventory, track all the stocks and parts.
          </CardDescription>
          <CardAction className="flex space-x-4">
            <div className="grid gap-3 min-w-40">
              <Label htmlFor="category">Item Category</Label>
              <Select
                id="category"
                name="category"
                value={itemCategory}
                onValueChange={(newValue) => setItemCategory(newValue)}
              >
                <SelectTrigger className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectItem value="All">All</SelectItem>
                    {itemCategoriesData?.data?.map((category) => (
                      <SelectItem
                        key={category.id}
                        value={category.categoryName}
                      >
                        {category.categoryName}
                      </SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>
            <AddCategoryModal />
            <AddItemModal itemCategories={itemCategoriesData?.data} />
          </CardAction>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[250px]">Item Name</TableHead>
                <TableHead>Category</TableHead> <TableHead>Stock</TableHead>{" "}
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Price</TableHead>
                <TableHead className="text-center">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody className="">
              {inventoryDataPending ? (
                <TableCell colSpan={6} className="h-96 ">
                  <div className="flex items-center justify-center w-full h-full ">
                    <LoadingSpinner />
                  </div>
                </TableCell>
              ) : (
                inventoryData?.data?.map((item) => (
                  <TableRow key={item._id}>
                    <TableCell className="font-medium">
                      {item.itemName}
                    </TableCell>
                    <TableCell>{item.category}</TableCell>
                    <TableCell>{item.stock}</TableCell>{" "}
                    <TableCell>{item.status}</TableCell>{" "}
                    <TableCell className="text-right">{item.price}</TableCell>
                    <TableCell className="flex items-center justify-center space-x-3 p-3">
                      <DeductStockModal id={item._id} />

                      <AddStockModal id={item._id} />

                      <AddItemModal
                        isAdd={false}
                        item={item}
                        itemCategories={itemCategoriesData?.data}
                      />

                      <DeleteItemModal itemName={item.itemName} id={item._id} />
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </>

    // </DashboardLayout>
  );
};

export default StockManagement;
