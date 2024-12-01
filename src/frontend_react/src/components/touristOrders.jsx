"use client";

import React, { useState, useEffect } from "react";
import axios from "axios";
import { Button } from "../components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../components/ui/table";
import { useToast } from "../components/ui/use-toast";
import { useReactTable, flexRender, getCoreRowModel, getPaginationRowModel, getSortedRowModel, getFilteredRowModel } from "@tanstack/react-table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "../components/ui/dialog";

const columns = [
  {
    accessorKey: "invoiceNumber",
    header: "Invoice Number",
    cell: ({ row }) => <span>{row.original.invoiceNumber}</span>,
  },
  {
    accessorKey: "date",
    header: "Date",
    cell: ({ row }) => {
      const date = new Date(row.original.date);
      const formattedDate = date.toLocaleDateString("en-GB");
      return <span className="whitespace-nowrap">{formattedDate}</span>;
    },
  },
  {
    accessorKey: "total",
    header: "Total Amount",
    cell: ({ row }) => <span>${row.original.total.toFixed(2)}</span>,
  },
  {
    accessorKey: "status",
    header: "Order Status",
    cell: ({ row }) => {
      const status = row.original.status;
      let statusText;
      let statusClass;

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
  {
    id: "details",
    header: "Details",
    cell: ({ row }) => (
      <Button
        onClick={() => row.original.openOrderDetails(row.original)}
        className="w-full text-xs text-primary-600 bg-primary-100 hover:bg-primary-200"
      >
        View Details
      </Button>
    ),
  }
];

const TouristOrdersTable = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [sorting, setSorting] = useState([]);
  const [columnFilters, setColumnFilters] = useState([]);
  const [columnVisibility, setColumnVisibility] = useState({});
  const [rowSelection, setRowSelection] = useState({});
  const { toast } = useToast();

  const fetchOrders = async (userID) => {
    try {
      const response = await axios.get(`http://localhost:8000/getMyOrders/${userID}`);
      const ordersWithOpenDetails = response.data.orders.map(order => ({
        ...order,
        openOrderDetails: () => setSelectedOrder(order)
      }));
      setOrders(ordersWithOpenDetails);
    } catch (error) {
      console.error("Error fetching orders:", error);
      toast({
        title: "Error",
        description: "Could not load orders.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchTouristID = async () => {
    const username = sessionStorage.getItem('username');
    if (!username) {
      console.error('No username found in session storage.');
      toast({
        title: "Error",
        description: "No user information found. Please log in again.",
        variant: "destructive",
      });
      return;
    }

    try {
      const response = await fetch(`http://localhost:8000/getID/${username}`);
      if (!response.ok) throw new Error("Failed to fetch tourist ID");

      const { userID } = await response.json();
      fetchOrders(userID);
    } catch (error) {
      console.error("Error fetching tourist ID:", error);
      toast({
        title: "Error",
        description: "Could not load tourist information.",
        variant: "destructive",
      });
    }
  };

  useEffect(() => {
    fetchTouristID();
  }, []);

  const closeOrderDetails = () => {
    setSelectedOrder(null);
  };

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
    return <div>Loading...</div>;
  }

  return (
    <>
      <div className="overflow-x-auto">
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
                  className="hover:bg-default-50 border-default-200"
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

      {selectedOrder && (
        <OrderDetailsModal
          open={!!selectedOrder}
          onClose={closeOrderDetails}
          order={selectedOrder}
        />
      )}
    </>
  );
};

const OrderDetailsModal = ({ open, onClose, order }) => {
  if (!order) return null;

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl mx-auto bg-white rounded-lg shadow-lg p-6">
        <DialogHeader className="text-center pb-4">
          <DialogTitle className="text-2xl font-semibold text-gray-800">Order Details</DialogTitle>
          <DialogDescription className="text-sm text-gray-500">
            Below are the details of your order.
          </DialogDescription>
        </DialogHeader>

        <div className="mt-4 space-y-2">
         
          <p><strong>Status:</strong> {order.status}</p>
          <p><strong>Total Amount:</strong> ${order.total.toFixed(2)}</p>
          <p><strong>Order Date:</strong> {new Date(order.date).toLocaleDateString("en-GB")}</p>
          <p><strong>Is Paid:</strong> {order.isPaid ? "Yes" : "No"}</p>
          
          <div>
  <strong>Products:</strong>
  <ul className="list-disc pl-5 mt-2">
    {order.products.map((product, index) => {
      // Set quantity to 1 if not provided
      const quantity = order.quantities[index] || 1;
      return (
        <li key={product._id}>
          {product.name} - Quantity: {quantity}
        </li>
      );
    })}
  </ul>
</div>

          
        
        </div>

        <div className="mt-6 text-right">
          <Button onClick={onClose}>Close</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default TouristOrdersTable;

