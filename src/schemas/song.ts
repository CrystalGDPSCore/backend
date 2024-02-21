import { z } from "zod";
import { buildJsonSchemas } from "fastify-zod";

// Web Schemas

export const songIDSchema = z.object({
    id: z.number().int()
});

export const getSongByIDResponseSchema = z.object({
    id: z.number().int(),
    artistId: z.number(),
    name: z.string(),
    size: z.number(),
    link: z.string().url()
});

export const apiAddSongSchema = z.object({
    song: z.union([
        z.number().int(),
        z.string().url()
    ])
});

export const addSongSchema = z.object({
    name: z.string(),
    size: z.number(),
    resource: z.string(),
    link: z.string().url()
});

export const addSongToMusicLibrarySchema = z.object({
    id: z.number().int(),
    name: z.string(),
    artistId: z.number().int(),
    size: z.number().int(),
    tagId: z.number().int()
});

export const addArtistToMusicLibrarySchema = z.object({
    id: z.number().int(),
    name: z.string()
});

export type songIDInput = z.infer<typeof songIDSchema>;
export type apiAddSongInput = z.infer<typeof apiAddSongSchema>;
export type addSongInput = z.infer<typeof addSongSchema>;
export type addSongToMusicLibraryInput = z.infer<typeof addSongToMusicLibrarySchema>;
export type addArtistToMusicLibraryInput = z.infer<typeof addArtistToMusicLibrarySchema>;

// GD Schemas

export const getGJSongInfoSchema = z.object({
    songID: z.string(),
    secret: z.string()
});

export type getGJSongInfoInput = z.infer<typeof getGJSongInfoSchema>;

export const { schemas: songSchemas, $ref: $songRef } = buildJsonSchemas({
    songIDSchema,
    getSongByIDResponseSchema,
    apiAddSongSchema,
    addSongSchema,
    getGJSongInfoSchema
}, { $id: "songSchema" });