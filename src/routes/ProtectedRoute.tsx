import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";

const BYPASS_AUTH_FOR_PREVIEW = false;

export function ProtectedRoute({ allow }: { allow: ("buyer" | "seller" | "admin")[] }) {
    const { user } = useAuth();

    if (BYPASS_AUTH_FOR_PREVIEW) return <Outlet />;

    if (!user) return <Navigate to="/auth/login" replace />;
    if (!allow.includes(user.role)) return <Navigate to="/" replace />;
    return <Outlet />;
}