import { z } from "zod";

export const getSfxFileSchema = z.object({
    file: z.string()
});

export type GetSfxFileInput = z.infer<typeof getSfxFileSchema>;

export const getMp3FileSchema = z.object({
    songId: z.coerce.number().int()
});

export type GetMp3FileInput = z.infer<typeof getMp3FileSchema>;