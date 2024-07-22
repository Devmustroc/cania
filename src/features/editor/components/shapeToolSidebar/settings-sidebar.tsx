import React, {useEffect, useMemo, useState} from 'react';

import {cn} from "@/lib/utils";
import {ActiveTool, EditorProps} from "../../types";
import ToolSidebarHeader from "./tool-sidebar-header";
import {ScrollArea} from "@/components/ui/scroll-area";
import ToolSidebarClose from "./tool-sidebar-close";
import {Input} from "@/components/ui/input";
import {Label} from "@/components/ui/label";
import {Button} from "@/components/ui/button";
import ColorPicker from "@/features/editor/components/shapeToolSidebar/color-picker";



interface SettingsProps {
    editor: EditorProps | undefined;
    activeTool: ActiveTool;
    onChangeActiveTool: (tool: ActiveTool) => void;
}

const SettingsSideBar = ({
                          editor,
                          activeTool,
                          onChangeActiveTool,
                      }: SettingsProps) => {
    const workspace = editor?.getWorkSpace();

    const initialWidth = useMemo(() =>
        `${workspace?.width ?? 0}`
    , [workspace]);
    const initialHeight = useMemo(() =>
        `${workspace?.height ?? 0}`
    , [workspace]);
    const initialBackground = useMemo(() =>
        workspace?.backgroundColor ?? "#FFFFFF"
    , [workspace]);

    const [width, setWidth] = useState(initialWidth);
    const [height, setHeight] = useState(initialHeight);
    const [background, setBackground] = useState(initialBackground);

    useEffect(() => {
        setWidth(initialWidth);
        setHeight(initialHeight);
        setBackground(initialBackground);
    }, [
        initialWidth,
        initialHeight,
        initialBackground
    ]);

    const onClose = () => {
        onChangeActiveTool("select");
    }

    const changeWidth = (value: string) => {
        setWidth(value);
    }
    const changeHeight = (value: string) => {
        setHeight(value);
    }
    const changeBackground = (value: string) => {
        setBackground(value);
        editor?.changeBackground(value);
    }

    const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        editor?.changeSize({
            width: parseInt(width, 10),
            height: parseInt(height, 10)
        });
    }
    return (
        <aside
            className={cn(
                `bg-white relative border-r z-[40] w-[360px] h-full flex flex-col`,
                activeTool === "settings" ? "visible" : "hidden"
            )}
        >
            <ToolSidebarHeader title={"Settings"} description={"Modify workspace settings"} />
            <ScrollArea>
                <form
                    className="space-y-4 p-4"
                    onSubmit={onSubmit}
                >
                    <div
                        className="space-y-2"
                    >
                       <Label>
                           Height
                       </Label>
                        <Input
                            placeholder={"Height"}
                            value={height}
                            type={"number"}
                            onChange={(e) => changeHeight(e.target.value)}
                        />
                        <Label>
                            Width
                        </Label>
                        <Input
                            placeholder={"Width"}
                            value={width}
                            type={"number"}
                            onChange={(e) => changeWidth(e.target.value)}
                        />
                        <Button
                            type={"submit"}
                            className={"w-full"}
                        >
                            Resize
                        </Button>
                    </div>
                </form>
                <div
                    className="p-4"
                >
                    <ColorPicker
                        value={background}
                        onChange={changeBackground}
                    />
                </div>
            </ScrollArea>
            <ToolSidebarClose closeSidebar={onClose} />
        </aside>
    );
};

export default SettingsSideBar;