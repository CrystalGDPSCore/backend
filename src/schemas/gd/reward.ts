import { z } from "zod";

export const getGJChallengesSchema = z.object({
    accountID: z.coerce.number(),
    gjp2: z.string(),
    udid: z.string(),
    chk: z.string(),
    secret: z.string()
});

export type GetGJChallengesInput = z.infer<typeof getGJChallengesSchema>;

export const getGJRewardsSchema = z.object({
    accountID: z.coerce.number(),
    gjp2: z.string(),
    udid: z.string(),
    chk: z.string(),
    rewardType: z.coerce.number(),
    secret: z.string()
});

export type GetGJRewardsInput = z.infer<typeof getGJRewardsSchema>;