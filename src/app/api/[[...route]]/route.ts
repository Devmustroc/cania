import {Context, Hono} from "hono";
import {handle} from "hono/vercel";
import images from "@/app/api/[[...route]]/images";
import ai from "@/app/api/[[...route]]/ai";
import users from "@/app/api/[[...route]]/users";
import {AuthConfig, initAuthConfig} from "@hono/auth-js";
import authConfig from "@/auth.config";
import projects from "@/app/api/[[...route]]/projects";
import subscriptions from "@/app/api/[[...route]]/subscriptions";


export const runtime = "nodejs";

function getAuthConfig(c: Context): AuthConfig {
    return {
        secret: c.env.AUTH_SECRET,
        ...authConfig
    }
}


const app = new Hono().basePath("/api");

app.use('*', initAuthConfig(getAuthConfig));


const routes = app
    .route("/ai", ai)
    .route('/users', users)
    .route("/images", images)
    .route('/projects', projects)
    .route('/subscriptions', subscriptions)





export const GET = handle(app);
export const POST = handle(app);
export const PATCH = handle(app);
export const PUT = handle(app);
export const DELETE = handle(app);

export type AppType = typeof routes;