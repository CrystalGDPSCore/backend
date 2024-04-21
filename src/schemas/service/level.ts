import { z } from "zod";

const createLevelSchema = z.object({
    id: z.number().int(),
    authorId: z.number().int(),
    name: z.string(),
    description: z.string(),
    version: z.number().int(),
    length: z.enum(["Tiny", "Short", "Medium", "Long", "XL", "Platformer"]),
    visibility: z.enum(["Listed", "FriendsOnly", "Unlisted"]),
    originalLevelId: z.number().int(),
    requestedStars: z.number().int(),
    coins: z.number().int(),
    objectsCount: z.number().int(),
    defaultSongId: z.number().int(),
    sfxIds: z.array(z.number().int()),
    songIds: z.array(z.number().int()),
    isCustomSong: z.boolean(),
    hasLdm: z.boolean(),
    hasTwoPlayerMode: z.boolean()
});

export type CreateLevelInput = z.infer<typeof createLevelSchema>;

const updateLevelSchema = z.object({
    description: z.string(),
    version: z.number().int(),
    length: z.enum(["Tiny", "Short", "Medium", "Long", "XL", "Platformer"]),
    visibility: z.enum(["Listed", "FriendsOnly", "Unlisted"]),
    requestedStars: z.number().int(),
    coins: z.number().int(),
    objectsCount: z.number().int(),
    defaultSongId: z.number().int(),
    sfxIds: z.array(z.number().int()),
    songIds: z.array(z.number().int()),
    isCustomSong: z.boolean(),
    hasLdm: z.boolean(),
    hasTwoPlayerMode: z.boolean(),
    updateDate: z.date()
});

export type UpdateLevelInput = z.infer<typeof updateLevelSchema>;