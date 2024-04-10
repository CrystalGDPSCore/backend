import { z } from "zod";

export const blockGJUserSchema = z.object({
    accountID: z.coerce.number().int(),
    gjp2: z.string(),
    targetAccountID: z.coerce.number().int(),
    secret: z.string()
});

export type BlockGJUserInput = z.infer<typeof blockGJUserSchema>;

export const unblockGJUserSchema = blockGJUserSchema.extend({});

export type UnblockGJUserInput = z.infer<typeof unblockGJUserSchema>;