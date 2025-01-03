export interface DataProps {
    name: string;
    author: string;
    description: string;
    category: string;
    year: number;
    link: string;
    latitude: number;
    longitude: number;
}

export interface NewDataProps {
    Strategy: string; // Name or type of the strategy
    State: string; // State or location
    Latitude: number; // Geographic latitude
    Longitude: number; // Geographic longitude
    Year: number; // Year of the report or activity
    Category: string[]; // Array of categories
    Report: string; // Name of the report
    Details: string; // Additional details about the report
    KeyAreas: string[]; // Array of key focus areas
    Link: string; // URL for additional information
};