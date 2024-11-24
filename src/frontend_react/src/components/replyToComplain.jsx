"use client";

import { useState } from "react";
import { Button } from "./ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog";
import { Textarea } from "./ui/textarea";
import axios from "axios";
import { DropdownMenuItem } from "./ui/dropdown-menu";

import { Label } from "./ui/label";

export function ComplaintDialog({ complaint, onStatusChange }) {
  const [reply, setReply] = useState("");
  const [isOpen, setIsOpen] = useState(false);

  const handleReply = async () => {
    try {
      await axios.post(
        `http://localhost:8000/complaints/${complaint.id}/reply`,
        { Body: reply }
      );
      setReply(""); // Reset the reply field after submission
      setIsOpen(false);
    } catch (error) {
      console.error("Failed to send reply:", error);
    }
  };

  const handleResolve = async () => {
    try {
      await onStatusChange("Resolved"); // Updating the status of the complaint
      setIsOpen(false); // Closing the dialog after marking as resolved
    } catch (error) {
      console.error("Failed to mark as resolved:", error);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
          Show details
        </DropdownMenuItem>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{complaint.Title}</DialogTitle>
          <DialogDescription>{complaint.Body}</DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid w-full gap-1.5">
            <Label htmlFor="reply">Reply</Label>
            <Textarea
              id="reply"
              value={reply}
              onChange={(e) => setReply(e.target.value)}
              className="w-full"
            />
          </div>
        </div>
        <DialogFooter>
          <Button type="button" onClick={handleReply}>
            Send Reply
          </Button>
          {complaint.Status !== "Resolved" && (
            <Button variant="outline" onClick={handleResolve}>
              Mark as Resolved
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
