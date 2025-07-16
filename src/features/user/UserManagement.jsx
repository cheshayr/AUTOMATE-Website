import React, { useState, useMemo } from 'react';
import DashboardLayout from '../DashboardLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'; // Removed CardAction as it's not a standard Shadcn export here
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'; // Removed TableCaption as it's not used
import { UserPlus, Edit, Trash2, CheckCircle, XCircle, ShieldX, ShieldCheck } from 'lucide-react'; // Ensure these are used or remove unused imports
import AddUserModal from './AddUserModal';
// import AddItemModal from '../stocks/AddItemModal'; // This seems unused, consider removing
import { useFetchUsers } from '@/hooks/useUsersQuery';
import LoadingSpinner from '@/components/LoadingSpinner';
import ManageUserStatus from './MangeUserStatus';
import { useDebounce } from '@uidotdev/usehooks';

// Import Pagination components from shadcn/ui
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination';

// --- User Management Component ---
const UserManagement = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const debouncedSearchQuery = useDebounce(searchQuery, 500);

  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10); // Default items per page, matches your backend's default limit

  // Assuming you might add a role filter later, but for now passing empty string
  const [selectedRole, setSelectedRole] = useState(''); // New state for role filter if needed

  // Pass pagination parameters and current role filter to your fetch hook
  const {
    data: usersData, // This will be the entire response object: {status, results, totalPages, currentPage, totalItems, data: [...]}
    isPending: usersDataPending,
    error: usersDataError,
  } = useFetchUsers(debouncedSearchQuery, selectedRole, currentPage, itemsPerPage);

  // Extract pagination metadata from the fetched data
  const totalPages = usersData?.totalPages || 1;
  const currentFetchedPage = usersData?.currentPage || 1; // Use this for displaying current page
  const totalItems = usersData?.totalItems || 0;
  const users = usersData?.data || []; // The actual array of users

  // Function to handle page change
  const handlePageChange = (pageNumber) => {
    if (pageNumber > 0 && pageNumber <= totalPages) {
      setCurrentPage(pageNumber);
    }
  };

  // Helper to generate page numbers for pagination control (similar to previous explanation)
  const getPaginationItems = useMemo(() => {
    const pages = [];
    const maxPageButtons = 5; // Max number of page buttons to show

    if (totalPages <= maxPageButtons) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      let startPage = Math.max(1, currentFetchedPage - Math.floor(maxPageButtons / 2));
      let endPage = Math.min(totalPages, startPage + maxPageButtons - 1);

      if (endPage - startPage + 1 < maxPageButtons) {
        startPage = Math.max(1, endPage - maxPageButtons + 1);
      }

      if (startPage > 1) {
        pages.push(1);
        if (startPage > 2) {
          pages.push('ellipsisStart');
        }
      }

      for (let i = startPage; i <= endPage; i++) {
        pages.push(i);
      }

      if (endPage < totalPages) {
        if (endPage < totalPages - 1) {
          pages.push('ellipsisEnd');
        }
        pages.push(totalPages);
      }
    }
    return pages;
  }, [totalPages, currentFetchedPage]); // Depend on totalPages and the actual fetched page

  return (
    <>
      <Card className="w-full bg-transparent shadow-none border-0">
        <CardHeader>
          <CardTitle className="text-2xl font-semibold">User Management</CardTitle>
          <CardDescription>View, search, add, and manage user accounts and permissions.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex mb-4 justify-between">
            <div className="w-[50%]">
              <Input
                type="text"
                placeholder="Search by name or email..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full"
              />
            </div>
            {/* You might want a select/dropdown here for role filtering later */}
            <AddUserModal isAdd={true} />
          </div>

          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Mobile Number</TableHead>
                <TableHead className="text-center">Verified</TableHead>
                <TableHead className="text-center">Status</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>Position</TableHead>
                <TableHead className="text-center">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {usersDataPending ? (
                <TableRow>
                  <TableCell colSpan={8} className="h-96">
                    <div className="flex items-center justify-center w-full h-full">
                      <LoadingSpinner />
                    </div>
                  </TableCell>
                </TableRow>
              ) : usersDataError ? (
                <TableRow>
                  <TableCell colSpan={8} className="h-24 text-center text-red-500">
                    Error loading users: {usersDataError.message}
                  </TableCell>
                </TableRow>
              ) : users.length > 0 ? (
                users.map((user) => (
                  <TableRow key={user._id} className={!user.isActive ? 'bg-red-50/50' : ''}>
                    <TableCell className="font-medium">{user.name}</TableCell>
                    <TableCell>{user.email}</TableCell>
                    <TableCell>{user.mobileNumber}</TableCell>
                    <TableCell className="text-center">
                      {user.isVerified ? (
                        <CheckCircle size={20} className="text-green-500 mx-auto" />
                      ) : (
                        <XCircle size={20} className="text-red-500 mx-auto" />
                      )}
                    </TableCell>
                    <TableCell className="text-center">
                      {user.isActive ? (
                        <CheckCircle size={20} className="text-green-500 mx-auto" />
                      ) : (
                        <XCircle size={20} className="text-red-500 mx-auto" />
                      )}
                    </TableCell>
                    <TableCell>{user.role}</TableCell>
                    <TableCell>{user.position}</TableCell>
                    <TableCell className="flex items-center justify-center space-x-2 p-3">
                      <AddUserModal user={user} />
                      <ManageUserStatus userName={user.name} id={user._id} isActive={user.isActive} />
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={8} className="h-24 text-center text-gray-500">
                    No users found.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>

          {/* Pagination Controls */}
          {totalItems > 0 &&
            totalPages > 1 && ( // Only show pagination if there are items and more than 1 page
              <Pagination className="mt-4">
                <PaginationContent>
                  <PaginationItem>
                    <PaginationPrevious
                      href="#"
                      onClick={() => handlePageChange(currentFetchedPage - 1)}
                      aria-disabled={currentFetchedPage === 1}
                      className={currentFetchedPage === 1 ? 'pointer-events-none opacity-50' : ''}
                    />
                  </PaginationItem>
                  {getPaginationItems.map((item, index) => (
                    <PaginationItem key={index}>
                      {item === 'ellipsisStart' || item === 'ellipsisEnd' ? (
                        <PaginationEllipsis />
                      ) : (
                        <PaginationLink
                          href="#"
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
                      href="#"
                      onClick={() => handlePageChange(currentFetchedPage + 1)}
                      aria-disabled={currentFetchedPage === totalPages}
                      className={currentFetchedPage === totalPages ? 'pointer-events-none opacity-50' : ''}
                    />
                  </PaginationItem>
                </PaginationContent>
              </Pagination>
            )}
        </CardContent>
      </Card>
    </>
  );
};

export default UserManagement;
