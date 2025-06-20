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
  CardAction,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  UserPlus,
  Edit,
  Trash2,
  CheckCircle,
  XCircle,
  ShieldX,
  ShieldCheck,
} from "lucide-react";
import AddUserModal from "./AddUserModal";
import AddItemModal from "../stocks/AddItemModal";
import { useFetchUsers } from "@/hooks/useUsersQuery";
import LoadingSpinner from "@/components/LoadingSpinner";
import ManageUserStatus from "./MangeUserStatus";

// --- Mock Data (Replace with API call) ---

// --- User Management Component ---
const UserManagement = () => {
  const {
    data: usersData,
    isPending: usersDataPending,
    error: usersDataError,
  } = useFetchUsers();

  return (
    <>
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
                className="w-full"
              />
            </div>
            {/* Replace with your Add User Modal Trigger */}
            <AddUserModal isAdd={true} />
          </CardAction>
        </CardHeader>
        <CardContent>
          <Table>
            {/* <TableCaption>A list of all users in the system.</TableCaption> */}
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
                <TableCell colSpan={6} className="h-96 ">
                  <div className="flex items-center justify-center w-full h-full ">
                    <LoadingSpinner />
                  </div>
                </TableCell>
              ) : (
                usersData?.data?.map((user) => (
                  <TableRow
                    key={user._id}
                    className={!user.isActive ? "bg-red-50/50" : ""}
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
                    <TableCell className="text-center">
                      {user.isActive ? (
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

                      <AddUserModal user={user} />
                      <ManageUserStatus
                        userName={user.name}
                        id={user._id}
                        isActive={user.isActive}
                      />
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </>
  );
};

export default UserManagement;
