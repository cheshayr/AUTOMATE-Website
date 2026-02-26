import React, { useState, useMemo } from "react";
import DashboardLayout from "../DashboardLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
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
  CheckCircle,
  XCircle,
  Download,
} from "lucide-react";
import AddUserModal from "./AddUserModal";
import DeleteUserButton from "./DeleteUserButton";
import ReactivateUserButton from "./ReactivateUserButton";
import { useFetchUsers } from "@/hooks/useUsersQuery";
import LoadingSpinner from "@/components/LoadingSpinner";
import { useDebounce } from "@uidotdev/usehooks";

import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

// PDF EXPORT
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { format } from "date-fns";
import logo from "@/assets/logo.png";

const UserManagement = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const debouncedSearchQuery = useDebounce(searchQuery, 500);

  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [selectedRole] = useState("");

  const [preparedBy, setPreparedBy] = useState("");
  const [exportScope, setExportScope] = useState("page");
  

  const {
    data: usersData,
    isPending: usersDataPending,
    error: usersDataError,
  } = useFetchUsers(
    debouncedSearchQuery,
    selectedRole,
    currentPage,
    itemsPerPage,
    statusFilter
  );

  const totalPages = usersData?.totalPages || 1;
  const currentFetchedPage = usersData?.currentPage || 1;
  const totalItems = usersData?.totalItems || 0;
  const users = usersData?.data || [];

  // Fetch all users for export all
  const { data: allUsersData } = useFetchUsers(
    debouncedSearchQuery,
    selectedRole,
    1,
    totalItems || 1,
    statusFilter
  );

  const allUsers = allUsersData?.data || [];

  const handlePageChange = (pageNumber) => {
    if (pageNumber > 0 && pageNumber <= totalPages) {
      setCurrentPage(pageNumber);
    }
  };

  const getPaginationItems = useMemo(() => {
    const pages = [];
    const maxPageButtons = 5;

    if (totalPages <= maxPageButtons) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else {
      let startPage = Math.max(1, currentFetchedPage - 2);
      let endPage = Math.min(totalPages, startPage + 4);

      if (startPage > 1) {
        pages.push(1);
        if (startPage > 2) pages.push("ellipsisStart");
      }

      for (let i = startPage; i <= endPage; i++) pages.push(i);

      if (endPage < totalPages) {
        if (endPage < totalPages - 1) pages.push("ellipsisEnd");
        pages.push(totalPages);
      }
    }
    return pages;
  }, [totalPages, currentFetchedPage]);

  // =============================
  // EXPORT USERS TO PDF
  // =============================
  const handleExportUsersPDF = () => {
    if (!preparedBy.trim()) {
      alert('Please enter "Prepared By" before exporting.');
      return;
    }

    const dataToExport = exportScope === "all" ? allUsers : users;

    if (!dataToExport.length) {
      alert("No users available to export.");
      return;
    }

    const doc = new jsPDF();
    const exportedAt = format(new Date(), "MMM dd, yyyy • hh:mm a");

    // Logo
    doc.addImage(logo, "PNG", 14, 8, 30, 30);

    // Title
    doc.setFontSize(16);
    doc.text("User Management Report", 55, 20);

    doc.setFontSize(10);
    doc.text(`Prepared By: ${preparedBy}`, 14, 45);
    doc.text(`Exported On: ${exportedAt}`, 14, 52);
    doc.text(
      `Export Scope: ${
        exportScope === "all" ? "All Users" : "Current Page"
      }`,
      14,
      59
    );

    const headers = [
      "Name",
      "Email",
      "Mobile Number",
      "Verified",
      "Role",
      "Position",
      "Status",
    ];

    const rows = dataToExport.map((user) => [
      user.name,
      user.email,
      user.mobileNumber,
      user.isVerified ? "Yes" : "No",
      user.role,
      user.position,
      user.isActive ? "Active" : "Deactivated",
    ]);

    autoTable(doc, {
      head: [headers],
      body: rows,
      startY: 65,
      styles: { fontSize: 9 },
      headStyles: { fillColor: [71, 85, 105] },
    });

    doc.save(
      `user_management_${exportScope}_${format(new Date(), "yyyy-MM-dd")}.pdf`
    );
  };

  // =============================
  // FILTER USERS BY STATUS
  // =============================
  const filteredUsers = users.filter((user) => {
    if (statusFilter === "all") return true;
    if (statusFilter === "active") return user.isActive === true;
    if (statusFilter === "inactive") return user.isActive === false;
    return true;
  });

  return (
    <DashboardLayout>
      <Card className="w-full bg-transparent shadow-none border-0">
        <CardHeader>
          <CardTitle className="text-2xl font-semibold">
            User Management
          </CardTitle>
          <CardDescription>
            View, search, add, manage, and export user accounts.
          </CardDescription>
        </CardHeader>

        <CardContent>
          {/* TOP CONTROLS */}
          <div className="flex flex-wrap gap-4 justify-between mb-4">
            <div className="w-full md:w-[40%]">
              <Input
                type="text"
                placeholder="Search by name or email..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>

            <div className="flex flex-wrap gap-2 items-end">
              <Input
                placeholder="Prepared By"
                value={preparedBy}
                onChange={(e) => setPreparedBy(e.target.value)}
                className="w-48"
              />

              {/* Status Filter Dropdown */}
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="h-9 px-3 border rounded-md text-sm bg-background"
              >
                <option value="all">All Users</option>
                <option value="active">Active</option>
                <option value="inactive">Deactivated</option>
              </select>

              <select
                value={exportScope}
                onChange={(e) => setExportScope(e.target.value)}
                className="h-9 px-3 border rounded-md text-sm bg-background"
              >
                <option value="page">Current Page</option>
                <option value="all">All Users</option>
              </select>

              <Button variant="outline" onClick={handleExportUsersPDF}>
                <Download className="h-4 w-4 mr-2" />
                Export PDF
              </Button>

              <AddUserModal isAdd />
            </div>
          </div>

          {/* TABLE */}
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Mobile Number</TableHead>
                <TableHead className="text-center">Verified</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>Position</TableHead>
                <TableHead className="text-center">Actions</TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {usersDataPending ? (
                <TableRow>
                  <TableCell colSpan={7} className="h-96">
                    <div className="flex items-center justify-center h-full">
                      <LoadingSpinner />
                    </div>
                  </TableCell>
                </TableRow>
              ) : usersDataError ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center text-red-500">
                    Error loading users
                  </TableCell>
                </TableRow>
              ) : filteredUsers.length > 0 ? (
                filteredUsers.map((user) => (
                  <TableRow key={user._id}>
                    <TableCell>{user.name}</TableCell>
                    <TableCell>{user.email}</TableCell>
                    <TableCell>{user.mobileNumber}</TableCell>
                    <TableCell className="text-center">
                      {user.isVerified ? (
                        <CheckCircle className="text-green-500 mx-auto" />
                      ) : (
                        <XCircle className="text-red-500 mx-auto" />
                      )}
                    </TableCell>
                    <TableCell>{user.role}</TableCell>
                    <TableCell>{user.position}</TableCell>
                    <TableCell className="flex justify-center gap-2">
                      <AddUserModal user={user} />

                      {!user.isActive ? (
                        <ReactivateUserButton
                          id={user._id}
                          userName={user.name}
                        />
                      ) : (
                        <DeleteUserButton
                          id={user._id}
                          userName={user.name}
                          role={user.role}
                        />
                      )}
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={7} className="text-center text-muted-foreground">
                    No users found.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>

          {/* PAGINATION */}
          {totalItems > 0 && totalPages > 1 && (
            <Pagination className="mt-4">
              <PaginationContent>
                <PaginationItem>
                  <PaginationPrevious
                    onClick={() => handlePageChange(currentFetchedPage - 1)}
                  />
                </PaginationItem>

                {getPaginationItems.map((item, index) => (
                  <PaginationItem key={index}>
                    {item === "ellipsisStart" || item === "ellipsisEnd" ? (
                      <PaginationEllipsis />
                    ) : (
                      <PaginationLink
                        isActive={item === currentFetchedPage}
                        onClick={() => handlePageChange(item)}
                      >
                        {item}
                      </PaginationLink>
                    )}
                  </PaginationItem>
                ))}

                <PaginationItem>
                  <PaginationNext
                    onClick={() => handlePageChange(currentFetchedPage + 1)}
                  />
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          )}
        </CardContent>
      </Card>
    </DashboardLayout>
  );
};

export default UserManagement;