'use client'

import {cn} from "@/lib/utils";
import {ScrollArea} from "@/components/ui/scroll-area";
import ToolSidebarHeader from "./tool-sidebar-header";
import ToolSidebarClose from "./tool-sidebar-close";
import {ActiveTool, EditorProps} from "../../types";
import {AlertTriangle, Crown, Loader2} from "lucide-react";
import Image from 'next/image';
import {ResponderType, useGetTemplates} from "@/features/projects/api/use-get-template";
import useConfirm from "@/hooks/use-confirm";
import {usePaywall} from "@/features/subscriptions/hooks/use-paywall";


interface TemplateSideBarProps {
    editor: EditorProps | undefined;
    activeTool: ActiveTool;
    onChangeActiveTool: (tool: ActiveTool) => void;
}

const TemplateSideBar = ({
                          editor,
                          activeTool,
                          onChangeActiveTool,
                      }: TemplateSideBarProps) => {
    const subscription = usePaywall();
    const [ConfirmDialog, confirm] = useConfirm(
        "Are you sure?",
        "This will clear the current project",
    );
    const { data, isLoading, isError } = useGetTemplates({
        page: "1",
        limit: "20"
    });



    const onClose = () => {
        onChangeActiveTool("select");
    }

    const onClick = async (template: ResponderType['data'][0]) => {
        if (subscription.shouldBeBlock && template.isPro) {
            subscription.triggerPaywall();
            return;
        }
        const ok = await confirm();
        if (ok) {
            editor?.loadJson(template.json);
        }

    }


    return (
        <aside
            className={cn(
                `bg-white relative border-r z-[40] w-[360px] h-full flex flex-col`,
                activeTool === "templates" ? "visible" : "hidden"
            )}
        >
            <ConfirmDialog />
            <ToolSidebarHeader title={"Templates"} description={"Choose a template to start with"}/>
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
                            Failed to get templates
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
                        data && data.map((template, idx) => {
                            return (
                                <button
                                    style={
                                        {
                                            aspectRatio: `${template.width}/${template.height}`
                                        }
                                    }
                                    onClick={() => onClick(template)}
                                    key={template.id}
                                    className={cn("relative w-full h-[80%] group hover:opacity-75 transition bg-muted rounded-sm overflow-hidden border", idx % 3 === 0 && "col-span-2",
                                        idx % 2 === 0 && "row-span-2"
                                    )}
                                >
                                    <Image
                                        fill
                                        src={template.thumbnail || ""}
                                        alt={template.name || "image"}
                                        className="object-cover w-full h-24"
                                    />
                                    {
                                        template.isPro && (
                                            <div
                                                className="absolute top-2 right-2 h-10 w-10 flex items-center justify-center bg-black/50 rounded-full -z[10]">
                                                <Crown className="size-5 fill-[#442781] text-[#442781]"/>
                                            </div>
                                        )
                                    }
                                    <div
                                        className="opacity-0 group hover:opacity-100 truncate absolute bottom-0 left-0 w-full h-8 hover:bg-[#ff7917] hover:bg-opacity-40 text-black text-left p-1 animate-accordion-down transition duration-200"
                                    >
                                        {template.name}
                                    </div>
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

export default TemplateSideBar;