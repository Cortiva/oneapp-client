"use client";

import { useState, useEffect, useRef } from "react";

interface DropdownProps {
  items: { value: string; label: string }[];
  placeholder?: string;
  label?: string;
  onSelect: (value: string) => void;
}

export default function SearchableDropdown({
  items,
  placeholder = "Select an item...",
  label,
  onSelect,
}: DropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [selectedLabel, setSelectedLabel] = useState("");
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Filter items based on search input
  const filteredItems = items.filter((item) =>
    item.label.toLowerCase().includes(search.toLowerCase())
  );

  // Handle clicks outside to close dropdown
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Handle item selection
  const handleSelect = (item: { value: string; label: string }) => {
    setSelectedLabel(item.label);
    setSearch("");
    setIsOpen(false);
    onSelect(item.value); // Pass value to parent
  };

  return (
    <div className={" my-7"}>
      {label && (
        <label
          htmlFor={label}
          className="block leading-6 text-[#545454] dark:text-[#CBD5E1] text-[13px]"
        >
          {label}
        </label>
      )}
      <div className="relative w-full" ref={dropdownRef}>
        {/* Dropdown Toggle */}
        <div
          className="flex items-center justify-between w-full mt-2 p-4 text-[#545454] dark:text-[#CBD5E1] bg-light-bg dark:bg-dark-bg rounded-[14px] cursor-pointer drop-shadow-xs transition-all duration-200 ease-in-out focus:drop-shadow-sm focus:border-primary-300 dark:focus:border-primary-50 placeholder:text-slate-300 dark:placeholder:text-slate-600"
          onClick={() => setIsOpen(!isOpen)}
        >
          <span>{selectedLabel || placeholder}</span>
          <svg
            className={`w-5 h-5 transition-transform ${
              isOpen ? "rotate-180" : ""
            }`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M19 9l-7 7-7-7"
            />
          </svg>
        </div>

        {/* Dropdown Menu */}
        {isOpen && (
          <div className="absolute z-10 w-full mt-1 text-[#545454] dark:text-[#CBD5E1] bg-light-bg dark:bg-dark-bg rounded-[14px] shadow-lg max-h-60 overflow-y-auto">
            {/* Search Input */}
            <div className="p-2">
              <input
                type="text"
                className="w-full px-3 py-2 text-[#545454] dark:text-[#CBD5E1] border bg-light-card dark:bg-dark-card focus:outline-none focus:ring-1 focus:ring-primary rounded-[14px]"
                placeholder="Search..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>

            {/* Items List */}
            <ul className="divide-y divide-light-card dark:divide-dark-card">
              {filteredItems.length > 0 ? (
                filteredItems.map((item) => (
                  <li
                    key={item.value}
                    className="px-4 py-3 text-[#545454] dark:text-[#CBD5E1] hover:bg-blue-50 cursor-pointer"
                    onClick={() => handleSelect(item)}
                  >
                    {item.label}
                  </li>
                ))
              ) : (
                <li className="px-4 py-2 text-gray-500">No results found</li>
              )}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}
