import React from 'react';

interface LayoutProps {
    children: React.ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
    return (
        <div
            className="bg-[url('/images/canvas.png')] bg-top bg-cover flex flex-col h-full"
        >
            <div
                className="flex flex-col items-center justify-center h-full w-full z-[4]"
            >
                <div
                    className="md:h-auto md:w-[400px] w-full h-full"
                >
                    {children}
                </div>
            </div>
            <div
                className="fixed inset-0 bg-[linear-gradient(180deg,rgba(0,0,0,0.8),rgba(0,0,0,0.4),rgba(0.0.0.8))] z-[3]"
            />
        </div>
    );
};

export default Layout;