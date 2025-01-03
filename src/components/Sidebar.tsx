"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Calendar, ChevronLeft, ChevronRight, Search } from "lucide-react";
import Link from "next/link";
import { FilterProps } from "@/types/filterProps";

export default function Sidebar({
    onFiltersChange,
    minYear,
    maxYear,
}: {
    onFiltersChange: (filters: FilterProps) => void;
    minYear: number;
    maxYear: number;
}) {
    const router = useRouter();
    const searchParams = useSearchParams();

    // States for applied filters
    const [appliedFilters, setAppliedFilters] = useState<FilterProps>({
        search: searchParams.get("search") || "",
        from: searchParams.get("from") || minYear.toString(),
        to: searchParams.get("to") || maxYear.toString(),
        pills: searchParams.get("pills")?.split(",") || [],
    });

    // States for user input
    const [search, setSearch] = useState(appliedFilters.search);
    const [yearRange, setYearRange] = useState({
        from: appliedFilters.from,
        to: appliedFilters.to,
    });
    const [selectedPills, setSelectedPills] = useState<string[]>(appliedFilters.pills);

    const [isCollapsed, setIsCollapsed] = useState(false);

    // Update Query Params
    const updateQueryParams = useCallback(
        (filters: FilterProps) => {
            const query = new URLSearchParams();
            if (filters.search) query.set("search", filters.search);
            if (filters.from) query.set("from", filters.from);
            if (filters.to) query.set("to", filters.to);
            if (filters.pills.length > 0) query.set("pills", filters.pills.join(","));

            router.push(`?${query.toString()}`);
        },
        [router]
    );

    // Apply Filters
    const applyFilters = useCallback(() => {
        const filters: FilterProps = {
            search,
            from: yearRange.from,
            to: yearRange.to,
            pills: selectedPills,
        };

        setAppliedFilters(filters);
        updateQueryParams(filters);
        onFiltersChange(filters);
    }, [search, yearRange, selectedPills, updateQueryParams, onFiltersChange]);

    // Reset Filters
    const resetFilters = useCallback(() => {
        const defaultFilters: FilterProps = {
            search: "",
            from: minYear.toString(),
            to: maxYear.toString(),
            pills: [],
        };

        setSearch(defaultFilters.search);
        setYearRange({ from: defaultFilters.from, to: defaultFilters.to });
        setSelectedPills(defaultFilters.pills);

        setAppliedFilters(defaultFilters);
        updateQueryParams(defaultFilters);
        onFiltersChange(defaultFilters);
    }, [minYear, maxYear, updateQueryParams, onFiltersChange]);

    // Handle Pill Selection
    const togglePill = useCallback(
        (pill: string) => {
            setSelectedPills((prevPills) =>
                prevPills.includes(pill)
                    ? prevPills.filter((item) => item !== pill)
                    : [...prevPills, pill]
            );
        },
        []
    );

    // Sync Query Params on Initial Load
    useEffect(() => {
        onFiltersChange(appliedFilters);
    }, [appliedFilters, onFiltersChange]);

    return (
        <div
            className={`bg-white text-gray-800 border-r border-gray-200 p-4 transition-all duration-300 ${isCollapsed ? "w-16" : "w-72"
                } h-screen flex-shrink-0 relative`}
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
                                value={yearRange.from}
                                onChange={(e) =>
                                    setYearRange({
                                        ...yearRange,
                                        from: e.target.value,
                                    })
                                }
                                placeholder="From"
                            />
                            <Input
                                type="number"
                                min={minYear}
                                max={maxYear}
                                value={yearRange.to}
                                onChange={(e) =>
                                    setYearRange({
                                        ...yearRange,
                                        to: e.target.value,
                                    })
                                }
                                placeholder="To"
                            />
                        </div>
                    </div>

                    {/* Pill-based Selectors */}
                    <div>
                        <label className="block text-sm font-medium mb-2">Select Categories</label>
                        <div className="flex flex-wrap gap-2">
                            {["Environment", "Urban", "Technology"].map((pill) => (
                                <Button
                                    key={pill}
                                    variant={selectedPills.includes(pill) ? "default" : "outline"}
                                    className="rounded-full"
                                    onClick={() => togglePill(pill)}
                                >
                                    {pill}
                                </Button>
                            ))}
                        </div>
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
