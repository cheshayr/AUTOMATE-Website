import React from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useFetchTransactions } from "@/hooks/useTransactionQuery"; // Hook to fetch from DB
import LoadingSpinner from "@/components/LoadingSpinner";

const ProductHistoryModal = ({ open, setOpen, itemName }) => {
  const { data: transactionData, isLoading } = useFetchTransactions(itemName);
  const logs = transactionData?.data || [];

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <DialogTitle>Audit Trail: {itemName}</DialogTitle>
        </DialogHeader>

        <div className="border rounded-md max-h-[400px] overflow-y-auto">
          {isLoading ? (
            <div className="p-10 flex justify-center"><LoadingSpinner /></div>
          ) : (
            <Table>
              <TableHeader className="bg-slate-50 sticky top-0">
                <TableRow>
                  <TableHead>Date</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Qty</TableHead>
                  <TableHead>Reason/Remarks</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {logs.length > 0 ? (
                  logs.map((log) => (
                    <TableRow key={log._id}>
                      <TableCell className="text-xs">
                        {new Date(log.dateTime).toLocaleString()}
                      </TableCell>
                      <TableCell>
                        <span className={log.type === "IN" ? "text-green-600 font-bold" : "text-red-600 font-bold"}>
                          {log.type}
                        </span>
                      </TableCell>
                      <TableCell className="font-semibold">{log.quantity}</TableCell>
                      <TableCell className="text-xs">
                        <span className="font-medium text-slate-700">{log.reason || ""}</span>
                        <p className="italic text-muted-foreground">{log.remarks}</p>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={4} className="text-center py-10">No history found in database.</TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ProductHistoryModal;