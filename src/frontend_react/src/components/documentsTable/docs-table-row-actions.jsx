"use client";

import { Button } from "../ui/button";
import { Download, Check, X } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "../ui/tooltip";
import axios from "axios";

export function DataTableRowActions({ row }) {
  const task = row.original; // Assuming row.original contains the task data
  console.log(task);

  const handleDownload = (documentData) => {
    if (typeof document === "undefined") {
      console.error(
        "Document object is not available. Ensure this runs in a browser context."
      );
      return;
    }

    if (!documentData || !documentData.Title || !documentData.pdf) {
      console.error("Invalid document data:", documentData);
      return;
    }

    try {
      const link = document.createElement("a");
      link.href = `data:application/pdf;base64,${documentData.pdf}`;
      link.download = `${documentData.Title}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      console.error("Error during file download:", error);
    }
  };

  const handleAccept = () => {
    try {
      const response = axios.post("http://localhost:8000/acceptRejectUser", {
        userId: task.ownerId,
        decision: "accept",
      });
      window.location.reload();
    } catch (error) {
      console.error(error);
    }
  };

  const handleReject = () => {
    try {
      const response = axios.post("http://localhost:8000/acceptRejectUser", {
        userId: task.ownerId,
        decision: "reject",
      });
      window.location.reload();
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <TooltipProvider>
      <div className="flex space-x-2">
        {/* Map over the documents and create a download button for each */}
        {task.documents.map((doc, index) => (
          <Button
            key={index}
            onClick={() => handleDownload(doc)}
            variant="outline"
          >
            Download {doc.Title}
          </Button>
        ))}

        {/* Accept Button */}
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              onClick={handleAccept}
              variant="outline"
              size="icon"
              className="text-green-600 hover:text-green-600 hover:bg-green-100"
              aria-label="Accept"
            >
              <Check className="h-4 w-4" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>Accept</p>
          </TooltipContent>
        </Tooltip>

        {/* Reject Button */}
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              onClick={handleReject}
              variant="outline"
              size="icon"
              className="text-red-600 hover:text-red-600 hover:bg-red-100"
              aria-label="Reject"
            >
              <X className="h-4 w-4" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>Reject</p>
          </TooltipContent>
        </Tooltip>
      </div>
    </TooltipProvider>
  );
}
