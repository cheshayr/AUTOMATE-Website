// hooks/use-alert.js
import React, { useState, useCallback } from "react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

export function useAlert() {
  const [isOpen, setIsOpen] = useState(false);
  const [config, setConfig] = useState({
    title: "",
    description: "",
    actionLabel: "Confirm",
    onConfirm: () => {},
    onCancel: () => {}, // Optional: callback for cancel
  });

  const showConfirm = useCallback(
    ({ title, description, actionLabel = "Confirm", onConfirm, onCancel }) => {
      setConfig({ title, description, actionLabel, onConfirm, onCancel });
      setIsOpen(true);
    },
    []
  );

  const AlertDialogProvider = ({ children }) => (
    <>
      {children}
      <AlertDialog open={isOpen} onOpenChange={setIsOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{config.title}</AlertDialogTitle>
            <AlertDialogDescription>
              {config.description}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel
              onClick={() => {
                setIsOpen(false);
                config.onCancel?.(); // Call optional cancel callback
              }}
            >
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              className={
                config.actionLabel.includes("Delete")
                  ? "bg-red-500 text-white"
                  : ""
              } // Example styling for delete action
              data-testid="alert-dialog-confirm-action"
              onClick={() => {
                config.onConfirm();
                setIsOpen(false);
              }}
            >
              {config.actionLabel}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );

  return { showConfirm, AlertDialogProvider };
}
