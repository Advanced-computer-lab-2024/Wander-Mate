"use client";

import React, { useState, useEffect } from "react";
import axios from "axios";
import { Button } from "../components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../components/ui/table";
import { useToast } from "../components/ui/use-toast";
import { useReactTable, flexRender, getCoreRowModel, getPaginationRowModel, getSortedRowModel, getFilteredRowModel } from "@tanstack/react-table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "../components/ui/dialog";
import { DataTableFacetedFilter } from "../components/table/data-table-faceted-filter";
import NavigationMenuBar from "./NavigationMenuBar";

const columns = [
  {
    accessorKey: "Title",
    header: "Title",
    cell: ({ row }) => <span>{row.original.Title}</span>,
  },
  {
    accessorKey: "Status",
    header: "Status",
    cell: ({ row }) => {
      const status = row.original.Status;
      let statusText, statusClass;

      switch (status) {
        case "Pending":
          statusText = "Pending";
          statusClass = "bg-warning/10 text-warning";
          break;
        case "In Progress":
          statusText = "In Progress";
          statusClass = "bg-primary/10 text-primary";
          break;
        case "Resolved":
          statusText = "Resolved";
          statusClass = "bg-success/10 text-success";
          break;
        default:
          statusText = "Unknown";
          statusClass = "bg-gray-100 text-gray-600";
          break;
      }

      return (
        <div className="whitespace-nowrap">
          <span className={`inline-block px-3 py-[2px] rounded-2xl ${statusClass} text-xs ml-10px`}>
            {statusText}
          </span>
        </div>
      );
    },
    filterFn: (row, id, value) => {
      return value.includes(row.getValue(id));
    },
  },
  {
    accessorKey: "Date",
    header: "Created At",
    cell: ({ row }) => {
      const date = new Date(row.original.Date);
      return <span>{date.toLocaleDateString("en-GB")}</span>;
    },
  },
  {
    accessorKey: "Details",
    header: "Details",
    cell: ({ row }) => (
      <Button className="mr-[7vw]" onClick={() => row.original.openDetails()}>View Details</Button>
    ),
  },
];

const ViewMyComplaints = () => {
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedComplaint, setSelectedComplaint] = useState(null);
  const { toast } = useToast();

  const fetchComplaints = async () => {
    const username = sessionStorage.getItem("username");

    try {
      const idResponse = await fetch(`http://localhost:8000/getID/${username}`);
      if (!idResponse.ok) throw new Error("Failed to fetch tourist ID");

      const { userID } = await idResponse.json();
      const response = await axios.get(`http://localhost:8000/viewMyComplaints/${userID}`);

      const complaintsWithDetails = response.data.complaints.map((complaint) => ({
        ...complaint,
        openDetails: () => setSelectedComplaint(complaint),
      }));
      setComplaints(complaintsWithDetails);
    } catch (error) {
      console.error("Error fetching complaints:", error);
      toast({
        title: "Error",
        description: "Could not load complaints.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchComplaints();
  }, []);

  const table = useReactTable({
    data: complaints,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
  });

  const closeComplaintDetails = () => setSelectedComplaint(null);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <>
      <NavigationMenuBar />
      <br />
      <br />
      <h1 className="text-3xl font-bold text-center mb-8">Your Complaints</h1>
      <div className="mb-4 flex justify-end mr-[5vw]">
        <DataTableFacetedFilter 
          column={table.getColumn("Status")}
          title="Status"
          options={[
            { label: "Pending", value: "Pending" },
            { label: "In Progress", value: "In Progress" },
            { label: "Resolved", value: "Resolved" },
          ]}
        />
      </div>
      <div className="overflow-x-auto">
        <Table className="table-fixed w-full text-center">
          <TableHeader className="bg-default-300 ">
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead
                    key={header.id}
                    className="text-sm font-semibold text-default-600 h-12 text-center whitespace-nowrap"
                  >
                    {header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow key={row.id} className="hover:bg-default-50 border-default-200 ">
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id} className="text-center text-default-600 py-3  ">
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={columns.length} className="h-24 text-center">
                  No complaints found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {selectedComplaint && (
        <ComplaintDetailsModal
          open={!!selectedComplaint}
          onClose={closeComplaintDetails}
          complaint={selectedComplaint}
        />
      )}
    </>
  );
};

const ComplaintDetailsModal = ({ open, onClose, complaint }) => {
  if (!complaint) return null;

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl mx-auto bg-white rounded-lg shadow-lg p-6">
        <DialogHeader className="text-center pb-4">
          <DialogTitle className="text-2xl font-semibold text-gray-800">Complaint Details</DialogTitle>
          <DialogDescription className="text-sm text-gray-500">
            Below are the details of your complaint.
          </DialogDescription>
        </DialogHeader>

        <div className="mt-4 space-y-2">
          <p><strong>Status:</strong> {complaint.Status}</p>
          <p><strong>Description:</strong> {complaint.Body}</p>
          <p><strong>Reply:</strong> {complaint.Reply.Body}</p>
          <p><strong>Created At:</strong> {new Date(complaint.Date).toLocaleDateString("en-GB")}</p>
        </div>

        <div className="mt-6 text-right">
          <Button onClick={onClose}>Close</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ViewMyComplaints;
