import { LevelLength, Visibility, LevelRating } from "@prisma/client";

import { z } from "zod";

const createLevelSchema = z.object({
    id: z.number().int(),
    authorId: z.number().int(),
    name: z.string(),
    description: z.string(),
    length: z.nativeEnum(LevelLength),
    visibility: z.nativeEnum(Visibility),
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
    length: z.nativeEnum(LevelLength),
    visibility: z.nativeEnum(Visibility),
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

export type UpdateLevelInput = z.infer<typeof updateLevelSchema>;

const rateLevelSchema = z.object({
    difficulty: z.enum(["Auto", "Easy", "Normal", "Hard", "Harder", "Insane", "HardDemon"]),
    ratingType: z.nativeEnum(LevelRating),
    stars: z.number().int()
});

export type RateLevelInput = z.infer<typeof rateLevelSchema>;