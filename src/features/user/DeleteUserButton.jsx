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
import { Input } from "@/components/ui/input";
import { Trash2 } from "lucide-react";
import { useState } from "react";
import { useDeactivateUser } from "@/hooks/useUsersMutation";
import LoadingSpinner from "@/components/LoadingSpinner";
import { toast } from "sonner";

function DeleteUserButton({ id, userName, role, currentUser }) {
  const [isOpen, setIsOpen] = useState(false);
  const [adminPassword, setAdminPassword] = useState("");
  const { mutateAsync, isPending } = useDeactivateUser();

  const handleDelete = async () => {
    try {
      // 🚨 VALIDATION 1 — Check ID
      if (!id) {
        toast.error("Invalid user ID.");
        return;
      }

      // Check admin password
      if (!adminPassword.trim()) {
        toast.error("Admin password is required to deactivate an account.");
        return;
      }

      // Prevent self delete
      if (currentUser?._id === id) {
        toast.error("You cannot deactivate your own account.");
        return;
      }

      // Protect Admin (matches backend)
      if (role === "admin") {
        toast.error("Admin accounts cannot be deactivated.");
        return;
      }

      await mutateAsync({ id, adminPassword });

      toast.success("User account has been deactivated successfully.");
      setIsOpen(false);
      setAdminPassword("");
    } catch (error) {
      console.error(error);

      // ✅ Show backend error message if available
      const message =
        error?.response?.data?.message || error?.response?.data?.error || "Failed to deactivate user.";

      toast.error(message);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !isPending) {
      handleDelete();
    }
  };

  const handleClose = () => {
    setIsOpen(false);
    setAdminPassword("");
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
          <DialogTitle>Deactivate User Account</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <p className="text-sm text-muted-foreground">
            This will deactivate user{" "}
            <span className="font-semibold">{userName}</span>. They will not be
            able to login until reactivated by an admin.
          </p>


          <div>
            <label className="text-sm font-medium text-gray-700 mb-2 block">
              Admin Password <span className="text-red-500">*</span>
            </label>
            <Input
              type="password"
              placeholder="Enter admin password"
              value={adminPassword}
              onChange={(e) => setAdminPassword(e.target.value)}
              onKeyPress={handleKeyPress}
              disabled={isPending}
              autoFocus
            />
          </div>
        </div>

        <DialogFooter>
          <DialogClose asChild>
            <Button variant="outline" onClick={handleClose}>
              Cancel
            </Button>
          </DialogClose>

          <Button
            onClick={handleDelete}
            disabled={isPending || !adminPassword.trim()}
            className="bg-red-600 hover:bg-red-700 text-white"
          >
            {isPending ? (
              <>
                <LoadingSpinner /> Deactivating...
              </>
            ) : (
              "Deactivate"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export default DeleteUserButton;