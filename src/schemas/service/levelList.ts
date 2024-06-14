import { Visibility, Difficulty } from "@prisma/client";

import { z } from "zod";

const createLevelListSchema = z.object({
    authorId: z.number().int(),
    name: z.string(),
    description: z.string(),
    visibility: z.nativeEnum(Visibility),
    difficulty: z.nativeEnum(Difficulty),
    originalListId: z.number().int(),
    levelIds: z.array(z.number().int())
});

export type CreateLevelListInput = z.infer<typeof createLevelListSchema>;

const updateLevelListSchema = z.object({
    description: z.string(),
    visibility: z.nativeEnum(Visibility),
    difficulty: z.nativeEnum(Difficulty),
    levelIds: z.array(z.number().int())
});

export type UpdateLevelListInput = z.infer<typeof updateLevelListSchema>;