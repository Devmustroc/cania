import React from 'react';
import {auth} from "@/auth";
import {redirect} from "next/navigation";
import SignUpForm from "@/features/auth/components/sign-up";

const SignUptPage = async () => {
    const session = await auth();

    if (session) {
        redirect("/");
    }

    return <SignUpForm />
};

export default SignUptPage;