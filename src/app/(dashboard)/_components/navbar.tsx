import React from 'react';
import UserButton from "@/features/auth/components/user-button";

const Navbar = () => {
    return (
        <nav
            className="w-full flex items-center h-[240px] bg-gradient-to-b from-[#ff7917] via-[#ff7917]/50 to-muted"
        >
            <div
                className="container mx-auto flex justify-between items-center"
            >
                <div
                    className={"ml-auto mr-4"}
                >
                    <UserButton/>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;