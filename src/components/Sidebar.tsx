"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Calendar, ChevronLeft, ChevronRight, Search, Filter } from "lucide-react";
import Link from "next/link";
import { MultiSelect } from "./ui/multi-select";
import { NewFilterProps } from "@/types/filterProps";
import data from "@/data/08-189_updated_larger_offset.json"; // Import your dataset

export default function Sidebar({
    onFiltersChange,
}: {
    onFiltersChange: (filters: NewFilterProps) => void;
}) {
    const router = useRouter();
    const searchParams = useSearchParams();

    // States for applied filters
    const [appliedFilters, setAppliedFilters] = useState<NewFilterProps>({
        Search: searchParams.get("search") || "",
        Strategy: searchParams.get("strategy")?.split(",") || [],
        Category: searchParams.get("category")?.split(",") || [],
        Report: searchParams.get("report")?.split(",") || [],
        KeyAreas: searchParams.get("keyAreas")?.split(",") || [],
    });

    // States for user input
    const [search, setSearch] = useState(appliedFilters.Search);
    const [selectedStrategies, setSelectedStrategies] = useState<string[]>(
        (searchParams.get("strategy")?.split(",")) || []
    );
    const [selectedCategories, setSelectedCategories] = useState<string[]>(
        (searchParams.get("category")?.split(",")) || []
    );
    const [selectedReports, setSelectedReports] = useState<string[]>(
        (searchParams.get("report")?.split(",")) || []
    );
    const [selectedKeyAreas, setSelectedKeyAreas] = useState<string[]>(
        (searchParams.get("keyAreas")?.split(",")) || []
    );


    const [strategies, setStrategies] = useState<string[]>([]);
    const [categories, setCategories] = useState<string[]>([]);
    const [reports, setReports] = useState<string[]>([]);
    const [keyAreas, setKeyAreas] = useState<string[]>([]);

    const [isCollapsed, setIsCollapsed] = useState(false);

    // Extract unique values for Strategy, Category, and Report
    useEffect(() => {
        const uniqueStrategies = Array.from(new Set(data.map((item) => item.Strategy)));
        const uniqueCategories = Array.from(new Set(data.flatMap((item) => item.Category)));
        const uniqueReports = Array.from(new Set(data.map((item) => item.Report)));
        const uniqueKeyAreas = Array.from(new Set(data.flatMap((item) => item.KeyAreas)));

        setStrategies(uniqueStrategies);
        setCategories(uniqueCategories);
        setReports(uniqueReports);
        setKeyAreas(uniqueKeyAreas);
    }, []);

    // Update Query Params
    const updateQueryParams = useCallback(
        (filters: NewFilterProps) => {
            const query = new URLSearchParams();
            if (filters.Search) query.set("search", filters.Search);
            if (filters.Strategy.length > 0) query.set("strategy", filters.Strategy.join(","));
            if (filters.Category.length > 0) query.set("category", filters.Category.join(","));
            if (filters.Report.length > 0) query.set("report", filters.Report.join(","));
            if (filters.KeyAreas.length > 0) query.set("keyAreas", filters.KeyAreas.join(","));

            router.push(`?${query.toString()}`);
        },
        [router]
    );

    // Apply Filters
    const applyFilters = useCallback(() => {
        const filters: NewFilterProps = {
            Search: search,
            Strategy: selectedStrategies,
            Category: selectedCategories,
            Report: selectedReports,
            KeyAreas: selectedKeyAreas,
        };

        setAppliedFilters(filters);
        updateQueryParams(filters);
        onFiltersChange(filters);
    }, [search, selectedStrategies, selectedCategories, selectedReports, selectedKeyAreas, updateQueryParams, onFiltersChange]);

    // Reset Filters
    const resetFilters = useCallback(() => {
        setSearch("");
        setSelectedStrategies([]); // Ensure these are arrays
        setSelectedCategories([]);
        setSelectedReports([]);
        setSelectedKeyAreas([]);

        const defaultFilters: NewFilterProps = {
            Search: "",
            Strategy: [],
            Category: [],
            Report: [],
            KeyAreas: [],
        };

        setAppliedFilters(defaultFilters);
        updateQueryParams(defaultFilters);
        onFiltersChange(defaultFilters);
    }, [updateQueryParams, onFiltersChange]);


    return (
        <div
            className={`bg-white text-gray-800 border-r border-gray-200 p-4 transition-all duration-300 ${isCollapsed ? "w-16" : "w-72"} h-screen flex-shrink-0 relative`}
        >
            {/* Collapse Button */}
            <Button
                variant="ghost"
                size="sm"
                className="absolute top-4 right-4 text-gray-500 hover:text-gray-800"
                onClick={() => setIsCollapsed(!isCollapsed)}
            >
                {isCollapsed ? <ChevronRight /> : <ChevronLeft />}
            </Button>

            {/* Title/Logo */}
            {!isCollapsed && (
                <div className="mb-6 flex items-center">
                    <div>
                        <h1 className="text-2xl">
                            <Link href={"/"}>08-189: Viz Tool</Link>
                        </h1>
                        <p className="text-sm text-gray-500">
                            A tool for visualization and analysis.
                        </p>
                    </div>
                </div>
            )}

            {/* Filters */}
            {!isCollapsed && (
                <div className="space-y-6">
                    {/* Search Box */}
                    <div>
                        <label className="block text-sm font-medium mb-2 flex items-center">
                            <Search className="mr-2 w-4 h-4" /> Search
                        </label>
                        <Input
                            placeholder="Search..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="w-full"
                        />
                    </div>


                    {/* Strategy Selector */}
                    <div>
                        <label className="block text-sm font-medium mb-2 flex items-center">
                            <Filter className="mr-2 w-4 h-4" /> Strategies
                        </label>
                        <MultiSelect
                            options={strategies.map((strategy) => ({ value: strategy, label: strategy }))}
                            onValueChange={setSelectedStrategies}
                            value={selectedStrategies}
                            placeholder="Select strategies"
                            maxCount={3}
                        />
                    </div>

                    {/* Category Selector */}
                    <div>
                        <label className="block text-sm font-medium mb-2 flex items-center">
                            <Filter className="mr-2 w-4 h-4" /> Categories
                        </label>
                        <MultiSelect
                            options={categories.map((category) => ({ value: category, label: category }))}
                            onValueChange={setSelectedCategories}
                            value={selectedCategories}
                            placeholder="Select categories"
                            maxCount={3}
                        />
                    </div>

                    {/* Report Selector */}
                    <div>
                        <label className="block text-sm font-medium mb-2 flex items-center">
                            <Filter className="mr-2 w-4 h-4" /> Reports
                        </label>
                        <MultiSelect
                            options={reports.map((report) => ({ value: report, label: report }))}
                            onValueChange={setSelectedReports}
                            value={selectedReports}
                            placeholder="Select reports"
                            maxCount={3}
                        />
                    </div>

                    {/* Key Areas Selector */}
                    <div>
                        <label className="block text-sm font-medium mb-2 flex items-center">
                            <Filter className="mr-2 w-4 h-4" /> Key Areas
                        </label>
                        <MultiSelect
                            options={keyAreas.map((keyArea) => ({ value: keyArea, label: keyArea }))}
                            onValueChange={setSelectedKeyAreas}
                            value={selectedKeyAreas}
                            placeholder="Select key areas"
                            maxCount={3}
                        />
                    </div>

                    {/* Reset and Apply Buttons */}
                    <div className="space-y-4">
                        <Button variant="default" className="w-full" onClick={applyFilters}>
                            Apply Filters
                        </Button>
                        <Button variant="outline" className="w-full" onClick={resetFilters}>
                            Reset Filters
                        </Button>
                    </div>
                </div>
            )}
        </div>
    );
}
