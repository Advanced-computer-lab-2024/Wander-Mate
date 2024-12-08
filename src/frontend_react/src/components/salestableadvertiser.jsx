import React, { useState, useEffect } from "react";
import { ArrowUpDown, ChevronDown, MoreHorizontal } from "lucide-react";
import {
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";

import { Button } from "../components/ui/button";
import { Checkbox } from "../components/ui/checkbox";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../components/ui/dropdown-menu";
import { Input } from "../components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../components/ui/table";

import { Badge } from "../components/ui/badge";
import { Icon } from "@iconify/react";
import { cn } from "../lib/utils";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../components/ui/select";
import TourismGovernerFooter from "../components/tourismGovernerFooter";

const columns = [
  {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected() ||
          (table.getIsSomePageRowsSelected() && "indeterminate")
        }
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "attractionName",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          attraction Name
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => (
      <div className="font-medium">{row.getValue("attractionName")}</div>
    ),
  },
  {
    accessorKey: "totalBookings",
    header: "Total Bookings",
    cell: ({ row }) => (
      <div className="text-center">{row.getValue("totalBookings")}</div>
    ),
  },
  {
    accessorKey: "totalRevenue",
    header: () => <div className="text-right">Total Revenue</div>,
    cell: ({ row }) => {
      const amount = parseFloat(row.getValue("totalRevenue"));
      const formatted = new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD",
      }).format(amount);
      return <div className="text-right font-medium">{formatted}</div>;
    },
  },
  {
    accessorKey: "bookedDate",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Purchase Date
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      const date = new Date(row.getValue("bookedDate"));
      return <div className="text-center">{date.toLocaleDateString()}</div>;
    },
    filterFn: "dateFilter",
  },
  {
    id: "actions",
    enableHiding: false,
    cell: ({ row }) => {
      const itinerary = row.original;
      return (
        <div className="text-end">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <span className="sr-only">Open menu</span>
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Actions</DropdownMenuLabel>
              <DropdownMenuItem
                onClick={() =>
                  navigator.clipboard.writeText(itinerary.itineraryId)
                }
              >
                Copy Itinerary ID
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem>View itinerary details</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      );
    },
  },
];

export function SalesReportTableadvertiser() {
  const [data, setData] = useState([]);
  const [originalData, setOriginalData] = useState([]);
  const [sorting, setSorting] = useState([]);
  const [columnFilters, setColumnFilters] = useState([]);
  const [columnVisibility, setColumnVisibility] = useState({});
  const [rowSelection, setRowSelection] = useState({});
  const [selectedMonth, setSelectedMonth] = useState("all");
  const [selectedYear, setSelectedYear] = useState("all");

  useEffect(() => {
    const fetchSalesReport = async () => {
      const username = sessionStorage.getItem("username");
      try {
        const idResponse = await fetch(
          `http://localhost:8000/getID/${username}`
        );
        if (!idResponse.ok) throw new Error("Failed to get tourist ID");

        const { userID } = await idResponse.json();
        const response = await fetch(
          `http://localhost:8000/getAttractionSalesReport/${userID}`
        );
        const result = await response.json();

        if (response.ok) {
          const processedData = processData(result.salesReport);
          console.log(processedData);
          setData(processedData);
          setOriginalData(processedData);
        } else {
          console.error("Failed to fetch sales report:", result.message);
        }
      } catch (error) {
        console.error("Error fetching sales report:", error);
      }
    };

    fetchSalesReport();
  }, []);

  const processData = (salesReport) => {
    return salesReport.reduce((acc, item) => {
      const existingItem = acc.find(
        (i) => i.attractionId === item.attractionId
      ); // Group by productId
      if (existingItem) {
        // Add to existing product's data
        existingItem.attractions.push({
          totalBookings: item.totalBookings,
          revenue: item.totalRevenue,
          bookedDate: new Date(item.bookedDate).toISOString(),
        });
        existingItem.totalBookings += item.totalBookings;
        existingItem.totalRevenue += item.totalRevenue;
      } else {
        // Create a new entry for the product
        acc.push({
          attractionId: item.attractionId,
          attractionName: item.attractionName,
          totalBookings: item.totalBookings,
          totalRevenue: item.totalRevenue,
          attractions: [
            {
              totalBookings: item.totalBookings,
              revenue: item.totalRevenue,
              bookedDate: new Date(item.bookedDate).toISOString(),
            },
          ],
        });
      }
      return acc;
    }, []);
  };

  const applyDateFilter = (month, year) => {
    const filteredData = originalData
      .map((item) => {
        const filteredAttractions = (item.attractions || []).filter(
          (attraction) => {
            const date = new Date(attraction.bookedDate);
            const monthMatch =
              month === "all" || date.getMonth().toString() === month;
            const yearMatch =
              year === "all" || date.getFullYear().toString() === year;
            return monthMatch && yearMatch;
          }
        );

        if (filteredAttractions.length === 0) return null;

        const totalBookings = filteredAttractions.reduce(
          (sum, attraction) => sum + attraction.totalBookings,
          0
        );
        const totalRevenue = filteredAttractions.reduce(
          (sum, attraction) => sum + attraction.revenue,
          0
        );

        return {
          ...item,
          totalBookings,
          totalRevenue,
          attractions: filteredAttractions,
        };
      })
      .filter(Boolean);

    setData(filteredData);
  };

  const handleMonthChange = (value) => {
    setSelectedMonth(value);
    applyDateFilter(value, selectedYear);
  };

  const handleYearChange = (value) => {
    setSelectedYear(value);
    applyDateFilter(selectedMonth, value);
  };

  const columns = [
    {
      accessorKey: "attractionName",
      header: "attraction Name",
      size: 200,
      cell: ({ row }) => (
        <div className="capitalize">{row.getValue("attractionName")}</div>
      ),
    },
    {
      accessorKey: "totalBookings",
      header: "Total Bookings",
      size: 100,
      cell: ({ row }) => <div>{row.getValue("totalBookings")}</div>,
    },
    {
      accessorKey: "totalRevenue",
      header: "Revenue",
      size: 150,
      cell: ({ row }) => <div>${row.getValue("totalRevenue").toFixed(2)}</div>,
    },
  ];

  const table = useReactTable({
    data,
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

  const months = [
    { value: "all", label: "All Months" },
    { value: "0", label: "January" },
    { value: "1", label: "February" },
    { value: "2", label: "March" },
    { value: "3", label: "April" },
    { value: "4", label: "May" },
    { value: "5", label: "June" },
    { value: "6", label: "July" },
    { value: "7", label: "August" },
    { value: "8", label: "September" },
    { value: "9", label: "October" },
    { value: "10", label: "November" },
    { value: "11", label: "December" },
  ];

  const currentYear = new Date().getFullYear();
  const years = [
    { value: "all", label: "All Years" },
    ...Array.from({ length: 5 }, (_, i) => ({
      value: (currentYear - i).toString(),
      label: (currentYear - i).toString(),
    })),
  ];

  return (
    <>
      <h1 className="text-3xl font-bold mb-6 ml-6">Sales Report</h1>
      <div className="bg-white rounded-lg shadow-lg p-6">
        <div className="flex items-center flex-wrap gap-2 px-4">
          <Input
            placeholder="Search attraction names..."
            value={table.getColumn("attractionName")?.getFilterValue() ?? ""}
            onChange={(event) =>
              table
                .getColumn("attractionName")
                ?.setFilterValue(event.target.value)
            }
            className="max-w-sm min-w-[200px] h-10"
          />
          <Select value={selectedMonth} onValueChange={handleMonthChange}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Select Month" />
            </SelectTrigger>
            <SelectContent>
              {months.map((month) => (
                <SelectItem key={month.value} value={month.value}>
                  {month.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={selectedYear} onValueChange={handleYearChange}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Select Year" />
            </SelectTrigger>
            <SelectContent>
              {years.map((year) => (
                <SelectItem key={year.value} value={year.value}>
                  {year.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <DropdownMenu>
            <DropdownMenuTrigger asChild></DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              {table
                .getAllColumns()
                .filter((column) => column.getCanHide())
                .map((column) => {
                  return (
                    <DropdownMenuCheckboxItem
                      key={column.id}
                      className="capitalize"
                      checked={column.getIsVisible()}
                      onCheckedChange={(value) =>
                        column.toggleVisibility(!!value)
                      }
                    >
                      {column.id}
                    </DropdownMenuCheckboxItem>
                  );
                })}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
        <div>
          <Table className="table-fixed w-full">
            <TableHeader>
              {table.getHeaderGroups().map((headerGroup) => (
                <TableRow key={headerGroup.id}>
                  {headerGroup.headers.map((header) => {
                    return (
                      <TableHead key={header.id}>
                        {header.isPlaceholder
                          ? null
                          : flexRender(
                              header.column.columnDef.header,
                              header.getContext()
                            )}
                      </TableHead>
                    );
                  })}
                </TableRow>
              ))}
            </TableHeader>
            <TableBody>
              {table.getRowModel().rows?.length ? (
                table.getRowModel().rows.map((row) => (
                  <TableRow
                    key={row.id}
                    data-state={row.getIsSelected() && "selected"}
                  >
                    {row.getVisibleCells().map((cell) => (
                      <TableCell
                        key={cell.id}
                        className="text-center last:text-center"
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

        <div className="flex items-center flex-wrap gap-4 px-4 py-4">
          <div className="flex gap-2 items-center">
            <Button
              variant="outline"
              size="icon"
              onClick={() => table.previousPage()}
              disabled={!table.getCanPreviousPage()}
              className="h-8 w-8"
            >
              <Icon
                icon="heroicons:chevron-left"
                className="w-5 h-5 rtl:rotate-180"
              />
            </Button>

            {table.getPageOptions().map((page, pageIdx) => (
              <Button
                key={`sales-report-table-${pageIdx}`}
                onClick={() => table.setPageIndex(pageIdx)}
                variant={
                  pageIdx === table.getState().pagination.pageIndex
                    ? ""
                    : "outline"
                }
                className={cn("w-8 h-8")}
              >
                {page + 1}
              </Button>
            ))}

            <Button
              onClick={() => table.nextPage()}
              disabled={!table.getCanNextPage()}
              variant="outline"
              size="icon"
              className="h-8 w-8"
            >
              <Icon
                icon="heroicons:chevron-right"
                className="w-5 h-5 rtl:rotate-180"
              />
            </Button>
          </div>
        </div>
      </div>
      {/* <TourismGovernerFooter /> */}
    </>
  );
}

export default SalesReportTableadvertiser;
