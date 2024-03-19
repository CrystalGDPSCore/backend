import { z } from "zod";

export const getGJChallengesSchema = z.object({
    accountID: z.coerce.number(),
    gjp2: z.string(),
    udid: z.string(),
    chk: z.string(),
    secret: z.string()
});

export type GetGJChallengesInput = z.infer<typeof getGJChallengesSchema>;