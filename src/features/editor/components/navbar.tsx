"use client";

import React from 'react';

import {DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger} from "@/components/ui/dropdown-menu";
import {Button} from "@/components/ui/button";
import {ChevronDown, Download, Loader2, MousePointerClick, Redo2, Undo2} from "lucide-react";
import {CiFileOn} from "react-icons/ci";
import {Separator} from "@/components/ui/separator";
import {Hint} from "@/components/hint";
import {BsCloudCheck, BsCloudSlash} from "react-icons/bs";
import {cn} from "@/lib/utils";
import Logo from "./logo";
import {ActiveTool, EditorProps} from "../types";
import {useFilePicker} from "use-file-picker";
import UserButton from "@/features/auth/components/user-button";
import {useUpdateProject} from "@/features/projects/api/use-update-project";
import {useMutationState} from "@tanstack/react-query";

interface NavBarProps {
    id: string;
    editor: EditorProps | undefined;
    activeTool: ActiveTool;
    onChangeActiveTool: (tool: ActiveTool) => void;
}

const NavBar = ({
    id,
    editor,
    activeTool,
    onChangeActiveTool,
}: NavBarProps) => {
    const data = useMutationState({
        filters: {
            mutationKey: ['project', { id }],
            exact: true
        },
        select: (mutation) => mutation.state.status
    })

    const currentStatus = data[data.length - 1];

    const isErrored = currentStatus === "error";
    const isPending = currentStatus === "pending";

    const { openFilePicker } = useFilePicker({
        accept: '.json',
        onFilesSuccessfullySelected: ({ plainFiles }: any) => {
            if (plainFiles && plainFiles.length > 0) {
                const file = plainFiles[0];
                const reader = new FileReader();
                reader.readAsText(file, "UTF-8");
                reader.onload = () => {
                    editor?.loadJson(reader.result as string);
                }
            }
        },
    })
    return (
        <nav
            className="w-full flex items-center p-4 h-[68px] gap-x-8 border-b lg:pl-[34px] "
        >
            <Logo />
            <div
                className="w-full flex items-center gap-x-1 h-full"
            >
                <DropdownMenu
                    modal={false}
                >
                    <DropdownMenuTrigger asChild>
                        <Button
                            size={"sm"}
                            variant={"ghost"}
                        >
                            File
                            <ChevronDown
                                className="size-4 ml-2"
                            />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent
                        align={"start"} className="min-w-60"
                    >
                        <DropdownMenuItem
                            onClick={() => openFilePicker()}
                            className="flex items-center gap-x-2"
                        >
                            <CiFileOn
                                className="size-8"
                            />
                            <div>
                                <p>Open</p>
                                <p
                                    className="text-xs text-muted-foreground"
                                >
                                    Open JSON file
                                </p>
                            </div>
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
                <Separator
                    orientation={"vertical"}
                    className="mx-2"
                />
                <Hint
                    label={"Select"} side={"bottom"} sideOffset={10}

                >
                    <Button
                        variant={"ghost"}
                        size={"icon"}
                        onClick={() => onChangeActiveTool("select")}
                        className={cn(
                            activeTool === "select" && "bg-muted"
                        )}
                    >
                        <MousePointerClick className="size-4" />
                    </Button>
                </Hint>
                <Hint
                    label={"Undo"} side={"bottom"} sideOffset={10}

                >
                    <Button
                        disabled={!editor?.canUndo()}
                        variant={"ghost"}
                        size={"icon"}
                        onClick={() => editor?.onUndo()}
                    >
                        <Undo2 className="size-4" />
                    </Button>
                </Hint>
                <Hint
                    label={"Redo"} side={"bottom"} sideOffset={10}

                >
                    <Button
                        disabled={!editor?.canRedo()}
                        variant={"ghost"}
                        size={"icon"}
                        onClick={() => editor?.onRedo()}
                    >
                        <Redo2 className="size-4" />
                    </Button>
                </Hint>
                <Separator orientation={"vertical"} className="mx-2" />
                {
                    !isPending && !isErrored && (

                        <div
                            className="flex items-center gap-x-2"
                        >
                            <BsCloudCheck className="size-[20px] text-muted-foreground"/>
                            <div
                                className="text-xs text-muted-foreground"
                            >
                                Saved
                            </div>
                        </div>
                    )
                }
                {
                    !isPending && isErrored && (

                        <div
                            className="flex items-center gap-x-2"
                        >
                            <BsCloudSlash className="size-[20px] text-muted-foreground"/>
                            <div
                                className="text-xs text-muted-foreground"
                            >
                                Saved
                            </div>
                        </div>
                    )
                }
                {
                    isPending &&  (

                        <div
                            className="flex items-center gap-x-2"
                        >
                            <Loader2 className="size-[20px] animate-spin text-muted-foreground"/>
                            <div
                                className="text-xs text-muted-foreground"
                            >
                                Saving...
                            </div>
                        </div>
                    )
                }
                <div
                    className="ml-auto flex items-center gap-x-4"
                >
                    <DropdownMenu
                        modal={false}
                    >
                        <DropdownMenuTrigger asChild>
                            <Button
                                size={"sm"}
                                variant={"ghost"}
                                className={"rounded-full bg-sky-500 text-white hover:bg-sky-700 hover:text-white"}
                            >
                                <Download  className="size-4 mr-2"/>
                                Export
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent
                            align={"end"}
                            className="min-w-60"
                        >
                            <DropdownMenuItem
                                onClick={() => editor?.saveAsJson()}
                                className="flex items-center gap-x-2"
                            >
                                <CiFileOn className={"size-8 text-fuchsia-800"} />
                                <div>
                                    <p
                                        className="capitalize text-fuchsia-800"
                                    >JSON</p>
                                    <p
                                        className="text-xs text-muted-foreground"
                                    >
                                        Save for editing
                                    </p>
                                </div>
                            </DropdownMenuItem>
                            <DropdownMenuItem
                                onClick={()  => editor?.saveAsPng()}
                                className="flex items-center gap-x-2"
                            >
                                <CiFileOn className={"size-8 text-emerald-800"} />
                                <div>
                                    <p
                                        className="capitalize text-emerald-800"
                                    >PNG</p>
                                    <p
                                        className="text-xs text-muted-foreground"
                                    >
                                        Save in PNG format
                                    </p>
                                </div>
                            </DropdownMenuItem>
                            <DropdownMenuItem
                                onClick={() => editor?.saveAsJpeg()}
                                className="flex items-center gap-x-2"
                            >
                                <CiFileOn className={"size-8 text-sky-600"} />
                                <div>
                                    <p
                                        className="capitalize text-sky-600"
                                    >JPG</p>
                                    <p
                                        className="text-xs text-muted-foreground"
                                    >
                                        Save in JPG format
                                    </p>
                                </div>
                            </DropdownMenuItem>
                            <DropdownMenuItem
                                onClick={() => editor?.saveAsSvg()}
                                className="flex items-center gap-x-2"
                            >
                                <CiFileOn className={"size-8 text-emerald-800"} />
                                <div>
                                    <p
                                        className="capitalize text-emerald-800"
                                    >SVG</p>
                                    <p
                                        className="text-xs text-muted-foreground"
                                    >
                                        Save in SVG format
                                    </p>
                                </div>
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                    <UserButton />
                </div>
            </div>
        </nav>
    );
};

export default NavBar;