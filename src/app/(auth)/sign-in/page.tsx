import React from 'react';
import {auth} from "@/auth";
import {redirect} from "next/navigation";
import SignInForm from "@/features/auth/components/sign-in";



const SignInPage = async () => {
    const session = await auth();


    if (session) {
        redirect("/");
    }
    return <SignInForm/>
};

export default SignInPage;