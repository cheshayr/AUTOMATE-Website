import React, { useState, useMemo } from 'react';
import DashboardLayout from '../DashboardLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardAction,
} from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  UserPlus,
  Edit,
  Trash2,
  CheckCircle,
  XCircle,
  ShieldX,
  ShieldCheck,
} from 'lucide-react';
import AddUserModal from './AddUserModal';
import AddItemModal from '../stocks/AddItemModal';

// --- Mock Data (Replace with API call) ---
const usersData = [
  {
    id: 'USR001',
    name: 'John Doe',
    email: 'john.doe@example.com',
    mobileNumber: '+1 123 456 7890',
    isVerified: true,
    isActive: true,
    role: 'Admin',
    position: 'Office Staff',
  },
  {
    id: 'USR002',
    name: 'Jane Smith',
    email: 'jane.smith@example.com',
    mobileNumber: '+1 987 654 3210',
    isVerified: false,
    isActive: true,
    role: 'User',
    position: 'Mechanic',
  },
  {
    id: 'USR003',
    name: 'Michael Johnson',
    email: 'michael.j@example.com',
    mobileNumber: '+44 20 7946 0958',
    isVerified: true,
    isActive: false,
    role: 'User',
    position: 'Driver',
  },
  {
    id: 'USR004',
    name: 'Emily Davis',
    email: 'emily.davis@example.com',
    mobileNumber: '+61 2 9876 5432',
    isVerified: true,
    isActive: true,
    role: 'Editor',
    position: 'Guard',
  },
  {
    id: 'USR005',
    name: 'David Wilson',
    email: 'd.wilson@example.com',
    mobileNumber: '+1 415 555 2671',
    isVerified: false,
    isActive: false,
    role: 'User',
    position: 'Helper',
  },
];

// --- User Management Component ---
const UserManagement = () => {
  const [users, setUsers] = useState(usersData);
  const [searchQuery, setSearchQuery] = useState('');

  // Memoized filtering to avoid re-calculating on every render
  const filteredUsers = useMemo(() => {
    if (!searchQuery) {
      return users;
    }
    return users.filter(
      (user) =>
        user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        user.email.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [users, searchQuery]);

  // Handler for search input changes
  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value);
  };

  // Placeholder functions for actions
  const handleDeactivate = (userId) => {
    setUsers(
      users.map((user) =>
        user.id === userId ? { ...user, isActive: false } : user
      )
    );
    console.log(`Deactivating user: ${userId}`);
  };

  const handleReactivate = (userId) => {
    setUsers(
      users.map((user) =>
        user.id === userId ? { ...user, isActive: true } : user
      )
    );
    console.log(`Reactivating user: ${userId}`);
  };

  return (
    <DashboardLayout>
      <Card className="w-full bg-transparent shadow-none border-0">
        <CardHeader>
          <CardTitle className="text-2xl font-semibold">
            User Management
          </CardTitle>
          <CardDescription>
            View, search, add, and manage user accounts and permissions.
          </CardDescription>
          <CardAction className="flex flex-col sm:flex-row justify-between items-center space-y-2 sm:space-y-0 sm:space-x-4 pt-2">
            <div className="w-full">
              <Input
                type="text"
                placeholder="Search by name or email..."
                value={searchQuery}
                onChange={handleSearchChange}
                className="w-full"
              />
            </div>
            {/* Replace with your Add User Modal Trigger */}
            <AddUserModal />
          </CardAction>
        </CardHeader>
        <CardContent>
          <Table>
            <TableCaption>A list of all users in the system.</TableCaption>
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
              {filteredUsers.map((user) => (
                <TableRow
                  key={user.id}
                  className={!user.isActive ? 'bg-red-50/50' : ''}
                >
                  <TableCell className="font-medium">{user.name}</TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>{user.mobileNumber}</TableCell>
                  <TableCell className="text-center">
                    {user.isVerified ? (
                      <CheckCircle
                        size={20}
                        className="text-green-500 mx-auto"
                      />
                    ) : (
                      <XCircle size={20} className="text-red-500 mx-auto" />
                    )}
                  </TableCell>
                  <TableCell>{user.role}</TableCell>
                  <TableCell>{user.position}</TableCell>
                  <TableCell className="flex items-center justify-center space-x-2 p-3">
                    {/* Replace with your Edit User Modal Trigger */}

                    <AddUserModal isAdd={false} user={user} />
                    {user.isActive ? (
                      <Button
                        variant="outline"
                        size="icon"
                        className="text-red-600 hover:text-red-700"
                        onClick={() => handleDeactivate(user.id)}
                      >
                        <ShieldX size={18} />
                      </Button>
                    ) : (
                      <Button
                        variant="outline"
                        size="icon"
                        className="text-green-600 hover:text-green-700"
                        onClick={() => handleReactivate(user.id)}
                      >
                        <ShieldCheck size={18} />
                      </Button>
                    )}
                  </TableCell>
                </TableRow>
              ))}
              {filteredUsers.length === 0 && (
                <TableRow>
                  <TableCell
                    colSpan={7}
                    className="text-center text-gray-400 py-6"
                  >
                    No users found.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </DashboardLayout>
  );
};

export default UserManagement;
