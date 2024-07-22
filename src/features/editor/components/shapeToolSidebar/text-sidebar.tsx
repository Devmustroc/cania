'use client'


import {cn} from "@/lib/utils";

import {ScrollArea} from "@/components/ui/scroll-area";
import {Label} from "@radix-ui/react-dropdown-menu";
import {Button} from "@/components/ui/button";
import {ActiveTool, EditorProps} from "../../types";
import ToolSidebarHeader from "./tool-sidebar-header";
import ToolSidebarClose from "./tool-sidebar-close";


interface TextProps {
    editor: EditorProps | undefined;
    activeTool: ActiveTool;
    onChangeActiveTool: (tool: ActiveTool) => void;
}

const TextSideBar = ({
                          editor,
                          activeTool,
                          onChangeActiveTool,
                      }: TextProps) => {


    const onClose = () => {
        onChangeActiveTool("select");
    }


    return (
        <aside
            className={cn(
                `bg-white relative border-r z-[40] w-[360px] h-full flex flex-col`,
                activeTool === "text" ? "visible" : "hidden"
            )}
        >
            <ToolSidebarHeader title={"Text"} description={"Add text to your design"} />
            <ScrollArea>
                <div
                    className="p-4 space-y-4 border-b"
                >
                    <Button
                        onClick={() => editor?.addText("Text")}
                        className="w-full"
                    >
                        Add Text
                    </Button>
                    <Button
                        variant={"secondary"}
                        size={"lg"}
                        onClick={() => editor?.addText("Heading", {
                            fontSize: 80,
                            fontWeight: 700,
                        })}
                        className="w-full h-16"
                    >
                        <span
                            className="text-3xl font-bold"
                        >
                            Add heading
                        </span>
                    </Button>
                    <Button
                        variant={"secondary"}
                        size={"lg"}
                        onClick={() => editor?.addText("Heading", {
                            fontSize: 44,
                            fontWeight: 500,
                        })}
                        className="w-full h-16"
                    >
                        <span
                            className="text-xl font-semibold"
                        >
                            Subheading
                        </span>
                    </Button>
                    <Button
                        variant={"secondary"}
                        size={"lg"}
                        onClick={() => editor?.addText("Heading", {
                            fontSize: 32,
                        })}
                        className="w-full h-16"
                    >
                            paragraph
                    </Button>
                </div>
            </ScrollArea>
            <ToolSidebarClose closeSidebar={onClose} />
        </aside>
    );
};

export default TextSideBar;