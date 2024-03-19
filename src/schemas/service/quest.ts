import { z } from "zod";

export const questInfoSchema = z.object({
    id: z.number().int(),
    type: z.enum(["Orbs", "Coins", "Stars"]),
    amount: z.number().int(),
    reward: z.number().int(),
    name: z.string()
});

export type QuestInfo = z.infer<typeof questInfoSchema>;