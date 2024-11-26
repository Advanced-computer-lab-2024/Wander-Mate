"use client";
import React, { useEffect, useState } from "react";
import axios from "axios";

import {
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "./ui/table";
import { Button } from "./ui/button";
import { Icon } from "@iconify/react";
import { cn } from "../lib/utils";

const columns = [
  {
    accessorKey: "invoice",
    header: "Invoice",
    cell: ({ row }) => <span>{row.original.invoiceNumber}</span>,
  },
  {
    accessorKey: "username",
    header: "Username",
    cell: ({ row }) => (
      <span className="whitespace-nowrap">{row.original.userId.Username}</span>
    ),
  },
  {
    accessorKey: "date",
    header: "Date",
    cell: ({ row }) => {
      // Format the date to "YYYY-MM-DD"
      const date = new Date(row.getValue("date"));
      const formattedDate = date.toLocaleDateString("en-GB"); // You can change the locale if needed
      return <span className="whitespace-nowrap">{formattedDate}</span>;
    },
  },
  {
    accessorKey: "amount",
    header: "Amount",
    cell: ({ row }) => <span>{row.original.total}</span>,
  },
  {
    accessorKey: "isComplete",
    header: "Order Status",
    cell: ({ row }) => {
      const status = row.original.status;
      let statusText;
      let statusClass;

      // Determine the status text and style based on the status value
      switch (status) {
        case "shipped":
          statusText = "Shipped";
          statusClass = "bg-primary/10 text-primary";
          break;
        case "delivered":
          statusText = "Delivered";
          statusClass = "bg-success/10 text-success";
          break;
        case "cancelled":
          statusText = "Cancelled";
          statusClass = "bg-danger/10 text-danger";
          break;
        case "pending":
        default:
          statusText = "Pending";
          statusClass = "bg-warning/10 text-warning";
          break;
      }

      return (
        <div className="whitespace-nowrap">
          <span
            className={`inline-block px-3 py-[2px] rounded-2xl ${statusClass} text-xs`}
          >
            {statusText}
          </span>
        </div>
      );
    },
  },
];

const OrdersTable = () => {
  const [orders, setOrders] = useState([]); // State to store the fetched data
  const [loading, setLoading] = useState(true); // Loading state
  const [sorting, setSorting] = React.useState([]);
  const [columnFilters, setColumnFilters] = React.useState([]);
  const [columnVisibility, setColumnVisibility] = React.useState({});
  const [rowSelection, setRowSelection] = React.useState({});

  useEffect(() => {
    // Fetch order data from the backend
    const fetchOrders = async () => {
      try {
        const response = await axios.get("http://localhost:8000/viewAllOrders"); // Replace with your API endpoint
        setOrders(response.data); // Set fetched data to the state
      } catch (error) {
        console.error("Error fetching orders:", error);
      } finally {
        setLoading(false); // Set loading to false after data is fetched
      }
    };

    fetchOrders();
  }, []);

  // Table initialization
  const table = useReactTable({
    data: orders,
    columns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
    },
  });

  if (loading) {
    return <div>Loading...</div>; // Show a loading message while data is being fetched
  }

  return (
    <>
      <div className="overflow-x-auto">
        <div className="h-full w-full overflow-auto no-scrollbar">
          <Table className="table-fixed w-full">
            <TableHeader className="bg-default-300">
              {table.getHeaderGroups().map((headerGroup) => (
                <TableRow key={headerGroup.id}>
                  {headerGroup.headers.map((header) => (
                    <TableHead
                      key={header.id}
                      className="text-sm font-semibold text-default-600 h-12 text-start whitespace-nowrap"
                    >
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                    </TableHead>
                  ))}
                </TableRow>
              ))}
            </TableHeader>
            <TableBody className="[&_tr:last-child]:border-1">
              {table.getRowModel().rows?.length ? (
                table.getRowModel().rows.map((row) => (
                  <TableRow
                    key={row.id}
                    data-state={row.getIsSelected() && "selected"}
                    className="hover:bg-default-50 border-default-200 "
                  >
                    {row.getVisibleCells().map((cell) => (
                      <TableCell
                        key={cell.id}
                        className="text-sm text-default-600 py-3 last:text-start"
                      >
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext()
                        )}
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell
                    colSpan={columns.length}
                    className="h-24 text-center"
                  >
                    No results.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </div>

      <div className="flex justify-center items-center gap-2 mt-5">
        <Button
          onClick={() => table.previousPage()}
          disabled={!table.getCanPreviousPage()}
          className="w-7 h-7 p-0 bg-default-100 hover:bg-default-200 text-default-600"
        >
          <Icon
            icon="heroicons:chevron-left"
            className="w-3.5 h-3.5 rtl:rotate-180 "
          />
        </Button>

        {table.getPageOptions().map((page, pageIdx) => (
          <Button
            onClick={() => table.setPageIndex(pageIdx)}
            key={`orders-table-${pageIdx}`}
            className={cn(
              "w-7 h-7 p-0 bg-default-100 hover:bg-default-200 text-default-600",
              {
                "bg-primary text-primary-foreground":
                  pageIdx === table.getState().pagination.pageIndex,
              }
            )}
          >
            {page + 1}
          </Button>
        ))}

        <Button
          onClick={() => table.nextPage()}
          disabled={!table.getCanNextPage()}
          className="w-7 h-7 p-0 bg-default-100 hover:bg-default-200 text-default-600"
        >
          <Icon
            icon="heroicons:chevron-right"
            className="w-3.5 h-3.5 rtl:rotate-180"
          />
        </Button>
      </div>
    </>
  );
};

export default OrdersTable;
