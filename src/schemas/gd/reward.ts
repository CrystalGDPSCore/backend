import { z } from "zod";

export const getGJChallengesSchema = z.object({
    accountID: z.coerce.number().int(),
    gjp2: z.string(),
    udid: z.string(),
    chk: z.string(),
    secret: z.string()
});

export type GetGJChallengesInput = z.infer<typeof getGJChallengesSchema>;

export const getGJRewardsSchema = z.object({
    accountID: z.coerce.number().int(),
    gjp2: z.string(),
    udid: z.string(),
    chk: z.string(),
    rewardType: z.enum(["0", "1", "2"]).transform(value => {
        switch (value) {
            case "0":
                return "None";
            case "1":
                return "Small";
            case "2":
                return "Big";
        }
    }),
    secret: z.string()
});

export type GetGJRewardsInput = z.infer<typeof getGJRewardsSchema>;