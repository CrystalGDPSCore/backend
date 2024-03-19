import { z } from "zod";

export const songInfoObjSchema = z.object({
    id: z.number().int(),
    name: z.string().regex(/^[ -/0-9:-@[-`{-~a-zA-Z]+$/),
    artistId: z.number().int(),
    size: z.number(),
    length: z.number().int(),
    tagId: z.number().int()
});

export type songInfoObj = z.infer<typeof songInfoObjSchema>;

export const artistInfoObjSchema = z.object({
    id: z.number().int(),
    name: z.string().regex(/^[0-9a-zA-Z-_]+$/)
});

export type artistInfoObj = z.infer<typeof artistInfoObjSchema>;