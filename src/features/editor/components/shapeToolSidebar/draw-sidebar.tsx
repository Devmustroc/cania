import React from 'react';

import {cn} from "@/lib/utils";
import {ActiveTool, EditorProps, STROKE_COLOR, STROKE_WIDTH} from "../../types";
import ToolSidebarHeader from "./tool-sidebar-header";
import {ScrollArea} from "@/components/ui/scroll-area";
import ColorPicker from "./color-picker";
import ToolSidebarClose from "./tool-sidebar-close";
import {Label} from "@/components/ui/label";
import {Slider} from "@/components/ui/slider";


interface DrawSideBarProps {
    editor: EditorProps | undefined;
    activeTool: ActiveTool;
    onChangeActiveTool: (tool: ActiveTool) => void;
}

const DrawSideBar = ({
                          editor,
                          activeTool,
                          onChangeActiveTool,
                      }: DrawSideBarProps) => {
    const colorValue = editor?.getActiveStrokeColor() || STROKE_COLOR;
    const widthValue = editor?.getActiveStrokeWidth() || STROKE_WIDTH;

    const onClose = () => {
        editor?.disabledDrawingMode();
        onChangeActiveTool("select");
    }

    const onChangeStrokeWidth = (width: number) => {
        editor?.changeStrokeWidth(width);
    }

    const onChangeColor = (color: string) => {
        editor?.changeStrokeColor(color);
    }
    return (
        <aside
            className={cn(
                `bg-white relative border-r z-[40] w-[360px] h-full flex flex-col`,
                activeTool === "draw" ? "visible" : "hidden"
            )}
        >
            <ToolSidebarHeader title={"Drawing"} description={"Modify brush settings"} />
            <ScrollArea>
                <div
                    className="p-4 space-y-6"
                >
                    <div
                        className="p-4 space-y-4 border-b"
                    >
                        <Label
                            className="text-sm space-y-4 font-bold"
                        >
                            Border width
                            <Slider
                                value={[widthValue]}
                                onValueChange={(values) => onChangeStrokeWidth(values[0])}
                                className="w-full mt-4"
                            />
                        </Label>
                    </div>
                    <ColorPicker
                        value={colorValue}
                        onChange={onChangeColor}
                    />
                </div>
            </ScrollArea>
            <ToolSidebarClose closeSidebar={onClose}/>
        </aside>
    );
};

export default DrawSideBar;