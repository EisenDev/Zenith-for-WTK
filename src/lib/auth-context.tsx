"use client";

import * as React from "react";
import { useRouter, usePathname } from "next/navigation";

interface User {
    id: string;
    email: string;
    role: string;
    department?: string;
}

interface AuthContextType {
    user: User | null;
    login: (user: User) => void;
    logout: () => void;
    isLoading: boolean;
}

const AuthContext = React.createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [user, setUser] = React.useState<User | null>(null);
    const [isLoading, setIsLoading] = React.useState(true);
    const router = useRouter();
    const pathname = usePathname();

    React.useEffect(() => {
        const savedUser = localStorage.getItem("zenith_user");
        if (savedUser) {
            setUser(JSON.parse(savedUser));
        }
        setIsLoading(false);
    }, []);

    const login = (userData: User) => {
        setUser(userData);
        localStorage.setItem("zenith_user", JSON.stringify(userData));
        router.push("/");
    };

    const logout = () => {
        setUser(null);
        localStorage.removeItem("zenith_user");
        router.push("/login");
    };

    // Client-side protection logic
    React.useEffect(() => {
        if (!isLoading) {
            const publicRoutes = ["/login", "/register"];
            const isAdminRoute = ["/settings", "/competitors"].includes(pathname);

            if (!user && !publicRoutes.includes(pathname)) {
                router.push("/login");
            } else if (user && isAdminRoute && user.role !== "admin") {
                router.push("/");
            }
        }
    }, [user, isLoading, pathname, router]);

    return (
        <AuthContext.Provider value={{ user, login, logout, isLoading }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const context = React.useContext(AuthContext);
    if (context === undefined) {
        throw new Error("useAuth must be used within an AuthProvider");
    }
    return context;
}
