import { Button } from "@/components/ui/button";
import { useReactivateUser } from "@/hooks/useUsersMutation";
import { toast } from "sonner";
import LoadingSpinner from "@/components/LoadingSpinner";

function ReactivateUserButton({ id, userName }) {
  const { mutateAsync, isPending } = useReactivateUser();

  const handleReactivate = async () => {
    try {
      await mutateAsync(id);
      // No need for extra toast, already handled in hook
    } catch (error) {
      // Error toast handled in hook
    }
  };

  return (
    <Button
      onClick={handleReactivate}
      disabled={isPending}
      className="bg-green-600 hover:bg-green-700 text-white"
    >
      {isPending ? <LoadingSpinner /> : "Reactivate"}
    </Button>
  );
}

export default ReactivateUserButton;