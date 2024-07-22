import {Hono} from "hono";
import {zValidator} from "@hono/zod-validator";
import {z, ZodPromise} from "zod";
import {replicate} from "@/lib/replicate";
import {verifyAuth} from "@hono/auth-js";

const app = new Hono()
    .post(
        "/generate-image",
        verifyAuth(),
        zValidator("json",
            z.object({
                prompt: z.string(),
            })),
        async (c) => {
            const { prompt } = c.req.valid('json');

            const input = {
                cfg: 3.5,
                steps: 28,
                prompt: prompt,
                aspect_ratio: "3:2",
                output_format: "webp",
                output_quality: 90,
                negative_prompt: "",
                prompt_strength: 0.85
            };

            const output = await replicate.run("stability-ai/stable-diffusion-3", { input });
            const res = output as Array<string>

            return c.json({ data :  res[0] });
        }
    )
    .post(
        '/remove-bg',
        verifyAuth(),
        zValidator("json",
            z.object({
                image: z.string(),
            })
        ),
        async (c) => {
            const { image } = c.req.valid('json');
            const input = {
                image: image,
            };
            const output: unknown = await replicate.run("cjwbw/rembg:fb8af171cfa1616ddcf1242c093f9c46bcada5ad4cf6f2fbe8b81b330ec5c003", { input });
            const res = output as string;

            return c.json({ data: res });
        }
    )
    .post('/sticker',
        verifyAuth(),
        zValidator("json",
            z.object({
                prompt: z.string(),
                image: z.string(),
            }),
        ),
        async (c) => {
            const { prompt, image } = c.req.valid('json');
            const output: unknown = await replicate.run(
                "fofr/face-to-sticker:764d4827ea159608a07cdde8ddf1c6000019627515eb02b6b449695fd547e5ef",
                {
                    input: {
                        image: image,
                        steps: 20,
                        width: 1024,
                        height: 1024,
                        prompt: prompt,
                        upscale: false,
                        upscale_steps: 10,
                        negative_prompt: "",
                        prompt_strength: 4.5,
                        ip_adapter_noise: 0.5,
                        ip_adapter_weight: 0.2,
                        instant_id_strength: 0.7
                    }
                }
            );
            const res = output as string;

            return c.json({ data: res });
        }
    )
    .post(
        '/scale',
        verifyAuth(),
        zValidator("json",
            z.object({
                image: z.string(),
            })),
        async (c) => {
            const { image } = c.req.valid('json');

            const output: unknown = await replicate.run(
                "nightmareai/real-esrgan:f0992969a94014d73864d08e6d9a39286868328e4263d9ce2da6fc4049d01a1a",
                {
                    input: {
                        image: image,
                        scale: 2,
                        face_enhance: false
                    }
                }
            );

            const res = output as string;

            return c.json({ data: res });
        }

    )

export default app;