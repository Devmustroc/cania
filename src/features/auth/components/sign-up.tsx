'use client';

import React, {useState} from 'react';
import {Card, CardContent, CardDescription, CardHeader, CardTitle} from "@/components/ui/card";
import {Button} from "@/components/ui/button";
import {FaGithub} from "react-icons/fa";
import {FcGoogle} from "react-icons/fc";
import Link from "next/link";
import { signIn } from "next-auth/react";
import Image from "next/image";
import {Label} from "@/components/ui/label";
import {Input} from "@/components/ui/input";
import {Separator} from "@/components/ui/separator";
import {useSignUp} from "@/features/auth/hooks/use-signup";
import {AlertTriangle, Loader2} from "lucide-react";



const SignUpForm = () => {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const mutation = useSignUp();

    const onCredentialSignOut = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        mutation.mutate({
            name,
            email,
            password
        }, {
            onSuccess: () => {
                signIn("credentials", {
                    email,
                    password,
                    callbackUrl: "/"
                });
            },
        })

    }

    const onProviderSignOut = async (provider: "github" | "google") => {
        signIn(provider, { callbackUrl: "/" });
    };
    return (
        <Card
            className="w-full h-full p-8"
        >
            <div
                className="flex justify-center mb-2"
            >
                <Image
                    src="/images/logo.svg"
                    alt="Logo"
                    width={100}
                    height={100}
                />
            </div>
            <CardHeader
                className="text-cente px-0 pb-4"
            >
                <CardTitle>
                    Create your account
                </CardTitle>
                <CardDescription
                    className="text-muted-foreground text-sm"
                >
                    create an account to access your account
                </CardDescription>
            </CardHeader>
            {
                !!mutation.error && (
                    <div
                        className="bg-destructive/15 p-3 rounded-md flex items-center gap-x-2 text-sm text-destructive"
                    >
                        <AlertTriangle
                            className="text-yellow-600 size-4"
                        />
                        <p>
                            Something went wrong. Please try again.
                        </p>
                    </div>
                )
            }
            <CardContent
                className="space-y-4 px-0 pb-0"
            >
                <form onSubmit={onCredentialSignOut}
                      className="space-y-2.5"
                >
                    <div>
                        <Label
                            className="text-sm"
                            htmlFor={"name"}
                        >
                            Full Name
                        </Label>
                        <Input
                            disabled={mutation.isPending}
                            placeholder={"Full Name"}
                            value={name}
                            required
                            type={"text"}
                            onChange={(e) => setName(e.target.value)}
                        />
                    </div>
                    <div>
                        <Label
                            className="text-sm"
                            htmlFor={"email"}
                        >
                            Email
                        </Label>
                        <Input
                            disabled={mutation.isPending}
                            placeholder={"Email"}
                            value={email}
                            required
                            type={"email"}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                    </div>
                    <div>
                        <Label
                            className="text-sm"
                            htmlFor={"password"}
                        >
                            Password
                        </Label>
                        <Input
                            disabled={mutation.isPending}
                            placeholder={"Password"}
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            type={"password"}
                            required
                            minLength={8}
                            maxLength={20}
                        />
                    </div>
                    <Button
                        size={"lg"}
                        disabled={mutation.isPending}
                        className="w-full relative"
                        type={"submit"}
                    >
                        {
                            mutation.isPending ? (
                                <Loader2
                                    className={"animate-spin size-5 top-3 left-3 absolute"}
                                />
                            ) : "Sign up"
                        }
                    </Button>
                </form>
                <Separator
                    className="text-muted-foreground"
                />
                <div
                    className="flex flex-col  gap-4"
                >
                    <Button
                        onClick={() => onProviderSignOut("github")}
                        variant={"outline"}
                        size={"lg"}
                        className={"w-full relative"}
                    >
                        Sign up with GitHub
                        <FaGithub
                            className={"mr-2 size-5 top-3 left-3 absolute"}
                        />
                    </Button>
                    <Button
                        onClick={() => onProviderSignOut("google")}
                        variant={"outline"}
                        size={"lg"}
                        className={"w-full relative"}
                    >
                        Sign up with Google
                        <FcGoogle
                            className={"mr-2 size-5 top-3 left-3 absolute"}
                        />
                    </Button>
                </div>
                <p
                    className="text-sm text-muted-foreground"
                >
                    Already have an account?
                    <Link href={"/sign-in"}>
                        <span
                            className="text-primary cursor-pointer ml-1 hover:underline"
                        >
                            Sign in
                        </span>
                    </Link>
                </p>
            </CardContent>
        </Card>
    );
};

export default SignUpForm;