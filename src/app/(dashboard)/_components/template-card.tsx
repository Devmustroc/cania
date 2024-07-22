import React from 'react';
import {cn} from "@/lib/utils";
import Image from "next/image";
import {Crown} from "lucide-react";

interface TemplateCardProps {
    imageSrc: string;
    title: string;
    onClick: () => void;
    disabled?: boolean;
    description: string;
    width: number;
    height: number;
    isPremium?: boolean;
}


const TemplateCard = ({
     imageSrc,
     title,
      onClick,
      disabled,
      width,
      height,
      isPremium
}: TemplateCardProps) => {
    return (
        <button
            onClick={onClick}
            disabled={disabled}
            className={cn(
                "space-y-2 group text-left transition flex flex-col",
                disabled ? "cursor-not-allowed opacity-75" : "cursor-pointer"
            )}
        >
            <div
                style={{aspectRatio: `${width}/${height}`}}
                className="relative rounded-xl h-full w-full overflow-hidden border">
                <Image
                    fill
                    src={imageSrc}
                    alt={title}
                    className=" object-cover transition transform group-hover:scale-105"
                />
                { isPremium && (
                    <div
                        className="absolute top-2 right-2 h-10 w-10 flex items-center justify-center bg-black/50 rounded-full -z[10]">
                        <Crown className="size-5 fill-[#442781] text-[#442781]"/>
                    </div>
                )}
                <div
                    className="opacity-0 group-hover:opacity-100 transition absolute inset-0 bg-[#ff8730]/50 flex items-center justify-center rounded-xl  backdrop-filter backdrop-blur-sm">
                    <p className="text-white font-medium bg-[#a992db] p-4 rounded-xl">
                        Open in editor
                    </p>
                </div>
            </div>
        </button>
    );
};

export default TemplateCard;