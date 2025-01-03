"use client";

import Sidebar from "../components/Sidebar";
import dynamic from "next/dynamic";
import { useState, useMemo, useCallback } from "react";
import { NewFilterProps } from "@/types/filterProps";
import { NewDataProps } from "@/types/dataProp";
import data from "@/data/08-189_updated_larger_offset.json";

const MainContent = dynamic(() => import("../components/MainContent"), { ssr: false });

export default function Home() {

  const [filters, setFilters] = useState<NewFilterProps>({
    Search: "",
    Strategy: [],
    Category: []
  });

  const handleFiltersChange = useCallback((newFilters: NewFilterProps) => {
    console.log("Updated Filters:", newFilters);
    setFilters(newFilters);
  }, []);

  // Filter the data based on the applied filters
  const filteredData = useMemo(() => {
    return data.filter((item: NewDataProps) => {
      // Match the search query (case insensitive)
      const matchesSearch = filters.Search
        ? item.Details.toLowerCase().includes(filters.Search.toLowerCase()) ||
        item.Strategy.toLowerCase().includes(filters.Search.toLowerCase()) || item.Report.toLowerCase().includes(filters.Search.toLowerCase()) || item.KeyAreas.some((keyArea) => keyArea.toLowerCase().includes(filters.Search.toLowerCase())) || item.Category.some((category) => category.toLowerCase().includes(filters.Search.toLowerCase()))
        : true;

      // Match the strategy (if strategies are set, match any of them)
      const matchesStrategy =
        filters.Strategy.length > 0
          ? filters.Strategy.some((strategy) =>
            item.Strategy.toLowerCase().includes(strategy.toLowerCase())
          )
          : true;

      // Match the categories (if categories are set, match any of them)
      const matchesCategory =
        filters.Category.length > 0
          ? filters.Category.some((category) =>
            item.Category.some((itemCategory) =>
              itemCategory.toLowerCase().includes(category.toLowerCase())
            )
          )
          : true;

      // Combine all conditions
      return (
        matchesSearch &&
        matchesStrategy &&
        matchesCategory
      );
    });
  }, [filters]);

  return (
    <div className="flex h-screen w-full">
      <Sidebar
        onFiltersChange={handleFiltersChange}
      />
      <MainContent data={filteredData} />
    </div>
  );
}
