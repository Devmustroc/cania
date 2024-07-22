import {z} from "zod";
import Google from "@auth/core/providers/google";
import GitHub from "@auth/core/providers/github";
import { JWT } from "next-auth/jwt";
import Credentials from "@auth/core/providers/credentials";
import {users} from "@/db/schema";
import {eq} from "drizzle-orm";
import bcrypt from "bcryptjs";
import {db} from "@/db/drizzle";
import {DrizzleAdapter} from "@auth/drizzle-adapter";
import {NextAuthConfig} from "next-auth";

declare module "next-auth/jwt" {
    interface JWT {
        id: string | undefined;
    }
}

declare module "@auth/core/jwt" {
    interface JWT {
        id: string | undefined;
    }

}

const CredentialsSchema = z.object({
    email: z.string(),
    password: z.string(),
})

export default  {
    adapter: DrizzleAdapter(db),
    providers: [
        Credentials({
            credentials: {
                email: {
                    label: 'Email',
                    type: 'email',
                },
                password: {
                    label: 'Password',
                    type: 'password',
                }
            },
            async authorize(credentials) {
                const credentialsFields = CredentialsSchema.safeParse(credentials);
                if (!credentialsFields.success) {
                    return null;
                }
                const { email, password} = credentialsFields.data;
                const query = await db.select().from(users).where(eq(users.email, email));
                const user = query[0];
                if (!user || !user.password) {
                    return null;
                }

                const passwordMatch = await bcrypt.compare(password, user.password);
                if (!passwordMatch) {
                    return null;
                }
                return user;
            }
        }),
        Google,
        GitHub
    ],
    pages: {
        signIn: "/sign-in",
        error: "/sign-in",
    },
    session: {
        strategy: "jwt",
    },
    callbacks: {
        session({ session, token }) {
            if (token.id) {
                session.user.id = token.id;
            }

            return session;
            },
        jwt({ token, user}) {
            if (user) {
                token.id = user.id;
            }
            return token;
        }
    }
} satisfies NextAuthConfig;