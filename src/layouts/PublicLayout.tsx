import { Outlet } from "react-router-dom";
import { PublicHeader } from "@/components/layout/PublicHeader";
import { PublicFooter } from "@/components/layout/PublicFooter";

export function PublicLayout() {
    return (
        <div className="min-h-screen flex flex-col bg-background">
            <PublicHeader />
            <main className="flex-1">
                <Outlet />
            </main>
            <PublicFooter />
        </div>
    );
}
