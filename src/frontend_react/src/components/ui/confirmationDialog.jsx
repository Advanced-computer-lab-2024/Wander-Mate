import React from "react";
import { Dialog, DialogTrigger, DialogContent } from "./dialog";
import { Button } from "./button";

const CustomConfirmationDialog = ({ isOpen, onConfirm, onCancel, message }) => {
  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onCancel()}>
      
      <DialogContent className="w-96 p-6 bg-white rounded-lg shadow-lg">
        <h3 className="text-xl font-semibold mb-4">{message}</h3>
        <div className="flex justify-end space-x-4">
          <Button onClick={onCancel} variant="outline" color="gray">
            Cancel
          </Button>
          <Button onClick={onConfirm} color="destructive">
            Confirm
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default CustomConfirmationDialog;
