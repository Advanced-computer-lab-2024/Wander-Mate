import { useEffect, useRef, useState } from "react";
import * as DropdownMenuPrimitive from "@radix-ui/react-dropdown-menu";
import { ChevronDown, Check } from "lucide-react";

const SearchableDropdown = ({
  options,
  label,
  id,
  selectedVal,
  handleChange,
}) => {
  const [query, setQuery] = useState("");
  const [isOpen, setIsOpen] = useState(false);

  const inputRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (inputRef.current && !inputRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, []);

  const selectOption = (option) => {
    setQuery("");
    handleChange(option[label]);
    setIsOpen(false);
  };

  const filterOptions = (options) => {
    return options.filter((option) =>
      option[label].toLowerCase().includes(query.toLowerCase())
    );
  };

  const getDisplayValue = () => {
    if (query) return query;
    if (selectedVal) return selectedVal;
    return "";
  };

  return (
    <div className="dropdown">
      <DropdownMenuPrimitive.Root open={isOpen} onOpenChange={setIsOpen}>
        <DropdownMenuPrimitive.Trigger asChild>
          <div className="control">
            <input
              ref={inputRef}
              type="text"
              value={getDisplayValue()}
              name="searchTerm"
              onChange={(e) => {
                setQuery(e.target.value);
                handleChange(null);
              }}
              onClick={() => setIsOpen(!isOpen)}
              placeholder="Search..."
            />
            <ChevronDown className="arrow" />
          </div>
        </DropdownMenuPrimitive.Trigger>

        <DropdownMenuPrimitive.Portal>
          <DropdownMenuPrimitive.Content
            sideOffset={4}
            className="z-[999] min-w-[8rem] overflow-hidden rounded-md bg-popover p-1 text-popover-foreground shadow-md"
          >
            {filterOptions(options).map((option, index) => (
              <DropdownMenuPrimitive.Item
                key={`${id}-${index}`}
                onClick={() => selectOption(option)}
                className={`option ${
                  option[label] === selectedVal ? "selected" : ""
                }`}
              >
                {option[label]}
                {option[label] === selectedVal && (
                  <Check className="ml-auto h-4 w-4" />
                )}
              </DropdownMenuPrimitive.Item>
            ))}
          </DropdownMenuPrimitive.Content>
        </DropdownMenuPrimitive.Portal>
      </DropdownMenuPrimitive.Root>
    </div>
  );
};

export default SearchableDropdown;
