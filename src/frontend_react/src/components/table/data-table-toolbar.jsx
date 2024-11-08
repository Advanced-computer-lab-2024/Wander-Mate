"use client";
import { X } from "lucide-react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { DataTableViewOptions } from "./data-table-view-options";
import { statuses } from "./data";
import { DataTableFacetedFilter } from "./data-table-faceted-filter";
import { useState } from "react";

export function DataTableToolbar({ table }) {
  const isFiltered = table.getState().columnFilters.length > 0;

  const [resetKey, setResetKey] = useState(0); // Add a state to force re-render

  const handleResetFilters = () => {
    table.resetColumnFilters(); // Reset column filters on the table
    setResetKey((prevKey) => prevKey + 1); // Update the resetKey to force re-render of DataTableFacetedFilter
  };

  return (
    <div className="flex flex-1 flex-wrap items-center gap-2">
      <Input
        placeholder="Filter By User..."
        value={table.getColumn("id")?.getFilterValue() ?? ""}
        onChange={(event) =>
          table.getColumn("id")?.setFilterValue(event.target.value)
        }
        className="h-8 min-w-[200px] max-w-sm"
      />

      {table.getColumn("Status") && (
        <DataTableFacetedFilter
          key={resetKey} // Key will change, causing a re-render of this component
          column={table.getColumn("Status")}
          title="Status"
          options={statuses}
        />
      )}

      {isFiltered && (
        <Button
          variant="outline"
          onClick={handleResetFilters} // Reset filters when button is clicked
          className="h-8 px-2 lg:px-3"
        >
          Reset
          <X className="ltr:ml-2 rtl:mr-2 h-4 w-4" />
        </Button>
      )}
      <DataTableViewOptions table={table} />
    </div>
  );
}
