"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Calendar, ChevronLeft, ChevronRight, Search, Filter } from "lucide-react";
import Link from "next/link";
import { MultiSelect } from "./ui/multi-select";
import { NewFilterProps } from "@/types/filterProps";
import data from "@/data/08-189.json"; // Import your dataset

export default function Sidebar({
    onFiltersChange,
    minYear,
    maxYear,
}: {
    onFiltersChange: (filters: NewFilterProps) => void;
    minYear: number;
    maxYear: number;
}) {
    const router = useRouter();
    const searchParams = useSearchParams();

    // States for applied filters
    const [appliedFilters, setAppliedFilters] = useState<NewFilterProps>({
        Search: searchParams.get("search") || "",
        From: searchParams.get("from") || minYear.toString(),
        To: searchParams.get("to") || maxYear.toString(),
        Strategy: searchParams.get("strategy")?.split(",") || [],
        Category: searchParams.get("category")?.split(",") || [],
        Report: searchParams.get("report")?.split(",") || [],
    });

    // States for user input
    const [search, setSearch] = useState(appliedFilters.Search);
    const [yearRange, setYearRange] = useState({
        From: appliedFilters.From,
        To: appliedFilters.To,
    });
    const [selectedStrategies, setSelectedStrategies] = useState<string[]>(appliedFilters.Strategy);
    const [selectedCategories, setSelectedCategories] = useState<string[]>(appliedFilters.Category);
    const [selectedReports, setSelectedReports] = useState<string[]>(appliedFilters.Report);

    const [strategies, setStrategies] = useState<string[]>([]);
    const [categories, setCategories] = useState<string[]>([]);
    const [reports, setReports] = useState<string[]>([]);

    const [isCollapsed, setIsCollapsed] = useState(false);

    // Extract unique values for Strategy, Category, and Report
    useEffect(() => {
        const uniqueStrategies = Array.from(new Set(data.map((item) => item.Strategy)));
        const uniqueCategories = Array.from(new Set(data.flatMap((item) => item.Category)));
        const uniqueReports = Array.from(new Set(data.map((item) => item.Report)));

        setStrategies(uniqueStrategies);
        setCategories(uniqueCategories);
        setReports(uniqueReports);
    }, []);

    // Update Query Params
    const updateQueryParams = useCallback(
        (filters: NewFilterProps) => {
            const query = new URLSearchParams();
            if (filters.Search) query.set("search", filters.Search);
            if (filters.From) query.set("from", filters.From);
            if (filters.To) query.set("to", filters.To);
            if (filters.Strategy.length > 0) query.set("strategy", filters.Strategy.join(","));
            if (filters.Category.length > 0) query.set("category", filters.Category.join(","));
            if (filters.Report.length > 0) query.set("report", filters.Report.join(","));

            router.push(`?${query.toString()}`);
        },
        [router]
    );

    // Apply Filters
    const applyFilters = useCallback(() => {
        const filters: NewFilterProps = {
            Search: search,
            From: yearRange.From,
            To: yearRange.To,
            Strategy: selectedStrategies,
            Category: selectedCategories,
            Report: selectedReports,
        };

        setAppliedFilters(filters);
        updateQueryParams(filters);
        onFiltersChange(filters);
    }, [search, yearRange, selectedStrategies, selectedCategories, selectedReports, updateQueryParams, onFiltersChange]);

    // Reset Filters
    const resetFilters = useCallback(() => {
        const defaultFilters: NewFilterProps = {
            Search: "",
            From: minYear.toString(),
            To: maxYear.toString(),
            Strategy: [],
            Category: [],
            Report: [],
        };

        setSearch(defaultFilters.Search);
        setYearRange({ From: defaultFilters.From, To: defaultFilters.To });
        setSelectedStrategies([]);
        setSelectedCategories([]);
        setSelectedReports([]);

        setAppliedFilters(defaultFilters);
        updateQueryParams(defaultFilters);
        onFiltersChange(defaultFilters);
    }, [minYear, maxYear, updateQueryParams, onFiltersChange]);

    // Sync Query Params on Initial Load
    useEffect(() => {
        onFiltersChange(appliedFilters);
    }, [appliedFilters, onFiltersChange]);

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
                            <Link href={"/"}>Map Analysis</Link>
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

                    {/* Year Range Selector */}
                    <div>
                        <label className="block text-sm font-medium mb-2 flex items-center">
                            <Calendar className="mr-2 w-4 h-4" /> Year Range
                        </label>
                        <div className="flex space-x-4">
                            <Input
                                type="number"
                                min={minYear}
                                max={maxYear}
                                value={yearRange.From}
                                onChange={(e) => setYearRange({ ...yearRange, From: e.target.value })}
                                placeholder="From"
                            />
                            <Input
                                type="number"
                                min={minYear}
                                max={maxYear}
                                value={yearRange.To}
                                onChange={(e) => setYearRange({ ...yearRange, To: e.target.value })}
                                placeholder="To"
                            />
                        </div>
                    </div>

                    {/* Strategy Selector */}
                    <div>
                        <label className="block text-sm font-medium mb-2 flex items-center">
                            <Filter className="mr-2 w-4 h-4" /> Strategies
                        </label>
                        <MultiSelect
                            options={strategies.map((strategy) => ({ value: strategy, label: strategy.length <= 30 ? strategy : strategy.substring(0, 25) + "..." }))}
                            onValueChange={setSelectedStrategies}
                            defaultValue={selectedStrategies}
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
                            options={categories.map((category) => ({ value: category, label: category.length <= 30 ? category : category.substring(0, 25) + "..." }))}
                            onValueChange={setSelectedCategories}
                            defaultValue={selectedCategories}
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
                            options={reports.map((report) => ({ value: report, label: report.length <= 30 ? report : report.substring(0, 25) + "..." }))}
                            onValueChange={setSelectedReports}
                            defaultValue={selectedReports}
                            value={selectedReports}
                            placeholder="Select reports"
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
