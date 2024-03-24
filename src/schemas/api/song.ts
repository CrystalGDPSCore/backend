import { z } from "zod";

export const apiGetSongInfoSchema = z.object({
    id: z.number().int()
});

export const apiGetSongInfoResponseSchema = z.object({
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

export type ApiGetSongInfoInput = z.infer<typeof apiGetSongInfoSchema>;

export const apiAddSongSchema = z.object({
    song: z.union([
        z.number().int(),
        z.string().url()
    ])
});

export const apiAddSongResponseSchema = apiGetSongInfoResponseSchema.extend({});

export type ApiAddSongInput = z.infer<typeof apiAddSongSchema>;