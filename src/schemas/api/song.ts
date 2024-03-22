import { z } from "zod";

export const apiAddSongSchema = z.object({
    song: z.union([
        z.number().int(),
        z.string().url()
    ])
});

export const apiAddSongResponseSchema = z.object({
    success: z.boolean(),
    song: z.object({
        id: z.number().int(),
        name: z.string(),
        size: z.number(),
        resource: z.string(),
        link: z.string().url(),
        artist: z.object({
            name: z.string(),
            resource: z.string()
        })
    })
});

export type ApiAddSongInput = z.infer<typeof apiAddSongSchema>;