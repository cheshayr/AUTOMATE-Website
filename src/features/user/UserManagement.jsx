import React, { useState, useMemo } from "react";
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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
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
  const [selectedRole, setSelectedRole] = useState("all");
  const debouncedSearchQuery = useDebounce(searchQuery, 500);

  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);

  React.useEffect(() => {
    setCurrentPage(1);
  }, [debouncedSearchQuery, selectedRole, statusFilter]);

  const [preparedBy, setPreparedBy] = useState("");
  const [exportScope, setExportScope] = useState("page");
  

  const {
    data: usersData,
    isPending: usersDataPending,
    error: usersDataError,
  } = useFetchUsers(
    debouncedSearchQuery,
    selectedRole === "all" ? "" : selectedRole,
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
    selectedRole === "all" ? "" : selectedRole,
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
  const COMPANY_NAME = "Tierodman Auto Center";

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

  autoTable(doc, {
    head: [[
      "Name",
      "Email",
      "Mobile Number",
      "Verified",
      "Role",
      "Position",
      "Status",
    ]],

    body: dataToExport.map((user) => [
      user.name || "-",
      user.email || "-",
      user.mobileNumber || "-",
      user.isVerified ? "Yes" : "No",
      user.role || "-",
      user.position || "-",
      user.isActive ? "Active" : "Deactivated",
    ]),

    startY: 70,
    styles: { fontSize: 9 },
    headStyles: { fillColor: [71, 85, 105] },

    didDrawPage: function () {
      const pageHeight = doc.internal.pageSize.height;
      const pageWidth = doc.internal.pageSize.width;
      const pageNumber = doc.internal.getCurrentPageInfo().pageNumber;
      const pageCount = doc.internal.getNumberOfPages();

      // ================= HEADER (ONLY FIRST PAGE) =================
      if (pageNumber === 1) {
        doc.addImage(logo, "PNG", 14, 10, 20, 20);

        doc.setFontSize(16);
        doc.text("User Management Report", pageWidth / 2, 20, {
          align: "center",
        });

        doc.setFontSize(10);
        doc.text(COMPANY_NAME, pageWidth / 2, 26, {
          align: "center",
        });

        doc.text(`Prepared By: ${preparedBy}`, 14, 40);
        doc.text(`Exported: ${exportedAt}`, 14, 46);
        doc.text(
          `Scope: ${
            exportScope === "all" ? "All Users" : "Current Page"
          }`,
          14,
          52
        );

        doc.setLineWidth(0.3);
        doc.line(14, 58, pageWidth - 14, 58);
      }

      // ================= FOOTER (PROFESSIONAL ALIGNMENT) =================
      doc.setLineWidth(0.3);
      doc.line(14, pageHeight - 15, pageWidth - 14, pageHeight - 15);

      doc.setFontSize(9);

      // LEFT: Company name
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
    <Card className="w-full bg-transparent shadow-none border-0">
      <CardHeader className="px-0">
        <CardTitle className="text-2xl font-bold">User Management</CardTitle>
        <CardDescription>View, search, add, manage, and export user accounts.</CardDescription>
      </CardHeader>

      <CardContent className="px-0">
          {/* Search and Controls */}
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <Input
              type="text"
              placeholder="Search by name or email..."
              value={searchQuery}
              onChange={(e) => {
              setSearchQuery(e.target.value);
              setCurrentPage(1);
            }}
              className="flex-1"
            />
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap gap-3 mb-8 items-end">
            <Input
              placeholder="Prepared By"
              value={preparedBy}
              onChange={(e) => setPreparedBy(e.target.value)}
              className="h-9 w-[200px]"
            />

            {/* Status Filter Dropdown */}
            <Select
              value={statusFilter}
              onValueChange={(value) => {
                setStatusFilter(value);
                setCurrentPage(1);
              }}
            >
              <SelectTrigger className="h-9 w-[160px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Users</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="inactive">Deactivated</SelectItem>
              </SelectContent>
            </Select>

            {/* Role Filter Dropdown */}
            <Select
              value={selectedRole}
              onValueChange={(value) => {
                setSelectedRole(value);
                setCurrentPage(1);
              }}
            >
              <SelectTrigger className="h-9 w-[160px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Roles</SelectItem>
                <SelectItem value="admin">Admin</SelectItem>
                <SelectItem value="staff">Staff</SelectItem>
                <SelectItem value="user">User</SelectItem>
              </SelectContent>
            </Select>

            <Select value={exportScope} onValueChange={setExportScope}>
              <SelectTrigger className="h-9 w-[160px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="page">Current Page</SelectItem>
                <SelectItem value="all">All Users</SelectItem>
              </SelectContent>
            </Select>

            <Button variant="outline" onClick={handleExportUsersPDF} className="h-9 px-4">
              <Download className="h-4 w-4 mr-2" />
              Export PDF
            </Button>

            <AddUserModal isAdd />
          </div>

          {/* TABLE */}
          <div className="border rounded-lg bg-white overflow-hidden shadow-sm">
            <Table>
              <TableHeader className="bg-slate-50">
                <TableRow>
                  <TableHead className="font-bold">Name</TableHead>
                  <TableHead className="font-bold">Email</TableHead>
                  <TableHead className="font-bold">Mobile Number</TableHead>
                  <TableHead className="text-center font-bold">Verified</TableHead>
                  <TableHead className="font-bold">Role</TableHead>
                  <TableHead className="font-bold">Position</TableHead>
                  <TableHead className="text-center font-bold">Actions</TableHead>
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
                  <TableRow key={user._id} className="hover:bg-slate-50/50">
                    <TableCell className="font-semibold text-slate-900">{user.name}</TableCell>
                    <TableCell className="text-slate-600">{user.email}</TableCell>
                    <TableCell className="text-slate-600">{user.mobileNumber}</TableCell>
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
          </div>

          {/* PAGINATION */}
          {totalItems > 0 && totalPages > 1 && (
            <Pagination className="mt-6">
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
  );
};

export default UserManagement;