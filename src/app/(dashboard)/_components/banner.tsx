'use client'

import React from 'react';
import {ArrowRight, Sparkle, Sparkles} from "lucide-react";
import {Button} from "@/components/ui/button";
import {useCreateProject} from "@/features/projects/api/use-create-project";
import {useRouter} from "next/navigation";

const Banner = () => {
    const mutation = useCreateProject();
    const router = useRouter();

    const onClick = () => {
        mutation.mutate({
            name: "Untitled project",
            json: "",
            width: 1920,
            height: 1080,
        },{
            onSuccess: ({ data }) => {
                router.push(`/editor/${data.id}`);
                console.log("Project created successfully");
            },
        })
    }
    return (
        <div className="aspect-[5/1] min-h-[248px] flex gap-x-6 p-6 items-center rounded-xl bg-gradient-to-b from-[#ff8a34] via-[#ff8a34]/40 to-muted">
            <div className="rounded-full size-28 items-center justify-center bg-white bg-opacity-50 hidden md:flex">
                <div className="rounded-full size-20 flex items-center justify-center bg-white">
                    <Sparkles className="h-20 text-[#ff8a34] fill-[#ff8a34]" />
                </div>
            </div>
            <div className="flex flex-col  items-center gap-y-2">
                <h1 className="text-xl md:text-3xl font-semibold">
                    Visualize your ideas with Image AI
                </h1>
                <p className="text-xs md:text-sm mb-2">
                    Turn inspiration into design in no time. Simply upload an image and let AI do the rest.
                </p>
                <Button
                    disabled={mutation.isPending}
                    onClick={onClick}
                    variant="secondary"
                    className="w-[160px]"
                >
                    Start creating
                    <ArrowRight className="size-4 ml-2" />
                </Button>
            </div>
        </div>
    );
};

export default Banner;