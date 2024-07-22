'use client'

import React from 'react';
import {Table, TableBody, TableCell, TableRow} from "@/components/ui/table";
import {useGetAllProjects} from "@/features/projects/api/use-get-Allproject";
import {AlertTriangle, CopyIcon, FileIcon, Loader2, MoreHorizontal, Search, Trash} from "lucide-react";
import {useRouter} from "next/navigation";
import {formatDistanceToNow} from "date-fns";
import {DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger} from "@/components/ui/dropdown-menu";
import {Button} from "@/components/ui/button";
import {useDuplicateProject} from "@/features/projects/api/use-duplicate-project";
import {useDeleteProject} from "@/features/projects/api/use-delete-project";
import useConfirm from "@/hooks/use-confirm";

const ProjectsSection = () => {
    const duplicateMutation = useDuplicateProject();
    const deleteMutation = useDeleteProject();
    const [ConfirmDialog, confirm] = useConfirm(
        "Delete project",
        "Are you sure you want to delete this project?"
    );
    const router = useRouter();

    const onCopy = (id: string) => {
        duplicateMutation.mutate({ id });
    }
    const onDelete = async (id: string) => {
        const ok = await confirm();

        if (ok) {
            deleteMutation.mutate({ id });
        };

    }
    const {
        data,
        status,
        fetchNextPage,
        hasNextPage,
        isFetchingNextPage,
        isFetching
    } = useGetAllProjects();

    if (status === "pending") {
        return (
            <div
                className="space-y-4"
            >
                <h3
                    className="font-semibold text-lg"
                >
                    Recent projects
                </h3>
                <div
                    className="flex flex-col items-center justify-center h-32"
                >
                    <Loader2
                        size={24}
                        className="text-gray-400 animate-spin"
                    />
                    <p
                        className="text-muted-foreground text-sm"
                    >
                        Loading ...
                    </p>
                </div>
            </div>
        )
    }

    if (status === "error") {
        return (
            <div
                className="space-y-4"
            >
                <h3
                    className="font-semibold text-lg"
                >
                    Recent projects
                </h3>
                <div
                    className="flex flex-col items-center justify-center h-32"
                >
                    <AlertTriangle
                        size={24}
                        className="text-gray-400"
                    />
                </div>
            </div>
        )
    }


    if (!data.pages.length || !data.pages[0].data.length) {
        return (
            <div
                className="space-y-4"
            >
                <h3
                    className="font-semibold text-lg"
                >
                    Recent projects
                </h3>
                <div
                    className="flex flex-col items-center justify-center h-32"
                >
                    <Search
                        size={24}
                        className="text-gray-400"
                    />
                    <p
                        className="text-muted-foreground text-sm"
                    >
                        No projects found
                    </p>
                </div>
            </div>
        )
    }

    return (
        <div
            className="space-y-4"
        >
            <ConfirmDialog />
            <h3
                className="font-semibold text-lg"
            >
                Recent projects
            </h3>
            <Table>
                <TableBody>
                    {
                        data.pages.map((group, idx) => (
                            <React.Fragment
                                key={idx}
                            >
                                {
                                    group.data.map((proj) => (
                                        <TableRow
                                            key={proj.id}
                                        >
                                            <TableCell
                                                onClick={() => router.push(`/editor/${proj.id}`)}
                                                className="font-medium flex items-center gap-x-2 cursor-pointer"
                                            >
                                                <FileIcon
                                                    className="text-gray-400"
                                                />
                                                {proj.name}
                                            </TableCell>
                                            <TableCell
                                                className="hidden md:table-cell cursor-pointer text-muted-foreground"
                                            >
                                                {proj.width} x {proj.height} px
                                            </TableCell>
                                            <TableCell
                                                className="hidden md:table-cell cursor-pointer text-muted-foreground"
                                            >
                                                {formatDistanceToNow(proj.createdAt, {addSuffix: true})}
                                            </TableCell>
                                            <TableCell
                                                className="flex items-center justify-end"
                                            >
                                                <DropdownMenu
                                                    modal={false}
                                                >
                                                    <DropdownMenuTrigger asChild>
                                                        <Button
                                                            disabled={false}
                                                            size={"icon"}
                                                            variant={"ghost"}
                                                        >
                                                            <MoreHorizontal
                                                                size={24}
                                                                className="text-gray-400"
                                                            />
                                                        </Button>
                                                    </DropdownMenuTrigger>
                                                    <DropdownMenuContent
                                                        align={"end"}
                                                        className={"w-48"}
                                                    >
                                                        <DropdownMenuItem
                                                            className="h-10 cursor-pointer"
                                                            disabled={duplicateMutation.isPending}
                                                            onClick={() => onCopy(proj.id)}
                                                        >
                                                            <CopyIcon
                                                                size={16}
                                                                className="mr-2"
                                                            />
                                                            Make copy
                                                        </DropdownMenuItem>
                                                        <DropdownMenuItem
                                                            className="h-10 cursor-pointer"
                                                            disabled={deleteMutation.isPending}
                                                            onClick={() => onDelete(proj.id)}
                                                        >
                                                            <Trash
                                                                size={16}
                                                                className="mr-2"
                                                            />
                                                            Delete
                                                        </DropdownMenuItem>
                                                    </DropdownMenuContent>
                                                </DropdownMenu>
                                            </TableCell>
                                        </TableRow>
                                    ))
                                }
                            </React.Fragment>
                        ))
                    }
                </TableBody>
            </Table>
            {
                hasNextPage && (
                    <div
                        className="w-full flex items-center justify-center pt-4"
                    >
                        <Button
                            variant={"ghost"}
                            onClick={() => fetchNextPage()}
                            disabled={isFetchingNextPage}
                        >
                            {isFetchingNextPage ? (
                                <Loader2
                                    size={16}
                                    className="animate-spin"
                                />
                            ) : "Load more"}
                        </Button>
                    </div>
                )
            }
        </div>
    );
};

export default ProjectsSection;