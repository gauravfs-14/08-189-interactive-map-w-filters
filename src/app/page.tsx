"use client";

import Sidebar from "../components/Sidebar";
import dynamic from "next/dynamic";
import { useState, useMemo, useCallback } from "react";
import { FilterProps } from "@/types/filterProps";
import data from "@/data/generated_dataset.json";

const MainContent = dynamic(() => import("../components/MainContent"), { ssr: false });

export default function Home() {
  // Calculate min and max years dynamically from the data
  const minYear = useMemo(() => Math.min(...data.map((item) => item.year)), []);
  const maxYear = useMemo(() => Math.max(...data.map((item) => item.year)), []);

  const [filters, setFilters] = useState<FilterProps>({
    search: "",
    from: minYear.toString(),
    to: maxYear.toString(),
    pills: [],
  });

  const handleFiltersChange = useCallback((newFilters: FilterProps) => {
    console.log("Updated Filters:", newFilters);
    setFilters(newFilters);
  }, []);

  // Filter the data based on the applied filters
  const filteredData = useMemo(() => {
    return data.filter((item) => {
      // Match the search query (case insensitive)
      const matchesSearch = filters.search
        ? item.name.toLowerCase().includes(filters.search.toLowerCase()) ||
        item.author.toLowerCase().includes(filters.search.toLowerCase())
        : true;

      // Match the year range
      const matchesYear =
        item.year >= parseInt(filters.from, 10) &&
        item.year <= parseInt(filters.to, 10);

      // Match the pills (if pills are set, match any of them)
      const matchesPills =
        filters.pills.length > 0
          ? filters.pills.some((pill) =>
            item.category.toLowerCase().includes(pill.toLowerCase())
          )
          : true;

      // Combine all conditions
      return matchesSearch && matchesYear && matchesPills;
    });
  }, [filters]);

  return (
    <div className="flex h-screen w-full">
      <Sidebar
        onFiltersChange={handleFiltersChange}
        minYear={minYear}
        maxYear={maxYear}
      />
      <MainContent data={filteredData} />
    </div>
  );
}
