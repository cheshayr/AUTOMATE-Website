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
import { useReactivateUser } from "@/hooks/useUsersMutation";
import { toast } from "sonner";
import LoadingSpinner from "@/components/LoadingSpinner";
import { useState } from "react";

function ReactivateUserButton({ id, userName }) {
  const [isOpen, setIsOpen] = useState(false);
  const [adminPassword, setAdminPassword] = useState("");
  const { mutateAsync, isPending } = useReactivateUser();

  const handleReactivate = async () => {
    try {
      // Check admin password
      if (!adminPassword.trim()) {
        toast.error("Admin password is required to reactivate an account.");
        return;
      }

      await mutateAsync({ id, adminPassword });

      setIsOpen(false);
      setAdminPassword("");
    } catch (error) {
      console.error(error);
      const message =
        error?.response?.data?.message || error?.response?.data?.error || "Failed to reactivate user.";
      toast.error(message);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !isPending) {
      handleReactivate();
    }
  };

  const handleClose = () => {
    setIsOpen(false);
    setAdminPassword("");
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button className="bg-green-600 hover:bg-green-700 text-white">
          Reactivate
        </Button>
      </DialogTrigger>

      <DialogContent>
        <DialogHeader>
          <DialogTitle>Reactivate User Account</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <p className="text-sm text-muted-foreground">
            This will reactivate user{" "}
            <span className="font-semibold">{userName}</span>. They will be
            able to login again and access all features.
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
            onClick={handleReactivate}
            disabled={isPending || !adminPassword.trim()}
            className="bg-green-600 hover:bg-green-700 text-white"
          >
            {isPending ? (
              <>
                <LoadingSpinner /> Reactivating...
              </>
            ) : (
              "Reactivate"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export default ReactivateUserButton;