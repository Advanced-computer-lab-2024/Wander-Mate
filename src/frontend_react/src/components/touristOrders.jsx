"use client";

import React, { useState, useEffect } from "react";
import axios from "axios";
import { Button } from "../components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../components/ui/table";
import { useToast } from "../components/ui/use-toast";
import { useReactTable, flexRender, getCoreRowModel, getPaginationRowModel, getSortedRowModel, getFilteredRowModel } from "@tanstack/react-table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "../components/ui/dialog";
import { Badge } from "../components/ui/badge";
import { DataTableFacetedFilter } from "../components/table/data-table-faceted-filter";

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
          statusClass = "bg-red-100 text-red-600";
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
            className={`inline-block px-3 py-[2px] rounded-2xl ${statusClass} text-xs ml-10px`}
          >
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
  },
  {
    id: "cancel",
    header: "",
    cell: ({ row }) => {
      if (row.original.status === "pending") {
        return (
          <Button
            onClick={() => row.original.cancelOrder(row.original._id)}
            className="w-full text-xs text-red-600 bg-red-100 hover:bg-red-200"
          >
            Cancel Order
          </Button>
        );
      }
      return null;
    },
  }
];

const TouristOrdersTable = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const { toast } = useToast();

  const fetchOrders = async (userID) => {
    try {
      const response = await axios.get(`http://localhost:8000/getMyOrders/${userID}`);
      const ordersWithOpenDetails = response.data.orders.map(order => ({
        ...order,
        openOrderDetails: () => setSelectedOrder(order),
        cancelOrder: (orderId) => handleCancelOrder(orderId)
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

  const handleCancelOrder = async (orderId) => {
    try {
      const response = await axios.delete(`http://localhost:8000/cancel-order/${orderId}`);
      if (response.status === 200) {
        // Update the order status to "cancelled"
        setOrders(prevOrders => prevOrders.map(order => 
          order._id === orderId ? { ...order, status: "cancelled" } : order
        ));
        
        // Show success popup
        toast({
          title: "Success",
          description: "Order cancelled successfully.",
        });
      }
    } catch (error) {
      console.error("Error cancelling order:", error);
      toast({
        title: "Error",
        description: "Could not cancel the order.",
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
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
  });

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <>
      <div className="mb-4 flex justify-end">
        <DataTableFacetedFilter
          column={table.getColumn("status")}
          title="Order Status"
          options={[
            { label: "Pending", value: "pending" },
            { label: "Shipped", value: "shipped" },
            { label: "Delivered", value: "delivered" },
            { label: "Cancelled", value: "cancelled" },
          ]}
        />
      </div>
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

