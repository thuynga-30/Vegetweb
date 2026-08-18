import { createContext, useState, type ReactNode } from "react";
import type { User } from "@/types/user";

interface AuthContextType {
    user: User | null;
    login: (u: User, token: string) => void;
    logout: () => void;
}

export const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
    const [user, setUser] = useState<User | null>(() => {
        const raw = localStorage.getItem("gf_user");
        return raw ? JSON.parse(raw) : null;
    });

    const login = (u: User, token: string) => {
        localStorage.setItem("gf_token", token);
        localStorage.setItem("gf_user", JSON.stringify(u));
        setUser(u);
    };

    const logout = () => {
        localStorage.removeItem("gf_token");
        localStorage.removeItem("gf_user");
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ user, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
}
