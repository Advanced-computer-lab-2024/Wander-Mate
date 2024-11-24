"use client";

import { MoreHorizontal } from "lucide-react";
import { z } from "zod";
import axios from "axios";
import { Button } from "../ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";

// import { labels } from "./data";
import { statuses } from "./data";

import { ComplaintDialog } from "../replyToComplain";

export function DataTableRowActions({ row }) {
  const taskSchema = z.object({
    userName: z.string(),
    Title: z.string(),
    Status: z.string(),
    Date: z.string(),
    id: z.string(),
    Body: z.string(),
    // label: z.string(),
    // priority: z.string(),
  });
  const task = taskSchema.parse(row.original);

  const deleteComplaint = async () => {
    try {
      const response = await axios.delete(
        `http://localhost:8000/deleteComplaint/${task.id}`
      );
      window.location.reload();
    } catch (error) {
      console.error(error);
    }
  };

  const handleStatusChange = async (newStatus) => {
    try {
      if (newStatus === "Resolved") {
        await axios.put(
          `http://localhost:8000/markComplaintAsResolved/${task.id}`
        );
      } else if (newStatus === "Pending") {
        await axios.put(
          `http://localhost:8000/markComplaintAsPending/${task.id}`
        );
      }
      window.location.reload();
    } catch (error) {
      console.error("Failed to update task status:", error);
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          className="flex h-8 w-8 p-0 data-[state=open]:bg-muted"
        >
          <MoreHorizontal className="h-4 w-4" />
          <span className="sr-only">Open menu</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-[160px]">
        <ComplaintDialog complaint={task} onStatusChange={handleStatusChange} />
        <DropdownMenuSeparator />
        <DropdownMenuSub>
          <DropdownMenuSubTrigger>Mark as</DropdownMenuSubTrigger>
          <DropdownMenuSubContent>
            <DropdownMenuRadioGroup
              value={task.Status}
              onValueChange={(newStatus) => handleStatusChange(newStatus)}
            >
              {statuses.map((Status) => (
                <DropdownMenuRadioItem key={Status.value} value={Status.value}>
                  {Status.label}
                </DropdownMenuRadioItem>
              ))}
            </DropdownMenuRadioGroup>
          </DropdownMenuSubContent>
        </DropdownMenuSub>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          onClick={(e) => {
            deleteComplaint();
          }}
        >
          Delete
          <DropdownMenuShortcut>⌘⌫</DropdownMenuShortcut>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
