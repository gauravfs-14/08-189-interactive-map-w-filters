"use client";

import { useEffect } from "react";
// import { MapContainer, Marker, Popup, TileLayer } from "react-leaflet";
import { LatLngBounds, LatLngExpression, divIcon } from "leaflet";
import ReactDOMServer from "react-dom/server";
import "leaflet/dist/leaflet.css";
import { DataProps } from "@/types/dataProp";
import Link from "next/link";
import { Button } from "./ui/button";
import { useToast } from "@/hooks/use-toast";
import { RiMapPin2Fill } from "react-icons/ri";


import dynamic from "next/dynamic";

// Dynamically import Map components
const MapContainer = dynamic(() => import("react-leaflet").then((mod) => mod.MapContainer), { ssr: false });
const TileLayer = dynamic(() => import("react-leaflet").then((mod) => mod.TileLayer), { ssr: false });
const Marker = dynamic(() => import("react-leaflet").then((mod) => mod.Marker), { ssr: false });
const Popup = dynamic(() => import("react-leaflet").then((mod) => mod.Popup), { ssr: false });


type MapComponentProps = {
    data: DataProps[];
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
    const customMarkerIcon = divIcon({
        html: ReactDOMServer.renderToString(
            <div
                style={{
                    color: "red",
                    fontSize: "24px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                }}
            >
                <RiMapPin2Fill size={32} color="#884dee" />
            </div>
        ),
        className: "", // Prevent Leaflet's default styling
        iconSize: [32, 32],
        iconAnchor: [16, 32],
    });

    // Calculate bounds to fit all markers if data is available
    const bounds = data.length
        ? data.reduce((bounds, location) => {
            bounds.extend([location.latitude, location.longitude]);
            return bounds;
        }, new LatLngBounds([[data[0].latitude, data[0].longitude]]))
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
                        position={[location.latitude, location.longitude] as LatLngExpression}
                        icon={customMarkerIcon}
                    >
                        <Popup>
                            <h4 className="-mb-4">{location.name}</h4>
                            <p className="font-bold italic">
                                {location.author} | {location.year}
                            </p>
                            <p className="text-sm font-thin">{location.description}</p>
                            <Link href={location.link} target="_blank" rel="noopener noreferrer">
                                <Button variant="default" size="sm" className="mt-2">
                                    View Details
                                </Button>
                            </Link>
                        </Popup>
                    </Marker>
                ))}
            </MapContainer>
        </div>
    );
}
