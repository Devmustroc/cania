'use client';

import React from 'react';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import {Avatar, AvatarFallback, AvatarImage} from "@/components/ui/avatar";
import {useSession, signOut} from "next-auth/react";
import {CreditCard, Crown, Loader2, LogOut} from "lucide-react";
import {useRouter} from "next/navigation";
import {usePaywall} from "@/features/subscriptions/hooks/use-paywall";
import {useBilling} from "@/features/subscriptions/hooks/use-billing";

const UserButton = () => {
    const mutation = useBilling();
    const { shouldBeBlock, triggerPaywall, isLoading } = usePaywall();
    const session = useSession();

    const onClick = () => {
        if (shouldBeBlock) {
            triggerPaywall();
            return
        }
        mutation.mutate();
    }

    if (session.status === "loading") {
        return (
            <Loader2
                className="size-6 animate-spin text-muted-foreground"
            />
        )
    }

    if (session.status === "unauthenticated" || !session.data) {
        return null;
    }

    const name = session.data?.user?.name!;
    const imageUrl = session.data?.user?.image!;

    return (
        <DropdownMenu
            modal={false}
        >
            <DropdownMenuTrigger
                className="relative"
            >
                {
                    !shouldBeBlock && !isLoading && (
                        <div
                            className="absolute  -top-1 -left-3 z-10 flex items-center justify-center"
                        >
                            <div
                                className="rounded-full  text-white flex items-center justify-center bg-blue-500 w-6 h-6"
                            >
                                <Crown
                                    className="size-4 text-[#442781] fill-[#442781]"
                                />
                            </div>
                        </div>
                    )
                }
                <Avatar
                    className="size-10 hover:opacity-75 transition"
                >
                    <AvatarImage
                        alt={name}
                        src={imageUrl || ""}
                    />
                    <AvatarFallback
                        className="bg-sky-500 font-medium text-white text-sm leading-10 rounded-full"
                    >
                        {name.charAt(0).toUpperCase()}
                    </AvatarFallback>
                </Avatar>
            </DropdownMenuTrigger>
            <DropdownMenuContent
                align={"end"}
                className={"w-[200px] md:w-[250px]"}
            >
                <DropdownMenuItem
                    disabled={mutation.isPending}
                    onClick={onClick}
                    className="h-10 cursor-pointer"
                >
                    <CreditCard
                        className="size-6 mr-2"
                    />
                    Billing
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                    disabled={false}
                    onClick={() => signOut()}
                    className="h-10 cursor-pointer"
                >
                    <LogOut
                        className="size-6 mr-2"
                    />
                    Log Out
                </DropdownMenuItem>

            </DropdownMenuContent>
        </DropdownMenu>
    );
};

export default UserButton;