import { Button } from "@/components/ui/button";
import { HomeIcon } from "lucide-react";
import Link from "next/link";

export default function NotFound() {
    return (
        <>
            <div className="flex flex-col items-center justify-center min-h-screen py-2 max-w-[500px] mx-auto text-center gap-5">
                <h1 className="-mb-4">Oops, Error 404!</h1>
                <p>The page you are trying to visit doesn&apos;t exist or have been shifted to a new URL.</p>
                <Link href={'/'}>
                    <Button><HomeIcon /> Return Home</Button>
                </Link>
            </div>
        </>
    );
}