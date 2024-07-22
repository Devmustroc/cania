'use client';

import React, {useState} from 'react';
import {Card, CardContent, CardDescription, CardHeader, CardTitle} from "@/components/ui/card";
import {Button} from "@/components/ui/button";
import {FaGithub} from "react-icons/fa";
import {FcGoogle} from "react-icons/fc";
import Link from "next/link";
import {signIn} from "next-auth/react";
import Image from "next/image";
import {Input} from "@/components/ui/input";
import {Label} from "@/components/ui/label";
import {Separator} from "@/components/ui/separator";
import {useSearchParams} from "next/navigation";
import {AlertTriangle, Triangle} from "lucide-react";


const SignInForm = () => {
    const params = useSearchParams();
    const error = params.get("error");

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const onCredentialSignIn = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        signIn("credentials", {
            email: email,
            password: password,
            callbackUrl: "/"
        });
    }

    const onProviderSignIn = async (provider: "github" | "google") => {
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
                    Login to your account
                </CardTitle>
                <CardDescription
                    className="text-muted-foreground text-sm"
                >
                    Sign in to access your account
                </CardDescription>
            </CardHeader>
            {
                !!error && (
                    <div
                        className="bg-destructive/15 p-3 rounded-md flex items-center gap-x-2 text-sm text-destructive"
                    >
                        <AlertTriangle
                            className="text-yellow-600 size-4"
                        />
                        <p>
                            Email or password is incorrect
                        </p>
                    </div>
                )
            }
            <CardContent
                className="space-y-4 px-0 pb-0"
            >
                <form onSubmit={onCredentialSignIn}
                    className="space-y-2.5"
                >
                    <div>
                        <Label
                            className="text-sm"
                            htmlFor={"email"}
                        >
                            Email
                        </Label>
                        <Input
                            placeholder={"Email"}
                            required
                            value={email}
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
                            placeholder={"Password"}
                            value={password}
                            required
                            onChange={(e) => setPassword(e.target.value)}
                            type={"password"}
                        />
                    </div>
                    <Button
                        className="w-full relative"
                        type={"submit"}
                    >
                        Create Account
                    </Button>
                </form>
                <Separator
                    className="text-muted-foreground"
                />
                <div
                    className="flex flex-col  gap-4"
                >
                    <Button
                        onClick={() => onProviderSignIn("github")}
                        variant={"outline"}
                        size={"lg"}
                        className={"w-full relative"}
                    >
                        Sign in with GitHub
                        <FaGithub
                            className={"mr-2 size-5 top-3 left-3 absolute"}
                        />
                    </Button>
                    <Button
                        onClick={() => onProviderSignIn("google")}
                        variant={"outline"}
                        size={"lg"}
                        className={"w-full relative"}
                    >
                        Sign in with Google
                        <FcGoogle
                            className={"mr-2 size-5 top-3 left-3 absolute"}
                        />
                    </Button>
                </div>
                <p
                    className="text-sm text-muted-foreground"
                >
                    Don&apos;t have an account?
                    <Link href={"/sign-up"}>
                        <span
                            className="text-primary cursor-pointer ml-1 hover:underline"
                        >
                            Sign up
                        </span>
                    </Link>
                </p>
            </CardContent>
        </Card>
    );
};

export default SignInForm;