import React from 'react';
import Link from "next/link";
import {cn} from "@/lib/utils";
import {LucideIcon} from "lucide-react";

interface SidebarItemProps {
    icon: LucideIcon;
    label: string;
    href: string;
    isActive?: boolean;
    onClick?: () => void;
};

const SidebarItem = ({
    icon: Icon,
    label,
    href,
    isActive,
    onClick
}: SidebarItemProps) => {
    return (
        <Link
            href={href}
            onClick={onClick}
        >
            <div
                className={cn(`flex items-center px-3 py-3 rounded-xl bg-transparent hover:bg-[#ff8a34]/50 transition cursor-pointer`,
                        isActive && "bg-[#ff8a34]"
                )}
            >
                <Icon
                    className="size-6 mr-2 stroke-2"
                />
                <span
                    className="text-sm font-medium"
                >
                    {label}
                </span>
            </div>
        </Link>
    );
};

export default SidebarItem;
