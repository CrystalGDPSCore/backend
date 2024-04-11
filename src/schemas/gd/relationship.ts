import { z } from "zod";

export const getGJUserListSchema = z.object({
    accountID: z.coerce.number().int(),
    gjp2: z.string(),
    type: z.coerce.number().int(),
    secret: z.string()
});

export type GetGJUserListInput = z.infer<typeof getGJUserListSchema>;

export const removeGJFriendSchema = z.object({
    accountID: z.coerce.number().int(),
    gjp2: z.string(),
    targetAccountID: z.coerce.number().int(),
    secret: z.string()
});

export type RemoveGJFriendInput = z.infer<typeof removeGJFriendSchema>;