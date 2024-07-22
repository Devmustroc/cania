import React from 'react';
import {ChevronsLeft} from "lucide-react";

interface ToolSidebarCloseProps {
    closeSidebar: () => void;
}

const ToolSidebarClose = ({ closeSidebar}: ToolSidebarCloseProps) => {
    return (
        <button
            onClick={closeSidebar}
            className="absolute -right-[2.05rem] h-[70px] top-1/2 p-2 bg-white transform
             -translate-y-1/2 flex items-center justify-center rounded-r-xl pr-2
             border-r border-y group"
        >
            <ChevronsLeft
                className="size-4 text-black group-hover:opacity-75 transition-opacity duration-200"
            />
        </button>
    );
};

export default ToolSidebarClose;