import React from 'react';
import type {LucideIcon} from "lucide-react";
import {Button} from "@/components/ui/button";
import {cn} from "@/lib/utils";

interface SidebarItemProps {
    label: string;
    isActive?: boolean;
    icon: LucideIcon;
    onClick: () => void;
}

const SidebarItem = ({
    label,
    isActive,
    icon: Icon,
    onClick,
}: SidebarItemProps) => {
    return (
        <Button
            variant={"ghost"}
            onClick={onClick}
            className={cn(
                ` w-full h-full aspect-video p-4 mt-2 flex flex-col hover:bg-sky-500/50 hover:rounded-none`,
                isActive && "bg-muted",
            )}
        >
            <div
                className="flex flex-col items-center justify-center pt-2"
            >
                <Icon
                    className="size-6 stroke-2 shrink-0"
                />
                <span
                    className="mt-2 text-xs pb-2"
                >
                {label}
            </span>
            </div>
        </Button>
    );
};

export default SidebarItem;