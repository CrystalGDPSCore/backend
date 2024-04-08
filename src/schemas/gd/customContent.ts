import { z } from "zod";

export const getGJSongInfoSchema = z.object({
    songID: z.coerce.number().int(),
    secret: z.string()
});

export type GetGJSongInfoInput = z.infer<typeof getGJSongInfoSchema>;