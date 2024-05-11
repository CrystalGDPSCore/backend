import { SuggestDifficulty, LevelRating } from "@prisma/client";

import { z } from "zod";

const createLevelSuggestSchema = z.object({
    suggestById: z.number().int(),
    levelId: z.number().int(),
    difficulty: z.nativeEnum(SuggestDifficulty),
    ratingType: z.nativeEnum(LevelRating),
    stars: z.number().int()
});

export type CreateLevelSuggestInput = z.infer<typeof createLevelSuggestSchema>;