import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useEffect, useState } from "react";
import { Eye, EyeIcon, EyeOffIcon, Plus } from "lucide-react";
import { useAddUser } from "@/hooks/useUsersMutation";
import LoadingSpinner from "@/components/LoadingSpinner";

function AddUser({ isAdd = false, user = {} }) {
  const [userDetails, setUserDetails] = useState(user);
  const [isOpen, setIsOpen] = useState(false);

  const {
    mutateAsync: addUserMutation,
    isPending: addUserMutationPending,
    isError: addUserMutationError,
    isSuccess: addUserMutationSuccess,
    reset: resetAddUserMutation,
  } = useAddUser();

  useEffect(() => {
    if (addUserMutationSuccess) {
      setIsOpen(false);
    }

    if (isAdd) {
      setUserDetails({
        name: "",
        email: "",
        mobileNumber: "",
        password: "",
        role: "staff",
        position: "Office Staff", // Default remains valid
      });
    }

    resetAddUserMutation();
  }, [addUserMutationSuccess, isOpen, isAdd]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    await addUserMutation(userDetails);
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        {isAdd ? (
          <Button>
            <Plus className="mr-2 h-4 w-4" /> Add User
          </Button>
        ) : (
          <Button
            variant="outline"
            className="text-blue-600 hover:text-blue-700"
            size="icon"
          >
            <Eye size={18} />
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{isAdd ? "Add User" : "User Info"}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 mb-4">
            <div className="grid gap-3">
              <Label htmlFor="name">Name</Label>
              <Input
                onChange={(e) =>
                  setUserDetails({ ...userDetails, name: e.target.value })
                }
                id="name"
                name="name"
                placeholder="Name"
                value={userDetails.name || ""}
              />
            </div>
            <div className="grid gap-3">
              <Label htmlFor="email">Email</Label>
              <Input
                onChange={(e) =>
                  setUserDetails({ ...userDetails, email: e.target.value })
                }
                id="email"
                name="email"
                placeholder="Email"
                value={userDetails.email || ""}
              />
            </div>
            <div className="grid gap-3">
              <Label htmlFor="number">Mobile Number</Label>
              <Input
                onChange={(e) =>
                  setUserDetails({
                    ...userDetails,
                    mobileNumber: e.target.value,
                  })
                }
                id="number"
                name="number"
                placeholder="Number"
                value={userDetails.mobileNumber || ""}
              />
            </div>
            <div className="grid gap-3">
              <Label htmlFor="role">Role</Label>
              <Select
                disabled
                value={userDetails.role}
                onValueChange={(newValue) =>
                  setUserDetails({ ...userDetails, role: newValue })
                }
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select a role" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectItem value="user">User</SelectItem>
                    <SelectItem value="staff">Staff</SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-3">
              <Label htmlFor="position">Position</Label>
              <Select
                id="position"
                name="position"
                value={userDetails.position}
                disabled={!isAdd}
                onValueChange={(newValue) =>
                  setUserDetails({ ...userDetails, position: newValue })
                }
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select a position" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    {/* Only Office Staff and Mechanic kept */}
                    <SelectItem value="Office Staff">Office Staff</SelectItem>
                    <SelectItem value="Mechanic">Mechanic</SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>
            {isAdd && (
              <div className="grid gap-3">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  value={userDetails.password || ""}
                  autoComplete="new-password"
                  onChange={(e) =>
                    setUserDetails({
                      ...userDetails,
                      password: e.target.value,
                    })
                  }
                />
              </div>
            )}
          </div>
          <DialogFooter>
            {isAdd && (
              <>
                <DialogClose asChild>
                  <Button variant="outline">Cancel</Button>
                </DialogClose>
                <Button type="submit" disabled={addUserMutationPending}>
                  {addUserMutationPending ? (
                    <span className="flex items-center gap-2">
                      <LoadingSpinner />
                      Saving
                    </span>
                  ) : (
                    "Save"
                  )}
                </Button>
              </>
            )}
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

export default AddUser;
