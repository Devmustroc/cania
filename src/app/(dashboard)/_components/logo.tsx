import React from 'react';
import {  Baloo_2, Exo_2 } from "next/font/google";
import Link from "next/link";
import Image from "next/image";
import {className} from "postcss-selector-parser";
import {cn} from "@/lib/utils";

const font = Baloo_2({
    weight: ['600'],
    subsets: ['latin']
})

const Logo = () => {
    return (
        <Link
            href={"/"}
        >
            <div
                className="flex items-center gap-x-2 hover:opacity-75 transition h-[64px] px-4 cursor-pointer"
            >
                <div
                    className="size-8 relative items-center justify-center flex "
                >
                    <Image
                        src="images/logo.svg"
                        alt={"Logo"}
                        fill
                    />
                </div>
                <h1
                    className={cn(font.className, "text-3xl font-bold")}
                >
                    Cania
                </h1>
            </div>
        </Link>
    );
};

export default Logo;