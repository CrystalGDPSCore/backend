import { z } from "zod";

const createDifficultySuggestSchema = z.object({
    suggestById: z.number().int(),
    levelId: z.number().int(),
    stars: z.number().int()
});

export type CreateDifficultySuggestInput = z.infer<typeof createDifficultySuggestSchema>;