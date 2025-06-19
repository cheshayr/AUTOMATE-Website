import React, { useEffect, useState } from 'react';
import DashboardLayout from '../DashboardLayout';
import '../dashboard/Dashboard.css';
import { useAuthContext } from '../../context/AuthContext';
import LoadingSpinner from '@/components/LoadingSpinner';
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import AddItemModal from './AddItemModal';
import {
  Eye,
  Loader2,
  LoaderCircle,
  MinusCircle,
  PlusCircle,
  Trash2,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import AddCategoryModal from './AddCategoryModal';
import AddStockModal from './AddStockModal';
import DeductStockModal from './DeductStockModal';
import DeleteItemModal from './DeleteItemModal';
import { Label } from 'recharts';
import { useInventoryQuery } from '@/hooks/useInventoryQuery';

const API_URL = 'http://localhost:5000/api/stocks';

const products = [
  {
    id: 'PROD001',
    itemName: 'Ergonomic Office Chair',
    category: 'Furniture',
    stock: 85,
    price: '350.00',
    status: 'In Stock',
    lowStockThreshold: 10, // <-- Added
  },
  {
    id: 'PROD002',
    itemName: 'Standing Desk',
    category: 'Furniture',
    stock: 40,
    price: '499.00',
    status: 'In Stock',
    lowStockThreshold: 10, // <-- Added
  },
  {
    id: 'PROD003',
    itemName: 'Noise-Cancelling Headphones',
    category: 'Electronics',
    stock: 0,
    price: '299.99',
    status: 'Out of Stock',
    lowStockThreshold: 10, // <-- Added
  },
  {
    id: 'PROD004',
    itemName: 'Curved Ultrawide Monitor',
    category: 'Monitors',
    stock: 22,
    price: '899.50',
    status: 'In Stock',
    lowStockThreshold: 10, // <-- Added
  },
  {
    id: 'PROD005',
    itemName: 'Wireless Keyboard & Mouse Combo',
    category: 'Accessories',
    stock: 7,
    price: '99.00',
    status: 'Low Stock',
    lowStockThreshold: 10, // <-- Added
  },
];

const StockManagement = () => {
  const {
    data: inventoryData,
    isPending: inventoryDataPending,
    error: inventoryDataError,
  } = useInventoryQuery();

  return (
    <DashboardLayout>
      <Card className="w-full bg-transparent shadow-none border-0">
        <CardHeader>
          <CardTitle className="text-2xl font-semibold">
            Inventory Management
          </CardTitle>
          <CardDescription className="line-clamp-3">
            Manage inventory, track all the stocks and parts.
          </CardDescription>
          <CardAction className="flex space-x-4">
            <div className="grid gap-3">
              <Label htmlFor="category">Item Category</Label>
              <Select
                // disabled={!isAdd}
                id="category"
                name="category"
                value="All"
                // value={itemDetails.category}
              >
                <SelectTrigger className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectItem value="All">All</SelectItem>
                    <SelectItem value="Furniture">Furniture</SelectItem>
                    <SelectItem value="Electronics">Electronics</SelectItem>
                    <SelectItem value="Monitors">Monitors</SelectItem>
                    <SelectItem value="Accessories">Accessories</SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>
            <AddCategoryModal />
            <AddItemModal />
          </CardAction>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[250px]">Item Name</TableHead>
                <TableHead>Category</TableHead> <TableHead>Stock</TableHead>{' '}
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
                  <TableRow key={item.id}>
                    <TableCell className="font-medium">
                      {item.itemName}
                    </TableCell>
                    <TableCell>{item.category}</TableCell>
                    <TableCell>{item.stock}</TableCell>{' '}
                    <TableCell>{item.status}</TableCell>{' '}
                    <TableCell className="text-right">{item.price}</TableCell>
                    <TableCell className="flex items-center justify-center space-x-3 p-3">
                      <DeductStockModal />

                      <AddStockModal />

                      <AddItemModal isAdd={false} item={item} />

                      <DeleteItemModal itemName={item.itemName} />
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </DashboardLayout>
  );
};

export default StockManagement;
