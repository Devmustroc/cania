'use client'

import React from 'react';
import Editor from "@/features/editor/components/editor";
import {useGetProject} from "@/features/projects/api/use-get-project";
import {AlertTriangle, Loader2} from "lucide-react";
import {Button} from "@/components/ui/button";
import Link from "next/link";


interface Props {
    params: {
        projectId: string;
    };
}


const EditorPage =  ({ params }: Props) => {
    const { data, isLoading, isError} = useGetProject(params.projectId);

    if (!params.projectId) {
        return (
            <div
                className="h-full flex flex-col items-center justify-center"
            >
                <AlertTriangle
                    size={48}
                    className="text-yellow-500"
                />
                <p
                    className="text-muted-foreground"
                >
                    Invalid project id
                </p>
                <Button
                    asChild
                    variant={"ghost"}
                    className="mt-4"
                >
                    <Link
                        href="/"

                    >
                        Back to dashboard
                    </Link>
                </Button>
            </div>
        )
    }

    if (isLoading || !data) {
        return (
            <div
                className="h-full flex flex-col items-center justify-center"
            >
                <Loader2
                    size={48}
                    className="text-muted-foreground animate-spin"
                />
            </div>
        )
    }

    if (isError) {
        return (
            <div
                className="h-full flex flex-col items-center justify-center"
            >
                <AlertTriangle
                    size={48}
                    className="text-yellow-500"
                />
                <p
                    className="text-muted-foreground"
                >
                    Failed to fetch project
                </p>
                <Button
                    asChild
                    variant={"ghost"}
                    className="mt-4"
                >
                    <Link
                        href="/"

                    >
                        Back to dashboard
                    </Link>
                </Button>
            </div>
        )
    }
    return (
        <Editor
            initialData={data}
        />
    );
};

export default EditorPage;