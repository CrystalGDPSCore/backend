import { z } from "zod";

export const apiLoginUserSchema = z.object({
    name: z.string().regex(/^[0-9a-zA-Z]{3,15}$/),
    password: z.string()
});

export const apiLoginUserResponseSchema = z.object({
    success: z.boolean(),
    user: z.object({
        token: z.string()
    })
});

export type ApiLoginUserInput = z.infer<typeof apiLoginUserSchema>;