"use client";

import { Badge } from "../ui/badge";
import { Checkbox } from "../ui/checkbox";

import { labels, priorities, statuses } from "./docs";
import { DataTableColumnHeader } from "./docs-table-column-header";
import { DataTableRowActions } from "./docs-table-row-actions";

export const columns = [
  {
    accessorKey: "Username",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Username" />
    ),
    cell: ({ row }) => (
      <div className="w-[80px]" style={{ paddingLeft: "5.8vw" }}>
        {row.original.Owner.Username}
      </div>
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "Fullname",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Full name" />
    ),
    cell: ({ row }) => (
      <div className="w-[80px]">{row.original.Owner.FullName}</div>
    ),
    enableSorting: true,
    enableHiding: true,
  },
  {
    accessorKey: "Email",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Email" />
    ),
    cell: ({ row }) => (
      <div className="w-[80px]" style={{ paddingRight: "8vw" }}>{row.original.Owner.Email}</div>
    ),
    enableSorting: true,
    enableHiding: true,
  },
  {
    accessorKey: "role",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Role" />
    ),
    cell: ({ row }) => {
      const priority = priorities.find(
        (priority) => priority.value === row.getValue("role")
      );

      if (!priority) {
        return null;
      }

      return (
        <div className="flex items-center">
          <Badge
            color={
              (priority.label === "Seller" && "destructive") ||
              (priority.label === "Advertiser" && "info") ||
              (priority.label === "TourGuide" && "warning")
            }
          >
            {priority.label}
          </Badge>
        </div>
      );
    },
    filterFn: (row, id, value) => {
      return value.includes(row.getValue(id));
    },
  },
  {
    id: "actions",
    cell: ({ row }) => <DataTableRowActions row={row} />,
  },
];
