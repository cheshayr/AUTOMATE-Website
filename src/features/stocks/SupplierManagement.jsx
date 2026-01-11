import React, { useState, useEffect, useMemo } from "react";
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
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Edit,
  Trash2,
  Plus,
  Loader2,
  ArrowUp,
  ArrowDown,
  Search,
} from "lucide-react";
import { toast } from "sonner";
import { useDebounce } from "@uidotdev/usehooks";

import AddSupplierModal from "./AddSupplierModal";
import EditSupplierModal from "./EditSupplierModal";
import { useFetchSuppliers } from "@/hooks/useSupplierQuery";
import { useDeleteSupplier } from "@/hooks/useSupplierMutation";
import LoadingSpinner from "@/components/LoadingSpinner";

const ITEMS_PER_PAGE = 8;
const SORTABLE_COLUMNS = ["companyName", "contactPerson", "email"];

const SuppliersManagement = () => {
  const { data: suppliersData, isPending: fetchingSuppliers } =
    useFetchSuppliers();
  const { mutateAsync: deleteSupplier, isPending: deleting } =
    useDeleteSupplier();

  const [suppliers, setSuppliers] = useState([]);
  const [searchInput, setSearchInput] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  const [sortConfig, setSortConfig] = useState({
    key: "companyName",
    direction: "asc",
  });

  const debouncedSearchQuery = useDebounce(searchQuery, 400);

  // Sync API data
  useEffect(() => {
    if (Array.isArray(suppliersData?.data)) {
      setSuppliers(suppliersData.data);
    } else {
      setSuppliers([]);
    }
  }, [suppliersData]);

  // SEARCH FILTER
  const filteredSuppliers = useMemo(() => {
    if (!debouncedSearchQuery) return suppliers;

    const query = debouncedSearchQuery.toLowerCase();

    return suppliers.filter((s) =>
      [
        s.companyName,
        s.contactPerson,
        s.email,
        s.contactNumber,
        s.address,
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase()
        .includes(query)
    );
  }, [suppliers, debouncedSearchQuery]);

  // SORT
  const sortedSuppliers = useMemo(() => {
    if (!SORTABLE_COLUMNS.includes(sortConfig.key)) return filteredSuppliers;

    return [...filteredSuppliers].sort((a, b) => {
      const aVal = (a[sortConfig.key] || "").toLowerCase();
      const bVal = (b[sortConfig.key] || "").toLowerCase();

      if (aVal < bVal) return sortConfig.direction === "asc" ? -1 : 1;
      if (aVal > bVal) return sortConfig.direction === "asc" ? 1 : -1;
      return 0;
    });
  }, [filteredSuppliers, sortConfig]);

  // PAGINATION
  const totalPages = Math.max(
    1,
    Math.ceil(sortedSuppliers.length / ITEMS_PER_PAGE)
  );

  const paginatedSuppliers = useMemo(() => {
    const start = (currentPage - 1) * ITEMS_PER_PAGE;
    return sortedSuppliers.slice(start, start + ITEMS_PER_PAGE);
  }, [sortedSuppliers, currentPage]);

  useEffect(() => {
    setCurrentPage(1);
  }, [debouncedSearchQuery, sortConfig]);

  const handleSort = (key) => {
    if (!SORTABLE_COLUMNS.includes(key)) return;

    setSortConfig((prev) => ({
      key,
      direction:
        prev.key === key && prev.direction === "asc" ? "desc" : "asc",
    }));
  };

  // SEARCH BUTTON → EMPTY = SHOW ALL
  const handleSearch = () => {
    setSearchQuery(searchInput.trim());
    setCurrentPage(1);
  };

  const handleDelete = async (id) => {
    if (deleting) return;
    if (!confirm("Are you sure you want to delete this supplier?")) return;

    try {
      await deleteSupplier(id);
      setSuppliers((prev) => prev.filter((s) => s._id !== id));
      toast.success("Supplier deleted successfully!");
    } catch {
      toast.error("Failed to delete supplier.");
    }
  };

  const handleSupplierUpdate = (updatedSupplier) => {
    if (!updatedSupplier?._id) return;

    setSuppliers((prev) =>
      prev.map((s) =>
        s._id === updatedSupplier._id ? updatedSupplier : s
      )
    );
  };

  const SortIcon = ({ column }) =>
    sortConfig.key === column ? (
      sortConfig.direction === "asc" ? (
        <ArrowUp className="inline h-3 w-3 ml-1" />
      ) : (
        <ArrowDown className="inline h-3 w-3 ml-1" />
      )
    ) : null;

  return (
    <Card className="w-full bg-transparent shadow-none border-0">
      <CardHeader>
        <CardTitle className="text-2xl font-semibold">Suppliers</CardTitle>
        <CardDescription>View, edit, or delete suppliers</CardDescription>
      </CardHeader>

      <CardContent>
        {/* TOOLBAR */}
        <div className="mb-6">
          <div className="flex flex-col lg:flex-row gap-3 items-stretch max-w-4xl">
            <Input
              placeholder="Search suppliers..."
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSearch()}
              className="h-10 flex-1"
            />

            <Button onClick={handleSearch} className="h-10 px-4 flex gap-2">
              <Search className="h-4 w-4" />
              Search
            </Button>

            <AddSupplierModal>
              <Button className="h-10 px-4 flex gap-2">
                <Plus className="h-4 w-4" />
                Add Supplier
              </Button>
            </AddSupplierModal>
          </div>
        </div>

        {/* TABLE */}
        <div className="border rounded-md bg-white overflow-hidden">
          <Table>
            <TableHeader className="bg-slate-50">
              <TableRow>
                <TableHead
                  onClick={() => handleSort("companyName")}
                  className="cursor-pointer"
                >
                  Company Name <SortIcon column="companyName" />
                </TableHead>
                <TableHead
                  onClick={() => handleSort("contactPerson")}
                  className="cursor-pointer"
                >
                  Contact Person <SortIcon column="contactPerson" />
                </TableHead>
                <TableHead
                  onClick={() => handleSort("email")}
                  className="cursor-pointer"
                >
                  Email <SortIcon column="email" />
                </TableHead>
                <TableHead>Contact Number</TableHead>
                <TableHead>Address</TableHead>
                <TableHead className="text-center">Actions</TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {fetchingSuppliers ? (
                <TableRow>
                  <TableCell colSpan={6} className="py-16 text-center">
                    <LoadingSpinner />
                  </TableCell>
                </TableRow>
              ) : paginatedSuppliers.length > 0 ? (
                paginatedSuppliers.map((supplier) => (
                  <TableRow key={supplier._id}>
                    <TableCell className="font-medium">
                      {supplier.companyName || "N/A"}
                    </TableCell>
                    <TableCell>{supplier.contactPerson || "N/A"}</TableCell>
                    <TableCell>{supplier.email || "N/A"}</TableCell>
                    <TableCell>{supplier.contactNumber || "N/A"}</TableCell>
                    <TableCell>{supplier.address || "N/A"}</TableCell>
                    <TableCell className="text-center space-x-1">
                      <EditSupplierModal
                        supplier={supplier}
                        onSupplierUpdated={handleSupplierUpdate}
                      >
                        <Button size="icon" variant="ghost">
                          <Edit className="h-4 w-4" />
                        </Button>
                      </EditSupplierModal>

                      <Button
                        size="icon"
                        variant="destructive"
                        onClick={() => handleDelete(supplier._id)}
                        disabled={deleting}
                      >
                        {deleting ? (
                          <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                          <Trash2 className="h-4 w-4" />
                        )}
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell
                    colSpan={6}
                    className="py-16 text-center text-muted-foreground"
                  >
                    No suppliers found.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>

        {/* PAGINATION */}
        {totalPages > 1 && (
          <div className="flex justify-end items-center gap-3 mt-6">
            <Button
              variant="outline"
              size="sm"
              disabled={currentPage === 1}
              onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
            >
              Previous
            </Button>

            <span className="text-sm text-muted-foreground">
              Page {currentPage} of {totalPages}
            </span>

            <Button
              variant="outline"
              size="sm"
              disabled={currentPage === totalPages}
              onClick={() =>
                setCurrentPage((p) => Math.min(p + 1, totalPages))
              }
            >
              Next
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default SuppliersManagement;
