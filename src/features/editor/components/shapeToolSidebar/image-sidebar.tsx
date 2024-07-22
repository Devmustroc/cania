'use client'

import {cn} from "@/lib/utils";
import {ScrollArea} from "@/components/ui/scroll-area";
import ToolSidebarHeader from "./tool-sidebar-header";
import ToolSidebarClose from "./tool-sidebar-close";
import {ActiveTool, EditorProps, fonts} from "../../types";
import {useGetImages} from "@/features/images/api/use-get-images";
import {AlertTriangle, Loader2} from "lucide-react";
import Image from 'next/image';
import Link from "next/link";
import {UploadButton} from "@/lib/uploadthing";


interface ImageSideBarProps {
    editor: EditorProps | undefined;
    activeTool: ActiveTool;
    onChangeActiveTool: (tool: ActiveTool) => void;
}

const ImageSideBar = ({
                          editor,
                          activeTool,
                          onChangeActiveTool,
                      }: ImageSideBarProps) => {
    const { data, isLoading, isError } = useGetImages();




    const onClose = () => {
        onChangeActiveTool("select");
    }


    return (
        <aside
            className={cn(
                `bg-white relative border-r z-[40] w-[360px] h-full flex flex-col`,
                activeTool === "images" ? "visible" : "hidden"
            )}
        >
            <ToolSidebarHeader title={"Images"} description={"Add images to your design"} />
            <div
                className="p-4 border-b"
            >
                <UploadButton
                    appearance={{
                        button: "w-full text-sm font-medium bg-amber-500 text-black hover:bg-amber-600",
                        allowedContent: "hidden"
                    }}
                    content={{
                        button: "Upload Image",
                    }}
                    endpoint={"imageUploader"}
                    onClientUploadComplete={(res) => {
                        editor?.addImage(res[0].url);
                    }}
                />
            </div>
            {
                isLoading && (
                    <div
                        className="flex items-center justify-center flex-1"
                    >
                        <Loader2
                            className="animate-spin size-8 text-muted-foreground"
                        />
                    </div>
                )
            }
            {
                isError && (
                    <div
                        className="flex flex-col items-center justify-center flex-1"
                    >
                        <AlertTriangle
                            className="size-8 text-muted-foreground"
                        />
                        <p
                            className="text-muted-foreground text-sm"
                        >
                            Failed to get your images
                        </p>
                    </div>
                )
            }
            <ScrollArea>
                <div
                    className="p-4 "
                >
                    <div
                        className={cn(
                            "grid grid-cols-2 gap-2",
                        )}
                    >
                    {
                        data && data.map((image, idx) => {
                            return (
                                <button
                                    onClick={() => editor?.addImage(image.urls.regular)}
                                    key={image.id}
                                    className={cn("relative w-full h-[200px] group hover:opacity-75 transition bg-muted rounded-sm overflow-hidden border", idx % 3 === 0 && "col-span-2",
                                        idx % 2 === 0 && "row-span-2"
                                    )}
                                >
                                    <Image
                                        fill
                                        src={image.urls.small}
                                        alt={image.alt_description || "image"}
                                        className="object-cover w-full h-24"
                                    />
                                    <Link
                                        href={image.links.html}
                                        target={"_blank"}
                                        className="opacity-0 group hover:opacity-100 truncate absolute bottom-0 left-0 w-full h-8 hover:bg-[#ff7917] hover:bg-opacity-40 text-black text-left p-1 animate-accordion-down transition duration-200"
                                    >
                                        {image.user.name}
                                    </Link>
                                </button>
                            )
                        })
                    }
                    </div>
                </div>
            </ScrollArea>
            <ToolSidebarClose closeSidebar={onClose}/>
        </aside>
    );
};

export default ImageSideBar;