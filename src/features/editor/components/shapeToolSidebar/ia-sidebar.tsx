import React, {useState} from 'react';

import {cn} from "@/lib/utils";
import {ActiveTool, EditorProps} from "../../types";
import ToolSidebarHeader from "./tool-sidebar-header";
import {ScrollArea} from "@/components/ui/scroll-area";
import ToolSidebarClose from "./tool-sidebar-close";
import {Textarea} from "@/components/ui/textarea";
import {Button} from "@/components/ui/button";
import {useGenerateImage} from "@/features/ia/api/use-generate-image";
import {usePaywall} from "@/features/subscriptions/hooks/use-paywall";


interface IAProps {
    editor: EditorProps | undefined;
    activeTool: ActiveTool;
    onChangeActiveTool: (tool: ActiveTool) => void;
}

const AiSideBar = ({
                          editor,
                          activeTool,
                          onChangeActiveTool,
                      }: IAProps) => {
    const subscription = usePaywall();
    const [value, setValue] = useState("")

    const mutation = useGenerateImage();

    const onSubmit =  (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        if (subscription.shouldBeBlock) {
            subscription.triggerPaywall();
            return;
        }
        
       mutation.mutate({ prompt: value}, {
              onSuccess: ({ data }) => {
                  editor?.addImage(data);
              }
       })
    }

    const onClose = () => {
        onChangeActiveTool("select");
    }

    return (
        <aside
            className={cn(
                `bg-white relative border-r z-[40] w-[360px] h-full flex flex-col`,
                activeTool === "ai" ? "block" : "hidden"
            )}
        >
            <ToolSidebarHeader title={"AI"} description={"Generate Image using AI"} />
            <ScrollArea>
                    <form
                        onSubmit={onSubmit}
                        className="p-4 space-y-6">
                        <Textarea
                            disabled={mutation.isPending}
                            value={value}
                            placeholder="a photo of vibrant artistic graffiti on a wall saying `welcome to the Cania`"
                            cols={30}
                            rows={10}
                            required={true}
                            minLength={3}
                            onChange={(e) => setValue(e.target.value)}
                        />
                        <Button
                            disabled={mutation.isPending}
                            type="submit"
                            className="w-full"
                        >
                            Generate
                        </Button>
                    </form>
            </ScrollArea>
            <ToolSidebarClose closeSidebar={onClose} />
        </aside>
    );
};

export default AiSideBar;