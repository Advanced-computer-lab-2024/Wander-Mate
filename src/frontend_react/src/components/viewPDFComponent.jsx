"use client";

import React, { useState } from "react";
import { Icon } from "@iconify/react";
import { Button } from "./ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../components/ui/table";
import { Checkbox } from "../components/ui/checkbox";

import pdfi from "../public/images/files/pdf.png";

const ViewPDFComp = ({ files }) => {
  const [selectedRows, setSelectedRows] = useState([]);

  // Function to format the date (without the time)
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-GB'); // You can adjust the locale if needed
  };

  // Function to handle the download
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
      // Create an anchor element
      const link = document.createElement("a");

      // Create the data URI for the PDF file
      link.href = `data:application/pdf;base64,${documentData.pdf}`;
      link.download = `${documentData.Title}.pdf`; // Set the file name to be downloaded

      // Append link to body, trigger click, then remove link
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      console.error("Error during file download:", error);
    }
  };

  return (
    <div className="w-full h-[calc(100vh-180px)] overflow-auto no-scrollbar">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead />
            <TableHead className="font-semibold text-left">File Name</TableHead>
            <TableHead className="text-left">Upload Date</TableHead>
            <TableHead className="text-right">Action</TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {files.map((item) => (
            <TableRow
              key={item._id}
              className="hover:bg-muted whitespace-nowrap"
              data-state={selectedRows.includes(item._id) && "selected"}
            >
              <TableCell />

              <TableCell className="text-left">
                <div className="flex items-center space-x-3">
                  <div className="h-10 w-10">
                    <img
                      alt={item.fileName}
                      width={40}
                      height={40}
                      className="h-full w-full object-cover"
                      src={pdfi}
                    />
                  </div>
                  <span className="text-sm text-card-foreground">{item.Title}</span>
                </div>
              </TableCell>

              {/* Format the date without time */}
              <TableCell className="text-left">{formatDate(item.createdAt)}</TableCell>

              <TableCell className="text-right">
                <div className="flex justify-end space-x-3 rtl:space-x-reverse">
                  <Button
                    size="icon"
                    variant="outline"
                    className="h-7 w-7"
                    onClick={() => handleDownload(item)}
                  >
                    <Icon icon="heroicons:arrow-down-tray" className="h-4 w-4" />
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default ViewPDFComp;
