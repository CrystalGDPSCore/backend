import { z } from "zod";

export const createSongSchema = z.object({
    name: z.string().regex(/^[ -/0-9:-@[-`{-~a-zA-Z]+$/),
    size: z.number(),
    resource: z.string().regex(/^(ng:[0-9]+)|(yt:[0-9a-zA-Z-_]+)$/),
    link: z.string().url(),
    artist: z.object({
        name: z.string().regex(/^[0-9a-zA-Z-_]+$/),
        resource: z.string().regex(/^(ng:[0-9a-z-]+)|(yt:[0-9a-zA-Z-_]+)$/)
    })
});

export type CreateSongInput = z.infer<typeof createSongSchema>;