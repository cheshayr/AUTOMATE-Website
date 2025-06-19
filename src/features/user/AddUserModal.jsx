import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useState } from 'react';
import { Eye, EyeIcon, EyeOffIcon, Plus } from 'lucide-react';

function AddUser({ isAdd = true, user = {} }) {
  const [userDetails, setUserDetails] = useState(user);

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle form submission logic here
    alert('Form submitted');
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        {isAdd ? (
          <Button>
            <Plus /> Add User
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
          <DialogTitle>{isAdd ? 'Add User' : 'User Info'}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 mb-4">
            <div className="grid gap-3">
              <Label htmlFor="name">Name</Label>
              <Input
                onChange={(e) =>
                  setUserDetails({ ...item, name: e.target.value })
                }
                id="name"
                name="name"
                placeholder="Name"
                value={userDetails.name}
              />
            </div>
            <div className="grid gap-3">
              <Label htmlFor="email">Email</Label>
              <Input
                onChange={(e) =>
                  setUserDetails({ ...item, email: e.target.value })
                }
                id="email"
                name="email"
                placeholder="Email"
                value={userDetails.email}
              />
            </div>
            <div className="grid gap-3">
              <Label htmlFor="number">Number</Label>
              <Input
                onChange={(e) =>
                  setUserDetails({ ...item, mobileNumber: e.target.value })
                }
                id="number"
                name="number"
                placeholder="Number"
                value={userDetails.mobileNumber}
              />
            </div>
            <div className="grid gap-3">
              <Label htmlFor="category">Role</Label>
              <Select disabled id="role" name="role" value="Staff">
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select a role" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectItem value="Staff">Staff</SelectItem>
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
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select a position" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectItem value="Office Staff">Office Staff</SelectItem>
                    <SelectItem value="Mechanic">Mechanic</SelectItem>
                    <SelectItem value="Helper">Helper</SelectItem>
                    <SelectItem value="Guard">Guard</SelectItem>
                    <SelectItem value="Helper">Helper</SelectItem>
                    <SelectItem value="Driverr">Driverr</SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>
            {isAdd && (
              <div className="grid gap-3">
                <Label htmlFor="position">Password</Label>
                <Input
                  type={'password'}
                  value={userDetails.passworrd}
                  autocomplete="new-password"
                />
              </div>
            )}
          </div>
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline">Cancel</Button>
            </DialogClose>
            {isAdd ? (
              <Button type="submit">Save</Button>
            ) : (
              <Button type="submit">Update</Button>
            )}
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

export default AddUser;
