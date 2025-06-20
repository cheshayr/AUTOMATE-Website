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
import { Textarea } from "@/components/ui/textarea";
import {
  MinusCircle,
  Plus,
  PlusCircle,
  ShieldCheck,
  Trash2,
} from "lucide-react";
import { useDeleteItem } from "@/hooks/useInventoryMutation";
import LoadingSpinner from "@/components/LoadingSpinner";
import { useEffect, useState } from "react";
import { useActivateUser, useDeactivateUser } from "@/hooks/useUsersMutation";

function ManageUserStatus({ userName, id, isActive }) {
  const [isOpen, setIsOpen] = useState(false);

  const {
    mutateAsync: activateUserMutation,
    isPending: activateUserMutationPending,
    isError: activateUserMutationError,
    isSuccess: activateUserMutationSuccess,
    reset: resetActivateUserMutation,
  } = useActivateUser();

  const {
    mutateAsync: deactivateUserMutation,
    isPending: deactivateUserMutationPending,
    isError: deactivateUserMutationError,
    isSuccess: deactivateUserMutationSuccess,
    reset: resetDeactivateUserMutation,
  } = useDeactivateUser();

  useEffect(() => {
    if (activateUserMutationSuccess || deactivateUserMutationSuccess) {
      setIsOpen(false);
    }

    resetActivateUserMutation();
    resetDeactivateUserMutation();
  }, [activateUserMutationSuccess, deactivateUserMutationSuccess, isOpen]);

  const handleDeactivate = async (e) => {
    e.preventDefault();

    await deactivateUserMutation({ id });
  };

  const handleActivate = async (e) => {
    e.preventDefault();

    await activateUserMutation({ id });
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        {isActive ? (
          <Button
            variant="outline"
            size="icon"
            className="text-red-600 hover:text-red-700"

            //   onClick={() => handleReactivate(user.id)}
          >
            <ShieldCheck size={18} />
          </Button>
        ) : (
          <Button
            variant="outline"
            size="icon"
            className="text-green-600 hover:text-green-700"

            //   onClick={() => handleReactivate(user.id)}
          >
            <ShieldCheck size={18} />
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>
            {isActive ? "Deactivate User" : "Activate User"}
          </DialogTitle>
        </DialogHeader>
        <div>
          <div className="grid gap-4 mb-4">
            <p>
              {isActive
                ? `This will deactivate user "${userName}". Are you sure you want to continue?`
                : `This will reactivate user "${userName}". Are you sure you want to continue?`}
            </p>
          </div>
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline">Cancel</Button>
            </DialogClose>
            {isActive ? (
              <Button onClick={handleDeactivate}>
                {deactivateUserMutationPending ? (
                  <span className="flex items-center gap-1">
                    <LoadingSpinner />
                    Deactivating
                  </span>
                ) : (
                  "Deactivate"
                )}
              </Button>
            ) : (
              <Button onClick={handleActivate}>
                {activateUserMutationPending ? (
                  <span className="flex items-center gap-1">
                    <LoadingSpinner />
                    Activating
                  </span>
                ) : (
                  "Activate"
                )}
              </Button>
            )}
          </DialogFooter>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export default ManageUserStatus;
