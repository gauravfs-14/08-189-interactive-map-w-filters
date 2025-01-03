"use client";

import { useEffect } from "react";
import { LatLngBounds, LatLngExpression, divIcon } from "leaflet";
import ReactDOMServer from "react-dom/server";
import "leaflet/dist/leaflet.css";
import { NewDataProps } from "@/types/dataProp";
import Link from "next/link";
import { Button } from "./ui/button";
import { useToast } from "@/hooks/use-toast";
import { FaCircle } from "react-icons/fa";

import dynamic from "next/dynamic";

// Dynamically import Map components
const MapContainer = dynamic(() => import("react-leaflet").then((mod) => mod.MapContainer), { ssr: false });
const TileLayer = dynamic(() => import("react-leaflet").then((mod) => mod.TileLayer), { ssr: false });
const Marker = dynamic(() => import("react-leaflet").then((mod) => mod.Marker), { ssr: false });
const Popup = dynamic(() => import("react-leaflet").then((mod) => mod.Popup), { ssr: false });

type MapComponentProps = {
    data: NewDataProps[];
};

export default function MainContent({ data }: MapComponentProps) {
    const { toast } = useToast();

    // Set default bounds to the United States
    const defaultBounds = new LatLngBounds(
        [24.396308, -125.0], // Southwest corner of US
        [49.384358, -66.93457] // Northeast corner of US
    );

    // Show toast notification if no data matches
    useEffect(() => {
        if (data.length === 0) {
            toast({
                title: "No Match Found",
                description: "No data matches the current filters. Please try again.",
                variant: "destructive", // Change this if you have a custom variant
            });
        }
    }, [data.length, toast]);

    // Create a custom icon for markers
    const customMarkerIcon = (strategy: string) =>
        divIcon({
            html: ReactDOMServer.renderToString(
                <div
                    style={{
                        position: "relative",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        flexDirection: "column",
                    }}
                >
                    {/* Initials above the circle */}
                    <div
                        style={{
                            fontSize: "14px",
                            fontWeight: "bold",
                            color: "#ffffff",
                            textAlign: "center",
                            zIndex: 999,
                            position: "absolute"
                        }}
                    >
                        {strategy
                            .split(" ")
                            .slice(0, 2)
                            .map((word) => word[0]?.toUpperCase())
                            .join("")}
                    </div>
                    {/* Circle Icon */}
                    <FaCircle size={32} color="#884dee" />
                </div>
            ),
            className: "", // Prevent Leaflet's default styling
            iconSize: [32, 42], // Adjust height to accommodate initials
            iconAnchor: [16, 42], // Anchor adjusted for the taller icon
        });


    // Calculate bounds to fit all markers if data is available
    const bounds = data.length
        ? data.reduce((bounds, location) => {
            bounds.extend([location.Latitude, location.Longitude]);
            return bounds;
        }, new LatLngBounds([[data[0].Latitude, data[0].Longitude]]))
        : defaultBounds; // Use default bounds when no data

    return (
        <div className="flex-1 bg-gray-100 p-6 h-screen w-full relative">
            <MapContainer
                bounds={bounds}
                scrollWheelZoom={true}
                style={{ height: "100%", width: "100%", borderRadius: "20px" }}
            >
                <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                {data.map((location, index) => (
                    <Marker
                        key={index}
                        position={[location.Latitude, location.Longitude] as LatLngExpression}
                        icon={customMarkerIcon(location.Strategy)}
                    >
                        <Popup>
                            <h4 className="text-lg font-bold mb-2">{location.Strategy}</h4>
                            <p className="text-sm font-medium">Category: {location.Category.join(", ")}</p>
                            <p className="text-sm font-medium">Report: {location.Report}</p>
                            <p className="text-sm font-normal mt-2">Details: {location.Details}</p>
                            <p className="text-sm font-semibold">Key Areas: {location.KeyAreas.join(", ")}</p>
                            <Link href={location.Link} target="_blank" rel="noopener noreferrer">
                                <Button variant="default" size="sm" className="mt-4">
                                    View More Details
                                </Button>
                            </Link>
                        </Popup>
                    </Marker>
                ))}
            </MapContainer>
        </div>
    );
}
