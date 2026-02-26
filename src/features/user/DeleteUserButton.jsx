import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";
import { useState } from "react";
import { useDeleteUser } from "@/hooks/useUsersMutation";
import LoadingSpinner from "@/components/LoadingSpinner";
import { toast } from "sonner";

function DeleteUserButton({ id, userName, role, currentUser }) {
  const [isOpen, setIsOpen] = useState(false);
  const { mutateAsync, isPending } = useDeleteUser();

  const handleDelete = async () => {
    try {
      // 🚨 VALIDATION 1 — Check ID
      if (!id) {
        toast.error("Invalid user ID.");
        return;
      }

      // 🚨 VALIDATION 2 — Prevent self delete
      if (currentUser?._id === id) {
        toast.error("You cannot delete your own account.");
        return;
      }

      // 🚨 VALIDATION 3 — Protect Admin (matches backend)
      if (role === "admin") {
        toast.error("Admin accounts cannot be deleted.");
        return;
      }

      // 🚨 OPTIONAL — Staff warning
      if (role === "staff") {
        toast.warning(
          "Make sure this staff member has no active assignments before deleting."
        );
      }

      await mutateAsync(id);

      toast.success("User account has been deactivated.");
      setIsOpen(false);
    } catch (error) {
      console.error(error);

      // ✅ Show backend error message if available
      const message =
        error?.response?.data?.message || "Failed to delete user.";

      toast.error(message);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button
          variant="outline"
          size="icon"
          className="text-red-600 hover:bg-red-50"
        >
          <Trash2 size={18} />
        </Button>
      </DialogTrigger>

      <DialogContent>
        <DialogHeader>
          <DialogTitle>Delete User</DialogTitle>
        </DialogHeader>

        <p className="text-sm text-muted-foreground">
          This will deactivate user{" "}
          <span className="font-semibold">{userName}</span>.
          This action can be reversed later.
        </p>

        <DialogFooter>
          <DialogClose asChild>
            <Button variant="outline">Cancel</Button>
          </DialogClose>

          <Button
            onClick={handleDelete}
            disabled={isPending}
            className="bg-red-600 hover:bg-red-700 text-white"
          >
            {isPending ? (
              <>
                <LoadingSpinner /> Deleting...
              </>
            ) : (
              "Delete"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export default DeleteUserButton;