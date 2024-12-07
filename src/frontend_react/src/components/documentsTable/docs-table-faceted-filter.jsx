import * as React from "react";
import { DropdownMenuTrigger } from "@radix-ui/react-dropdown-menu";
import { Plus  , Filter} from "lucide-react";
import { Button } from "../ui/button";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from "../ui/dropdown-menu";
import { Badge } from "../ui/badge";
import { Separator } from "../ui/separator";

export function DataTableFacetedFilter({ column, title, options }) {
  const facets = column?.getFacetedUniqueValues();
  const [selectedValues, setSelectedValues] = React.useState(
    new Set(column?.getFilterValue() || [])
  );

  // Handle selection or deselection of filters
  const handleSelect = (value) => {
    const newSelectedValues = new Set(selectedValues);
    if (newSelectedValues.has(value)) {
      newSelectedValues.delete(value);
    } else {
      newSelectedValues.add(value);
    }
    setSelectedValues(newSelectedValues);

    // Update the filter in the column
    const filterValues = Array.from(newSelectedValues);
    column?.setFilterValue(filterValues.length ? filterValues : undefined);
  };

  // Handle the reset of selected values
  const handleResetFilters = () => {
    setSelectedValues(new Set());
    column?.setFilterValue(undefined);
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="sm" className="ltr:ml-2 rtl:mr-2 h-8">
          <Filter className="ltr:mr-2 rtl:ml-2 h-4 w-4" />
          {title}
          {selectedValues.size > 0 && (
            <>
              <Separator orientation="vertical" className="mx-2 h-4" />
              <Badge
                color="secondary"
                className="rounded-sm px-1 font-normal lg:hidden"
              >
                {selectedValues.size}
              </Badge>
              <div className="hidden space-x-1 rtl:space-x-reverse lg:flex">
                {selectedValues.size > 2 ? (
                  <Badge
                    color="secondary"
                    className="rounded-sm px-1 font-normal"
                  >
                    {selectedValues.size} selected
                  </Badge>
                ) : (
                  options
                    .filter((option) => selectedValues.has(option.value))
                    .map((option) => (
                      <Badge
                        color="secondary"
                        key={option.value}
                        className="rounded-sm px-1 font-normal"
                      >
                        {option.label}
                      </Badge>
                    ))
                )}
              </div>
            </>
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-[200px]">
        <DropdownMenuLabel>Filter by {title}</DropdownMenuLabel>
        <DropdownMenuSeparator />
        {options.map((option) => {
          const isSelected = selectedValues.has(option.value);
          return (
            <DropdownMenuCheckboxItem
              key={option.value}
              checked={isSelected}
              onCheckedChange={() => handleSelect(option.value)}
            >
              {option.label}
              {facets?.get(option.value) && (
                <span className="ltr:ml-auto rtl:mr-auto text-xs text-muted-foreground">
                  ({facets.get(option.value)})
                </span>
              )}
            </DropdownMenuCheckboxItem>
          );
        })}
        {selectedValues.size > 0 && (
          <>
            <DropdownMenuSeparator />
            <DropdownMenuCheckboxItem onCheckedChange={handleResetFilters}>
              Clear filters
            </DropdownMenuCheckboxItem>
          </>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
