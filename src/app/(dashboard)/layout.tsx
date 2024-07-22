import React from 'react';
import Sidebar from "@/app/(dashboard)/_components/sidebar";
import Navbar from "@/app/(dashboard)/_components/navbar";

interface LayoutProps {
    children: React.ReactNode
}

const Layout = ({ children }: LayoutProps) => {
    return (
        <div
            className="h-full"
        >
            <Sidebar />
            <div
                className="lg:pl-[300px] flex flex-col h-full"
            >
                <Navbar />
                <main
                    className="bg-white flex-1 overflow-auto p-8 lg:rounded-tl-2xl"
                >
                    { children }
                </main>
            </div>
        </div>
    );
};

export default Layout;