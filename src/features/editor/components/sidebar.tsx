'use client';

import React from 'react';

import {ImageIcon, LayoutTemplate, SettingsIcon, ShapesIcon, Sparkles, TypeIcon, Sticker, Pencil} from "lucide-react";
import {ActiveTool} from "../types";
import SidebarItem from "./sidebar-item";
import {Separator} from "@/components/ui/separator";



interface SideBarProps {
    activeTool: ActiveTool;
    onChangeActiveTool: (tool: ActiveTool) => void;
}


const SideBar = ({
    activeTool,
    onChangeActiveTool,
}: SideBarProps) => {

    return (
        <aside
            className="bg-white flex- flex-col w-[100px] h-full border-r overflow-y-auto"
        >
            <ul
                className="flex flex-col space-y-4"
            >
                <SidebarItem label={"Design"} icon={LayoutTemplate} onClick={() => onChangeActiveTool("templates")} isActive={activeTool === "templates"}/>
                <Separator
                    className={"border-t border-gray-200"}
                />
                <SidebarItem label={"Type"} icon={TypeIcon} onClick={() => onChangeActiveTool("text")} isActive={activeTool === "text"} />
                <SidebarItem label={"Draw"} icon={Pencil} onClick={() => onChangeActiveTool("draw")} isActive={activeTool === "draw"} />
                <SidebarItem label={"Shapes"} icon={ShapesIcon} onClick={() => onChangeActiveTool("shapes")} isActive={activeTool === "shapes"}/>
                <Separator
                    className={"border-t border-gray-200"}
                />
                <SidebarItem label={"Image"} icon={ImageIcon} onClick={() => onChangeActiveTool("images")} isActive={activeTool === "images"} />
                <SidebarItem label={"IA"} icon={Sparkles} onClick={() => onChangeActiveTool("ai")} isActive={activeTool === "ai"}/>
                <SidebarItem label={"Sticker"} icon={Sticker} onClick={() => onChangeActiveTool("sticker")} isActive={activeTool === "sticker"}/>
                <Separator
                    className={"border-t border-gray-200"}
                />
                <SidebarItem label={"Setting"} icon={SettingsIcon} onClick={() => onChangeActiveTool("settings")} isActive={activeTool === "settings"}/>
            </ul>
        </aside>
    );
};

export default SideBar;