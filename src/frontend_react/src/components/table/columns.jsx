"use client";

import { Badge } from "../ui/badge";
import { Checkbox } from "../ui/checkbox";

import { labels, priorities, statuses } from "./data";
import { DataTableColumnHeader } from "./data-table-column-header";
import { DataTableRowActions } from "./data-table-row-actions";


export const columns = [
  {
    accessorKey: "userName",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Username" />
    ),
    cell: ({ row }) => (
      <div className="w-[80px]" style={{ paddingLeft: "5.8vw" }}>
        {row.getValue("userName")}
      </div>
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "Title",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Complaint title" />
    ),
    cell: ({ row }) => <div className="w-[80px]">{row.getValue("Title")}</div>,
    enableSorting: true,
    enableHiding: true,
  },
  {
    accessorKey: "Status",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Status" />
    ),
    cell: ({ row }) => {
      const Status = statuses.find(
        (Status) => Status.value === row.getValue("Status")
      );

      if (!Status) {
        return null;
      }

      return (
        <div className="flex w-[100px] items-center">
          {Status.icon && (
            <Status.icon className="ltr:mr-2 rtl:ml-2 h-4 w-4 text-muted-foreground" />
          )}
          <span>{Status.label}</span>
        </div>
      );
    },
    filterFn: (row, id, value) => {
      return value.includes(row.getValue(id));
    },
  },

  {
    accessorKey: "Date",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Date" />
    ),
    cell: ({ row }) => <div className="w-[80px]">{row.getValue("Date")}</div>,
    enableSorting: true,
    enableHiding: true,
  },
  // {
  //   accessorKey: "priority",
  //   header: ({ column }) => (
  //     <DataTableColumnHeader column={column} title="Priority" />
  //   ),
  //   cell: ({ row }) => {
  //     const priority = priorities.find(
  //       (priority) => priority.value === row.getValue("priority")
  //     );

  //     if (!priority) {
  //       return null;
  //     }

  //     return (
  //       <div className="flex items-center">
  //         {priority.icon && (
  //           <priority.icon className="ltr:mr-2 rtl:ml-2 h-4 w-4 text-muted-foreground" />
  //         )}
  //         <Badge
  //           color={
  //             (priority.label === "High" && "destructive") ||
  //             (priority.label === "Medium" && "info") ||
  //             (priority.label === "Low" && "warning")
  //           }>
  //           {priority.label}
  //         </Badge>
  //       </div>
  //     );
  //   },
  //   filterFn: (row, id, value) => {
  //     return value.includes(row.getValue(id));
  //   },
  // },
  {
    id: "actions",
    cell: ({ row }) => <DataTableRowActions row={row} />,
  },
];
